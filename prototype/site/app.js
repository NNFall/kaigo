const SEQUENCE_CONFIGS = [
  {
    rootSelector: ".scroll-sequence--intro",
    canvasSelector: "#frameCanvas",
    frameDir: "frames",
    frameCount: 73,
    revealStart: 0.02,
    revealLength: 0.24,
    frameHoldEnd: 0.58,
    messageInStart: 0.16,
    messageInLength: 0.14,
    messageOutStart: 0.93,
    messageOutLength: 0.07,
    desktopZoom: 1.06,
    mobileZoom: 1.18,
  },
  {
    rootSelector: ".scroll-sequence--next",
    canvasSelector: "#frameCanvasNext",
    frameDir: "frames-next",
    frameCount: 73,
    revealStart: 0.01,
    revealLength: 0.22,
    frameHoldEnd: 0.54,
    messageInStart: 0.14,
    messageInLength: 0.14,
    messageOutStart: 0.92,
    messageOutLength: 0.08,
    desktopZoom: 1.06,
    mobileZoom: 1.18,
  },
];

const doc = document.documentElement;
const loader = document.getElementById("loader");
const loaderBar = document.getElementById("loaderBar");
const loaderText = document.getElementById("loaderText");
const scrollProgress = document.getElementById("scrollProgress");
const siteNav = document.getElementById("siteNav");
const heroArrival = document.querySelector(".hero-arrival");
const totalFrames = SEQUENCE_CONFIGS.reduce((sum, config) => sum + config.frameCount, 0);
const sequences = SEQUENCE_CONFIGS.map((config) => {
  const root = document.querySelector(config.rootSelector);
  const canvas = document.querySelector(config.canvasSelector);
  return {
    ...config,
    root,
    canvas,
    ctx: canvas.getContext("2d"),
    frames: [],
    currentFrame: -1,
    lastProgress: 0,
    line: root.querySelector(".sequence-progress__line i"),
  };
});

let loadedFrames = 0;
let ticking = false;
let isReady = false;

document.querySelectorAll(".sequence-message h2").forEach((heading) => {
  heading.textContent = heading.textContent.replace("AI-", "AI\u2011");
});

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function frameSrc(sequence, index) {
  return `/${sequence.frameDir}/frame_${String(index + 1).padStart(4, "0")}.webp`;
}

function setDocVar(name, value) {
  doc.style.setProperty(name, value);
}

function setSequenceVar(sequence, name, value) {
  sequence.root.style.setProperty(name, value);
}

function updateLoader() {
  const pct = Math.round((loadedFrames / totalFrames) * 100);
  loaderBar.style.width = `${pct}%`;
  loaderText.textContent = `Loading cinematic frames ${pct}%`;

  if (loadedFrames >= totalFrames && !isReady) {
    isReady = true;
    resizeCanvases();
    sequences.forEach((sequence) => drawFrame(sequence, 0));
    requestAnimationFrame(() => {
      document.body.classList.add("is-ready");
      loader.classList.add("is-hidden");
      updateFromScroll();
    });
  }
}

function preloadFrames() {
  sequences.forEach((sequence) => {
    for (let i = 0; i < sequence.frameCount; i += 1) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        loadedFrames += 1;
        updateLoader();
      };
      img.onerror = () => {
        loadedFrames += 1;
        console.warn(`Frame failed to load: ${img.src}`);
        updateLoader();
      };
      img.src = frameSrc(sequence, i);
      sequence.frames.push(img);
    }
  });
}

function resizeCanvases() {
  const dpr = window.devicePixelRatio || 1;
  sequences.forEach((sequence) => {
    sequence.canvas.width = Math.round(window.innerWidth * dpr);
    sequence.canvas.height = Math.round(window.innerHeight * dpr);
    sequence.canvas.style.width = `${window.innerWidth}px`;
    sequence.canvas.style.height = `${window.innerHeight}px`;
    const index =
      sequence.currentFrame >= 0
        ? sequence.currentFrame
        : Math.floor(updateFrameHoldProgress(sequence.lastProgress, sequence.frameHoldEnd) * (sequence.frameCount - 1));
    drawFrame(sequence, index);
  });
}

function drawFrame(sequence, index) {
  const img = sequence.frames[index];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  sequence.currentFrame = index;
  const { canvas, ctx } = sequence;
  const cw = canvas.width;
  const ch = canvas.height;
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = cw / ch;
  const isMobile = window.innerWidth < 780;
  const zoom = isMobile ? sequence.mobileZoom : sequence.desktopZoom;
  let drawW;
  let drawH;

  if (canvasRatio > imgRatio) {
    drawW = cw * zoom;
    drawH = drawW / imgRatio;
  } else {
    drawH = ch * zoom;
    drawW = drawH * imgRatio;
  }

  const drawX = (cw - drawW) / 2;
  const drawY = (ch - drawH) / 2;
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

function getSequenceProgress(sequence) {
  const rect = sequence.root.getBoundingClientRect();
  const scrollable = sequence.root.offsetHeight - window.innerHeight;
  return clamp(-rect.top / Math.max(1, scrollable));
}

function updateFrameHoldProgress(progress, holdEnd = 0.58) {
  return clamp(progress / holdEnd);
}

function updateIntroProgress() {
  const heroHeight = heroArrival.offsetHeight;
  const raw = window.scrollY / Math.max(1, heroHeight * 0.94);
  const progress = clamp(raw);
  const eased = smoothstep(progress);

  setDocVar("--intro-progress", progress.toFixed(4));
  setDocVar("--intro-scale", (1.08 - eased * 0.055).toFixed(4));
  setDocVar("--intro-copy-y", `${(-94 * eased).toFixed(1)}px`);
  setDocVar("--intro-copy-opacity", clamp(1 - progress * 1.28).toFixed(4));
  setDocVar("--intro-backdrop-opacity", (1 - eased * 0.06).toFixed(4));
  setDocVar("--intro-light-opacity", (0.92 - eased * 0.26).toFixed(4));
  setDocVar("--nav-y", `${(-12 * eased).toFixed(1)}px`);
  setDocVar("--nav-link-y", `${(eased * -4).toFixed(1)}px`);
  setDocVar("--nav-scale", (1 - eased * 0.038).toFixed(4));
  setDocVar("--nav-sheen-x", `${(-110 + eased * 180).toFixed(1)}%`);
}

function updateCanvasReveal(sequence, progress) {
  const reveal = smoothstep((progress - sequence.revealStart) / sequence.revealLength);
  setSequenceVar(sequence, "--canvas-reveal", reveal.toFixed(4));
  return reveal;
}

function updateSequenceMessage(sequence, progress) {
  const fadeIn = smoothstep((progress - sequence.messageInStart) / sequence.messageInLength);
  const fadeOut = 1 - smoothstep((progress - sequence.messageOutStart) / sequence.messageOutLength);
  const opacity = clamp(fadeIn * fadeOut);
  const travel = smoothstep(clamp(progress / 0.62));

  setSequenceVar(sequence, "--sequence-message-opacity", opacity.toFixed(4));
  setSequenceVar(sequence, "--sequence-message-x", `${(42 - travel * 52).toFixed(1)}px`);
  setSequenceVar(sequence, "--sequence-message-y", `${(28 - travel * 36).toFixed(1)}px`);
}

function updateSequenceProgress(sequence) {
  const progress = getSequenceProgress(sequence);
  const frameProgress = updateFrameHoldProgress(progress, sequence.frameHoldEnd);
  const frameEase = smoothstep(frameProgress);
  const reveal = updateCanvasReveal(sequence, progress);
  const transitionOpacity = 1 - smoothstep((progress - 0.04) / 0.3);

  sequence.lastProgress = progress;
  setSequenceVar(sequence, "--sequence-progress", progress.toFixed(4));
  setSequenceVar(sequence, "--sequence-frame-progress", frameProgress.toFixed(4));
  setSequenceVar(sequence, "--sequence-frame-scale", (1.052 - frameEase * 0.042).toFixed(4));
  setSequenceVar(sequence, "--sequence-frame-y", `${(-18 * frameEase).toFixed(1)}px`);
  setSequenceVar(sequence, "--sequence-transition-opacity", (transitionOpacity * (1 - reveal * 0.62)).toFixed(4));
  setSequenceVar(sequence, "--sequence-transition-y", `${(-34 * smoothstep(progress)).toFixed(1)}px`);
  updateSequenceMessage(sequence, progress);

  if (sequence.line) {
    sequence.line.style.height = `${Math.round(progress * 100)}%`;
  }

  const frameIndex = Math.min(
    sequence.frameCount - 1,
    Math.max(0, Math.round(frameProgress * (sequence.frameCount - 1))),
  );

  if (frameIndex !== sequence.currentFrame) {
    drawFrame(sequence, frameIndex);
  }
}

function updatePageProgress() {
  const max = doc.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollProgress.style.width = `${pct}%`;
  siteNav.classList.toggle("is-compact", window.scrollY > 120);
}

function updateFromScroll() {
  ticking = false;
  updatePageProgress();
  updateIntroProgress();
  sequences.forEach(updateSequenceProgress);
}

function requestScrollUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateFromScroll);
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", () => {
  resizeCanvases();
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

setDocVar("--intro-progress", "0");
sequences.forEach((sequence) => {
  setSequenceVar(sequence, "--sequence-progress", "0");
  setSequenceVar(sequence, "--sequence-frame-progress", "0");
  setSequenceVar(sequence, "--canvas-reveal", "0");
  setSequenceVar(sequence, "--sequence-transition-opacity", "1");
});
preloadFrames();
