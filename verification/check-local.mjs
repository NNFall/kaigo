import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const baseUrl = process.env.KAIGO_URL || "http://127.0.0.1:4174";
const prefix = process.env.KAIGO_PREFIX || "local";
const postLoadWait = Number.parseInt(process.env.KAIGO_POST_LOAD_WAIT || "2600", 10);
const outDir = resolve("verification/screenshots");
mkdirSync(outDir, { recursive: true });

const sceneConfigs = [
  { id: "scene-01", rootSelector: ".scroll-sequence--intro", canvasSelector: "#frameCanvas" },
  { id: "scene-02", rootSelector: ".scroll-sequence--next", canvasSelector: "#frameCanvasNext" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(70000);
page.setDefaultNavigationTimeout(70000);
const consoleMessages = [];
const requestFailures = [];
page.on("console", (msg) => {
  if (["error", "warning"].includes(msg.type())) {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  }
});
page.on("requestfailed", (request) => {
  requestFailures.push({
    url: request.url(),
    failure: request.failure()?.errorText || "unknown",
  });
});

await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => document.querySelector("#loader")?.classList.contains("is-hidden"), null, {
  timeout: 60000,
});
await page.waitForTimeout(postLoadWait);

async function scrollToSequence(scene, progress) {
  await page.evaluate(
    ({ selector, value }) => {
      const sequence = document.querySelector(selector);
      const top = sequence.offsetTop + value * (sequence.offsetHeight - window.innerHeight);
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({ top, left: 0, behavior: "instant" });
    },
    { selector: scene.rootSelector, value: progress },
  );
  await page.waitForTimeout(520);
}

async function scrollToPreSequence() {
  await page.evaluate(() => {
    const sequence = document.querySelector(".scroll-sequence--intro");
    const top = sequence.offsetTop - window.innerHeight * 0.22;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "instant" });
  });
  await page.waitForTimeout(520);
}

async function firstScreenMediaState() {
  return page.evaluate(() => {
    const backdropImage = getComputedStyle(document.querySelector(".arrival-backdrop")).backgroundImage;
    const canvases = [...document.querySelectorAll(".sequence-canvas")];
    const canvasStates = canvases.map((canvas) => {
      const rect = canvas.getBoundingClientRect();
      const style = getComputedStyle(canvas);
      const visibleArea =
        Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0)) *
        Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      return {
        id: canvas.id,
        opacity: Number.parseFloat(style.opacity || "1"),
        visibleArea,
      };
    });
    return { backdropImage, canvasStates };
  });
}

async function sceneState(scene) {
  return page.evaluate(
    ({ rootSelector, canvasSelector }) => {
      const root = document.querySelector(rootSelector);
      const canvas = document.querySelector(canvasSelector);
      const message = root.querySelector(".sequence-message");
      const transition = root.querySelector(".sequence-transition-layer");
      const rect = canvas.getBoundingClientRect();
      const canvasStyle = getComputedStyle(canvas);
      const rootStyle = getComputedStyle(root);
      const visibleArea =
        Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0)) *
        Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      return {
        opacity: Number.parseFloat(canvasStyle.opacity || "1"),
        visibility: canvasStyle.visibility,
        rect: rect.toJSON(),
        visibleArea,
        frameProgress: Number.parseFloat(rootStyle.getPropertyValue("--sequence-frame-progress") || "0"),
        sequenceProgress: Number.parseFloat(rootStyle.getPropertyValue("--sequence-progress") || "0"),
        messageOpacity: Number.parseFloat(getComputedStyle(message).opacity || "0"),
        transitionOpacity: Number.parseFloat(getComputedStyle(transition).opacity || "0"),
      };
    },
    scene,
  );
}

async function canvasSignal(scene) {
  return page.evaluate((canvasSelector) => {
    const canvas = document.querySelector(canvasSelector);
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const samples = [];
    for (let y = 0.2; y <= 0.8; y += 0.2) {
      for (let x = 0.2; x <= 0.8; x += 0.2) {
        const px = Math.floor(width * x);
        const py = Math.floor(height * y);
        const data = ctx.getImageData(px, py, 1, 1).data;
        samples.push([data[0], data[1], data[2], data[3]]);
      }
    }
    const alphaPixels = samples.filter((rgba) => rgba[3] > 0).length;
    const uniqueColors = new Set(samples.map((rgba) => rgba.join(","))).size;
    return { alphaPixels, uniqueColors, width, height };
  }, scene.canvasSelector);
}

await page.screenshot({ path: resolve(outDir, `${prefix}-hero-top.png`), fullPage: false });
const topMedia = await firstScreenMediaState();

await scrollToPreSequence();
await page.screenshot({ path: resolve(outDir, `${prefix}-pre-sequence.png`), fullPage: false });
const preSequenceState = await sceneState(sceneConfigs[0]);

const sceneReports = [];
for (const scene of sceneConfigs) {
  const checks = [];
  for (const [name, progress] of [
    ["sequence-00", 0],
    ["sequence-08", 0.08],
    ["sequence-25", 0.25],
    ["sequence-60", 0.6],
    ["sequence-85", 0.85],
  ]) {
    await scrollToSequence(scene, progress);
    await page.screenshot({ path: resolve(outDir, `${prefix}-${scene.id}-${name}.png`), fullPage: false });
    checks.push({ name, progress, screen: await sceneState(scene), signal: await canvasSignal(scene) });
  }
  sceneReports.push({ ...scene, checks });
}

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
const mobileTopMedia = await mobile.evaluate(() => {
  const backdropImage = getComputedStyle(document.querySelector(".arrival-backdrop")).backgroundImage;
  return { backdropImage };
});

await browser.close();

assert.doesNotMatch(topMedia.backdropImage, /frames\/frame_\d{4}\.webp/, "desktop first screen should not use video frame as background");
assert.doesNotMatch(mobileTopMedia.backdropImage, /frames\/frame_\d{4}\.webp/, "mobile first screen should not use video frame as background");
assert.ok(preSequenceState.opacity <= 0.08, `pre-sequence canvas should be hidden, got ${preSequenceState.opacity}`);

for (const scene of sceneReports) {
  const sequence00 = scene.checks.find((check) => check.name === "sequence-00");
  const sequence08 = scene.checks.find((check) => check.name === "sequence-08");
  const sequence25 = scene.checks.find((check) => check.name === "sequence-25");
  const sequence60 = scene.checks.find((check) => check.name === "sequence-60");
  const sequence85 = scene.checks.find((check) => check.name === "sequence-85");

  assert.ok(sequence00.screen.opacity <= 0.16, `${scene.id}: sequence-00 canvas should still be barely visible, got ${sequence00.screen.opacity}`);
  assert.ok(
    sequence08.screen.opacity > sequence00.screen.opacity && sequence08.screen.opacity < 0.75,
    `${scene.id}: sequence-08 should be a partial fade, got ${sequence08.screen.opacity} after ${sequence00.screen.opacity}`,
  );
  assert.ok(sequence25.screen.opacity >= 0.85, `${scene.id}: sequence-25 canvas should be visible, got ${sequence25.screen.opacity}`);
  assert.ok(
    sequence00.screen.transitionOpacity > sequence25.screen.transitionOpacity,
    `${scene.id}: transition overlay should fade as video becomes visible`,
  );
  assert.ok(sequence60.screen.frameProgress >= 0.98, `${scene.id}: video frames should finish early and hold, got ${sequence60.screen.frameProgress}`);
  assert.ok(sequence85.screen.frameProgress >= 0.98, `${scene.id}: late scene should still hold final frame, got ${sequence85.screen.frameProgress}`);
  assert.ok(sequence85.screen.messageOpacity >= 0.62, `${scene.id}: text should remain readable late in the scene, got ${sequence85.screen.messageOpacity}`);

  for (const check of scene.checks.filter((item) => item.progress >= 0.25)) {
    assert.ok(check.signal.width >= 1000, `${scene.id} ${check.name}: canvas width should match desktop viewport`);
    assert.ok(check.signal.height >= 700, `${scene.id} ${check.name}: canvas height should match desktop viewport`);
    assert.ok(check.signal.alphaPixels >= 6, `${scene.id} ${check.name}: canvas should contain visible pixels`);
    assert.ok(check.signal.uniqueColors >= 3, `${scene.id} ${check.name}: canvas should not be a flat blank fill`);
  }
}

const report = {
  baseUrl,
  screenshots: [
    `${prefix}-hero-top.png`,
    `${prefix}-pre-sequence.png`,
    ...sceneReports.flatMap((scene) =>
      scene.checks.map((check) => `${prefix}-${scene.id}-${check.name}.png`),
    ),
    `${prefix}-mobile-top.png`,
  ],
  topMedia,
  mobileTopMedia,
  preSequenceState,
  scenes: sceneReports,
  consoleMessages,
  requestFailures,
};

writeFileSync(resolve(outDir, `${prefix}-check-report.json`), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
