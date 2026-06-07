import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const baseUrl = process.env.KAIGO_URL || "http://127.0.0.1:4174";
const prefix = process.env.KAIGO_PREFIX || "local";
const postLoadWait = Number.parseInt(process.env.KAIGO_POST_LOAD_WAIT || "700", 10);
const outDir = resolve("verification/screenshots");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(70000);
page.setDefaultNavigationTimeout(70000);

await page.addInitScript(() => {
  window.__kaigoLongTasks = [];
  if ("PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__kaigoLongTasks.push({
            duration: entry.duration,
            startTime: entry.startTime,
          });
        }
      });
      observer.observe({ type: "longtask", buffered: true });
    } catch {
      window.__kaigoLongTasksUnsupported = true;
    }
  }
});

const consoleMessages = [];
const requestFailures = [];
const frameRequests = [];
const frameResponses = [];
page.on("console", (msg) => {
  if (["error", "warning"].includes(msg.type())) {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  }
});
page.on("request", (request) => {
  if (/\/frames\/frame_\d{4}\.webp$/.test(request.url()) || /\/frames-next\//.test(request.url())) {
    frameRequests.push({ url: request.url(), at: Date.now() });
  }
});
page.on("response", (response) => {
  const url = response.url();
  if (/\/frames\/frame_\d{4}\.webp$/.test(url) || /\/frames-next\//.test(url)) {
    frameResponses.push({ url, status: response.status() });
  }
});
page.on("requestfailed", (request) => {
  requestFailures.push({
    url: request.url(),
    failure: request.failure()?.errorText || "unknown",
  });
});

const navigationStartedAt = Date.now();
await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => document.querySelector("#loader")?.classList.contains("is-hidden"), null, {
  timeout: 70000,
});
const loaderHiddenAt = Date.now();
await page.waitForTimeout(postLoadWait);

async function scrollToSequence(progress) {
  await page.evaluate((value) => {
    const sequence = document.querySelector(".scroll-sequence");
    const top = sequence.offsetTop + value * (sequence.offsetHeight - window.innerHeight);
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top, left: 0, behavior: "instant" });
  }, progress);
  await page.waitForTimeout(180);
}

async function scrollToIntro(progress) {
  await page.evaluate((value) => {
    const intro = document.querySelector(".arrival-intro");
    const top = intro.offsetTop + value * (intro.offsetHeight - window.innerHeight);
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top, left: 0, behavior: "instant" });
  }, progress);
  await page.waitForTimeout(180);
}

async function waitForFrameNear(targetFrame) {
  await page
    .waitForFunction(
      (target) => {
        const frame = Number(document.documentElement.getAttribute("data-frame-index") || "0");
        return Math.abs(frame - target) <= 8;
      },
      targetFrame,
      { timeout: 6000 },
    )
    .catch(() => {});
}

async function canvasSignal() {
  return page.evaluate(() => {
    const canvas = document.querySelector("#frameCanvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const samples = [];
    for (let y = 0.22; y <= 0.78; y += 0.18) {
      for (let x = 0.22; x <= 0.78; x += 0.18) {
        const px = Math.floor(canvas.width * x);
        const py = Math.floor(canvas.height * y);
        const data = ctx.getImageData(px, py, 1, 1).data;
        samples.push([data[0], data[1], data[2], data[3]]);
      }
    }
    return {
      width: canvas.width,
      height: canvas.height,
      alphaPixels: samples.filter((rgba) => rgba[3] > 0).length,
      uniqueColors: new Set(samples.map((rgba) => rgba.join(","))).size,
    };
  });
}

async function pageState() {
  return page.evaluate(() => {
    const root = document.documentElement;
    const canvas = document.querySelector("#frameCanvas");
    const nav = document.querySelector("#siteNav");
    const intro = document.querySelector(".arrival-intro");
    const sequence = document.querySelector(".scroll-sequence");
    const firstSection = document.querySelector("main > section");
    const panels = [...document.querySelectorAll(".sequence-panel")].map((panel) => ({
      className: panel.className,
      opacity: Number.parseFloat(getComputedStyle(panel).opacity || "0"),
      text: panel.innerText.trim().slice(0, 80),
    }));
    const navRect = nav.getBoundingClientRect();
    return {
      scrollY: window.scrollY,
      viewportHeight: window.innerHeight,
      frameIndex: Number(root.getAttribute("data-frame-index") || "0"),
      requestedFrameIndex: Number(root.getAttribute("data-requested-frame-index") || "0"),
      introProgress: Number.parseFloat(root.getAttribute("data-intro-progress") || "0"),
      sequenceProgress: Number.parseFloat(getComputedStyle(root).getPropertyValue("--sequence-progress") || "0"),
      canvasOpacity: Number.parseFloat(getComputedStyle(canvas).opacity || "1"),
      canvasRect: canvas.getBoundingClientRect().toJSON(),
      introRect: intro.getBoundingClientRect().toJSON(),
      sequenceRect: sequence.getBoundingClientRect().toJSON(),
      firstSectionClass: firstSection.className,
      navRect: navRect.toJSON(),
      navClassName: nav.className,
      panels,
      perf: window.__kaigoPerf,
      longTasks: window.__kaigoLongTasks || [],
      longTasksUnsupported: Boolean(window.__kaigoLongTasksUnsupported),
    };
  });
}

await page.screenshot({ path: resolve(outDir, `${prefix}-hero-top.png`), fullPage: false });
const topState = await pageState();
const frameCount = topState.perf?.frameCount || 363;
const maxFrameIndex = frameCount - 1;

await scrollToIntro(0.72);
await page.screenshot({ path: resolve(outDir, `${prefix}-intro-handoff.png`), fullPage: false });
const introHandoffState = await pageState();

const checkpoints = [];
for (const [name, progress] of [
  ["sequence-00", 0],
  ["sequence-25", 0.25],
  ["sequence-50", 0.5],
  ["sequence-75", 0.75],
  ["sequence-100", 1],
]) {
  await scrollToSequence(progress);
  const targetFrame = Math.round(progress * maxFrameIndex);
  await waitForFrameNear(targetFrame);
  await page.screenshot({ path: resolve(outDir, `${prefix}-${name}.png`), fullPage: false });
  checkpoints.push({
    name,
    progress,
    targetFrame,
    state: await pageState(),
    signal: await canvasSignal(),
  });
}

await scrollToSequence(0.28);
await waitForFrameNear(Math.round(0.28 * maxFrameIndex));
const beforeWheel = await pageState();
await page.mouse.wheel(0, 720);
await page.waitForTimeout(220);
const afterWheel = await pageState();
await page.screenshot({ path: resolve(outDir, `${prefix}-after-wheel.png`), fullPage: false });

await page.close();

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
});
mobile.setDefaultTimeout(70000);
mobile.setDefaultNavigationTimeout(70000);
await mobile.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 70000 });
await mobile.waitForFunction(() => document.querySelector("#loader")?.classList.contains("is-hidden"), null, {
  timeout: 70000,
});
await mobile.waitForTimeout(postLoadWait);
await mobile.screenshot({ path: resolve(outDir, `${prefix}-mobile-top.png`), fullPage: false });
const mobileState = await mobile.evaluate(() => {
  const canvas = document.querySelector("#frameCanvas");
  const nav = document.querySelector("#siteNav");
  const sequence = document.querySelector(".scroll-sequence");
  const firstSection = document.querySelector("main > section");
  const navRect = nav.getBoundingClientRect();
  return {
    viewportHeight: window.innerHeight,
    firstSectionClass: firstSection.className,
    sequenceRect: sequence.getBoundingClientRect().toJSON(),
    canvasRect: canvas.getBoundingClientRect().toJSON(),
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    navRect: navRect.toJSON(),
    navClassName: nav.className,
    frameIndex: Number(document.documentElement.getAttribute("data-frame-index") || "0"),
  };
});

await browser.close();

const loaderElapsed = loaderHiddenAt - navigationStartedAt;
const initialFrameRequests = frameRequests.filter((request) => request.at <= loaderHiddenAt + 120).length;
const failedFrameResponses = frameResponses.filter((response) => response.status >= 400);
const consoleErrors = consoleMessages.filter((message) => message.startsWith("error:"));
const frameConsoleWarnings = consoleMessages.filter((message) => message.includes("Frame failed to load"));

assert.ok(loaderElapsed < 5000, `loader should unblock after the first frame window, got ${loaderElapsed}ms`);
assert.ok(initialFrameRequests <= 70, `initial load should not request every frame, got ${initialFrameRequests}`);
assert.ok(frameRequests.every((request) => !request.url.includes("/frames-next/")), "page should not request frames-next assets");
assert.equal(requestFailures.length, 0, `request failures should be empty: ${JSON.stringify(requestFailures)}`);
assert.equal(failedFrameResponses.length, 0, `frame responses should be <400: ${JSON.stringify(failedFrameResponses)}`);
assert.equal(consoleErrors.length, 0, `console errors should be empty: ${JSON.stringify(consoleErrors)}`);
assert.equal(frameConsoleWarnings.length, 0, `frame load warnings should be empty: ${JSON.stringify(frameConsoleWarnings)}`);
assert.match(topState.firstSectionClass, /arrival-intro/, "top viewport should start on the landing intro");
assert.ok(topState.introRect.top <= 1, `intro should start at the top, got ${topState.introRect.top}`);
assert.ok(
  topState.sequenceRect.top >= topState.viewportHeight * 0.8,
  `video sequence should start below the first viewport, got top ${topState.sequenceRect.top}`,
);
assert.ok(
  topState.canvasRect.top >= topState.viewportHeight * 0.8,
  `frame canvas should not be visible on the initial landing screen, got top ${topState.canvasRect.top}`,
);
assert.equal(topState.frameIndex, 0, "landing should not visually advance beyond the first frame index");
assert.equal(topState.requestedFrameIndex, 0, "landing should not request a non-zero active frame");
assert.ok(topState.panels.every((panel) => panel.opacity < 0.12), "video narrative panels should be hidden on the landing screen");
assert.match(topState.navClassName, /is-intro/, "nav should use intro mode on the landing screen");
assert.ok(introHandoffState.introProgress > 0.65, "intro handoff screenshot should capture a late intro state");
assert.match(introHandoffState.navClassName, /is-intro/, "nav should still be in intro mode during the handoff");

for (const checkpoint of checkpoints) {
  assert.ok(checkpoint.signal.width >= 1000, `${checkpoint.name}: canvas width should match desktop viewport`);
  assert.ok(checkpoint.signal.height >= 700, `${checkpoint.name}: canvas height should match desktop viewport`);
  assert.ok(checkpoint.signal.alphaPixels >= 8, `${checkpoint.name}: canvas should contain visible pixels`);
  assert.ok(checkpoint.signal.uniqueColors >= 4, `${checkpoint.name}: canvas should not be blank`);
  assert.ok(
    Math.abs(checkpoint.state.requestedFrameIndex - checkpoint.targetFrame) <= 3,
    `${checkpoint.name}: requested frame should track scroll progress`,
  );
  assert.ok(
    Math.abs(checkpoint.state.frameIndex - checkpoint.targetFrame) <= 10,
    `${checkpoint.name}: drawn frame should catch up near requested frame`,
  );
}

assert.ok(
  checkpoints[0].state.canvasRect.top <= 1,
  `sequence canvas should reach the viewport at sequence start, got top ${checkpoints[0].state.canvasRect.top}`,
);
assert.ok(
  checkpoints[0].state.navRect.width <= 100,
  `desktop header should become a compact rail in the video sequence, got width ${checkpoints[0].state.navRect.width}`,
);
assert.ok(
  checkpoints[0].state.navRect.left <= 32,
  `desktop header rail should stay at the left edge in sequence, got left ${checkpoints[0].state.navRect.left}`,
);

const activePanelCounts = checkpoints.map((checkpoint) =>
  checkpoint.state.panels.filter((panel) => panel.opacity > 0.24).length,
);
assert.ok(activePanelCounts.some((count) => count === 1), "at least one checkpoint should have a single readable text panel");
assert.ok(checkpoints[1].state.panels[0].opacity > 0.2, "first narrative should still be readable around 25%");
assert.ok(checkpoints[2].state.panels[1].opacity > 0.2, "second narrative should be readable around 50%");
assert.ok(checkpoints[4].state.panels[2].opacity > 0.2, "third narrative should remain readable at the end");

assert.ok(afterWheel.scrollY > beforeWheel.scrollY, "wheel should move the page inside the sequence");
assert.ok(
  afterWheel.requestedFrameIndex > beforeWheel.requestedFrameIndex,
  "wheel should advance the requested frame index",
);

const drawTimes = afterWheel.perf?.draws || [];
if (drawTimes.length > 0) {
  const sorted = [...drawTimes].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  assert.ok(p95 < 30, `canvas draw p95 should stay under 30ms, got ${p95}`);
}

const updateTimes = afterWheel.perf?.updates || [];
if (updateTimes.length > 0) {
  const sorted = [...updateTimes].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  assert.ok(p95 < 38, `scroll update p95 should stay under 38ms, got ${p95}`);
}

if (!afterWheel.longTasksUnsupported && afterWheel.longTasks.length > 0) {
  const maxLongTask = Math.max(...afterWheel.longTasks.map((task) => task.duration));
  assert.ok(maxLongTask < 450, `long task max should stay below 450ms including screenshot/readback overhead, got ${maxLongTask}`);
}

assert.match(mobileState.firstSectionClass, /arrival-intro/, "mobile top should start on the landing intro");
assert.ok(
  mobileState.canvasRect.top >= mobileState.viewportHeight * 0.8,
  `mobile frame canvas should not be visible on initial landing, got top ${mobileState.canvasRect.top}`,
);
assert.ok(mobileState.canvasWidth >= 390, "mobile canvas should be initialized in the background");
assert.ok(mobileState.canvasHeight >= 700, "mobile canvas should be tall enough once sequence starts");
assert.ok(mobileState.navRect.height <= 70, `mobile header should stay compact, got height ${mobileState.navRect.height}`);

const report = {
  baseUrl,
  loaderElapsed,
  initialFrameRequests,
  totalFrameRequests: frameRequests.length,
  frameResponses: frameResponses.length,
  screenshots: [
    `${prefix}-hero-top.png`,
    `${prefix}-intro-handoff.png`,
    ...checkpoints.map((checkpoint) => `${prefix}-${checkpoint.name}.png`),
    `${prefix}-after-wheel.png`,
    `${prefix}-mobile-top.png`,
  ],
  topState,
  introHandoffState,
  checkpoints,
  beforeWheel,
  afterWheel,
  mobileState,
  consoleMessages,
  requestFailures,
};

writeFileSync(resolve(outDir, `${prefix}-check-report.json`), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
