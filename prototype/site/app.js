const SEQUENCE_CONFIG = {
  rootSelector: ".scroll-sequence",
  canvasSelector: "#frameCanvas",
  frameDir: "frames",
  frameCount: 363,
  desktopFit: "contain",
  mobileFit: "cover",
  initialFrame: 0,
};

const INITIAL_PRELOAD = 12;
const PRELOAD_RADIUS = 28;
const IDLE_BATCH_SIZE = 8;
const MAX_CONCURRENT_REQUESTS = 5;
const WARMUP_DELAY_MS = 900;

const doc = document.documentElement;
const loader = document.getElementById("loader");
const loaderBar = document.getElementById("loaderBar");
const loaderText = document.getElementById("loaderText");
const scrollProgress = document.getElementById("scrollProgress");
const siteNav = document.getElementById("siteNav");
const root = document.querySelector(SEQUENCE_CONFIG.rootSelector);
const canvas = document.querySelector(SEQUENCE_CONFIG.canvasSelector);
const ctx = canvas.getContext("2d", { alpha: false });
const sequenceLine = document.getElementById("sequenceLine");
const activeStep = document.getElementById("activeStep");
const panels = [...document.querySelectorAll(".sequence-panel")];

const frameCache = new Array(SEQUENCE_CONFIG.frameCount);
const pendingFrames = new Map();
const loadQueue = [];

let currentFrame = -1;
let requestedFrame = SEQUENCE_CONFIG.initialFrame;
let lastDrawnFrame = -1;
let ticking = false;
let isReady = false;
let initialLoaded = 0;
let warmIndex = INITIAL_PRELOAD;
let activeLoads = 0;

window.__kaigoPerf = {
  draws: [],
  requestedFrames: [],
  loadedFrames: 0,
  frameCount: SEQUENCE_CONFIG.frameCount,
};

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function frameSrc(index) {
  return `/${SEQUENCE_CONFIG.frameDir}/frame_${String(index + 1).padStart(4, "0")}.webp`;
}

function setDocVar(name, value) {
  doc.style.setProperty(name, value);
}

function updateLoader() {
  const pct = Math.round((initialLoaded / INITIAL_PRELOAD) * 100);
  loaderBar.style.width = `${pct}%`;
  loaderText.textContent = `Готовлю первые кадры ${pct}%`;
}

function markLoaded(index, img) {
  frameCache[index] = img;
  pendingFrames.delete(index);
  window.__kaigoPerf.loadedFrames += 1;
  if (index < INITIAL_PRELOAD) {
    initialLoaded += 1;
    updateLoader();
  }
}

function loadImage(index) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const finish = () => {
        markLoaded(index, img);
        if (isReady && (index === requestedFrame || index === SEQUENCE_CONFIG.initialFrame)) {
          requestAnimationFrame(() => drawFrame(requestedFrame));
        }
        resolve(img);
      };

      if (typeof img.decode === "function") {
        img.decode().then(finish).catch(finish);
      } else {
        finish();
      }
    };
    img.onerror = () => {
      pendingFrames.delete(index);
      if (index < INITIAL_PRELOAD) {
        initialLoaded += 1;
        updateLoader();
      }
      console.warn(`Frame failed to load: ${img.src}`);
      resolve(null);
    };
    img.src = frameSrc(index);
  });
}

function drainLoadQueue() {
  while (activeLoads < MAX_CONCURRENT_REQUESTS && loadQueue.length > 0) {
    const item = loadQueue.shift();
    activeLoads += 1;
    loadImage(item.index)
      .then(item.resolve)
      .finally(() => {
        activeLoads -= 1;
        drainLoadQueue();
      });
  }
}

function loadFrame(index, priority = false) {
  if (index < 0 || index >= SEQUENCE_CONFIG.frameCount) return Promise.resolve(null);
  if (frameCache[index]) return Promise.resolve(frameCache[index]);
  if (pendingFrames.has(index)) return pendingFrames.get(index);

  const promise = new Promise((resolve) => {
    const item = { index, resolve };
    if (priority) {
      loadQueue.unshift(item);
    } else {
      loadQueue.push(item);
    }
    drainLoadQueue();
  });

  pendingFrames.set(index, promise);
  return promise;
}

function preloadInitialFrames() {
  const initial = Array.from({ length: INITIAL_PRELOAD }, (_, index) => loadFrame(index, true));
  Promise.all(initial).then(() => {
    isReady = true;
    resizeCanvas();
    drawFrame(SEQUENCE_CONFIG.initialFrame);
    document.body.classList.add("is-ready");
    loader.classList.add("is-hidden");
    updateFromScroll();
    window.setTimeout(scheduleIdleWarmup, WARMUP_DELAY_MS);
  });
}

function scheduleIdle(callback) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 900 });
    return;
  }
  window.setTimeout(() => callback({ timeRemaining: () => 12 }), 60);
}

function scheduleIdleWarmup() {
  scheduleIdle((deadline) => {
    let loadedInBatch = 0;
    while (
      warmIndex < SEQUENCE_CONFIG.frameCount &&
      loadedInBatch < IDLE_BATCH_SIZE &&
      deadline.timeRemaining() > 2
    ) {
      loadFrame(warmIndex);
      warmIndex += 1;
      loadedInBatch += 1;
    }

    if (warmIndex < SEQUENCE_CONFIG.frameCount) {
      scheduleIdleWarmup();
    }
  });
}

function preloadAround(index) {
  for (let offset = 0; offset <= PRELOAD_RADIUS; offset += 1) {
    const priority = offset <= 6;
    loadFrame(index - offset, priority);
    if (offset !== 0) loadFrame(index + offset, priority);
  }
}

function nearestLoadedFrame(index) {
  if (frameCache[index]) return index;

  for (let radius = 1; radius <= PRELOAD_RADIUS; radius += 1) {
    const before = index - radius;
    const after = index + radius;
    if (before >= 0 && frameCache[before]) return before;
    if (after < SEQUENCE_CONFIG.frameCount && frameCache[after]) return after;
  }

  return lastDrawnFrame >= 0 ? lastDrawnFrame : SEQUENCE_CONFIG.initialFrame;
}

function resizeCanvas() {
  const dprCap = window.innerWidth < 720 ? 1.25 : 1.5;
  const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  const width = Math.round(window.innerWidth * dpr);
  const height = Math.round(window.innerHeight * dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    currentFrame = -1;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  drawFrame(requestedFrame);
}

function drawContainedImage(img) {
  const cw = canvas.width;
  const ch = canvas.height;
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = cw / ch;
  const isMobile = window.innerWidth < 720;
  const fit = isMobile ? SEQUENCE_CONFIG.mobileFit : SEQUENCE_CONFIG.desktopFit;
  let drawW;
  let drawH;

  if (fit === "contain") {
    if (canvasRatio > imgRatio) {
      drawH = ch;
      drawW = drawH * imgRatio;
    } else {
      drawW = cw;
      drawH = drawW / imgRatio;
    }
  } else if (canvasRatio > imgRatio) {
    drawW = cw;
    drawH = drawW / imgRatio;
  } else {
    drawH = ch;
    drawW = drawH * imgRatio;
  }

  const drawX = (cw - drawW) / 2;
  const drawY = (ch - drawH) / 2;
  ctx.fillStyle = "#17120f";
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

function drawFrame(index) {
  if (!isReady) return;

  requestedFrame = clamp(index, 0, SEQUENCE_CONFIG.frameCount - 1);
  preloadAround(requestedFrame);

  const drawableIndex = nearestLoadedFrame(requestedFrame);
  const img = frameCache[drawableIndex];
  if (!img || !img.complete || img.naturalWidth === 0) return;
  if (drawableIndex === currentFrame && canvas.width > 0) return;

  const startedAt = performance.now();
  currentFrame = drawableIndex;
  lastDrawnFrame = drawableIndex;
  drawContainedImage(img);
  const drawTime = performance.now() - startedAt;

  doc.dataset.frameIndex = String(drawableIndex);
  doc.dataset.requestedFrameIndex = String(requestedFrame);
  doc.setAttribute("data-frame-index", String(drawableIndex));
  doc.setAttribute("data-requested-frame-index", String(requestedFrame));
  window.__kaigoPerf.draws.push(Number(drawTime.toFixed(3)));
  window.__kaigoPerf.requestedFrames.push(requestedFrame);

  if (window.__kaigoPerf.draws.length > 180) {
    window.__kaigoPerf.draws.shift();
    window.__kaigoPerf.requestedFrames.shift();
  }
}

function sequenceProgress() {
  const rect = root.getBoundingClientRect();
  const scrollable = root.offsetHeight - window.innerHeight;
  return clamp(-rect.top / Math.max(1, scrollable));
}

function panelOpacity(progress, start, end) {
  const fadeIn = smoothstep((progress - start) / 0.07);
  const fadeOut = 1 - smoothstep((progress - (end - 0.08)) / 0.08);
  return clamp(fadeIn * fadeOut);
}

function updatePanels(progress) {
  const sceneData = [
    { start: -0.05, end: 0.48, step: "01", x: -16, y: 24 },
    { start: 0.44, end: 0.78, step: "02", x: 24, y: 22 },
    { start: 0.74, end: 1.18, step: "03", x: -18, y: 22 },
  ];

  let active = "01";
  panels.forEach((panel, index) => {
    const scene = sceneData[index];
    const opacity = panelOpacity(progress, scene.start, scene.end);
    const local = clamp((progress - scene.start) / Math.max(0.001, scene.end - scene.start));
    const travel = smoothstep(local);
    panel.style.opacity = opacity.toFixed(4);
    panel.style.transform = `translate3d(${((1 - travel) * scene.x).toFixed(1)}px, ${((1 - travel) * scene.y).toFixed(1)}px, 0)`;
    panel.classList.toggle("is-active", opacity > 0.2);
    if (opacity > 0.28) active = scene.step;
  });

  activeStep.textContent = active;
  setDocVar("--active-scene", active);
}

function updatePageProgress(progress) {
  const max = doc.scrollHeight - window.innerHeight;
  const pagePct = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollProgress.style.transform = `scaleX(${pagePct / 100})`;
  siteNav.classList.toggle("is-quiet", progress < 0.06);
  siteNav.classList.toggle("is-complete", progress > 0.9);
}

function updateFromScroll() {
  ticking = false;

  const progress = sequenceProgress();
  const frameIndex = Math.round(progress * (SEQUENCE_CONFIG.frameCount - 1));

  setDocVar("--sequence-progress", progress.toFixed(5));
  setDocVar("--sequence-frame-index", String(frameIndex));
  root.style.setProperty("--sequence-progress", progress.toFixed(5));

  if (sequenceLine) {
    sequenceLine.style.transform = `scaleY(${progress.toFixed(5)})`;
  }

  updatePageProgress(progress);
  updatePanels(progress);
  drawFrame(frameIndex);
}

function requestScrollUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateFromScroll);
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", () => {
  resizeCanvas();
  requestScrollUpdate();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

setDocVar("--sequence-progress", "0");
setDocVar("--sequence-frame-index", "0");
doc.dataset.frameIndex = "0";
doc.dataset.requestedFrameIndex = "0";
doc.setAttribute("data-frame-index", "0");
doc.setAttribute("data-requested-frame-index", "0");
updateLoader();
preloadInitialFrames();
