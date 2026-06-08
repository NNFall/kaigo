import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const testDir = dirname(fileURLToPath(import.meta.url));
const siteDir = join(testDir, "site");
const indexPath = join(siteDir, "index.html");
const stylesPath = join(siteDir, "styles.css");
const appPath = join(siteDir, "app.js");
const faviconPath = join(siteDir, "favicon.svg");
const framesDir = join(siteDir, "frames");
const framesNextDir = join(siteDir, "frames-next");

assert.equal(existsSync(indexPath), true, "site/index.html should exist");
assert.equal(existsSync(stylesPath), true, "site/styles.css should exist");
assert.equal(existsSync(appPath), true, "site/app.js should exist");
assert.equal(existsSync(faviconPath), true, "site/favicon.svg should exist");
assert.equal(existsSync(framesDir), true, "site/frames should exist");
assert.equal(existsSync(framesNextDir), false, "site/frames-next should be removed for the one-video concept");

const frames = readdirSync(framesDir).filter((name) => /^frame_\d{4}\.webp$/.test(name));
assert.equal(frames.length, 363, `one-video scroll sequence should ship exactly 363 frames, got ${frames.length}`);
assert.equal(frames[0], "frame_0001.webp", "first frame should be named predictably");
assert.equal(frames.at(-1), `frame_${String(frames.length).padStart(4, "0")}.webp`, "last frame should match frame count");

const frameSizes = frames.map((name) => statSync(join(framesDir, name)).size);
const totalFrameBytes = frameSizes.reduce((sum, size) => sum + size, 0);
const maxFrameBytes = Math.max(...frameSizes);
assert.ok(totalFrameBytes <= 20 * 1024 * 1024, `frame set should stay under 20 MB, got ${totalFrameBytes} bytes`);
assert.ok(maxFrameBytes <= 100 * 1024, `largest frame should stay under 100 KB, got ${maxFrameBytes} bytes`);

const html = readFileSync(indexPath, "utf8");
const js = readFileSync(appPath, "utf8");
const css = readFileSync(stylesPath, "utf8");
const favicon = readFileSync(faviconPath, "utf8");

const configuredFrameCount = Number(js.match(/frameCount:\s*(\d+)/)?.[1]);
assert.equal(configuredFrameCount, frames.length, "JS frameCount should match generated frame assets");

assert.match(html, /rel="icon"\s+href="\/favicon\.svg"\s+type="image\/svg\+xml"/, "HTML should link the SVG favicon");
assert.match(favicon, /<svg\b/, "favicon should be an SVG asset");
assert.match(favicon, /#b33430/, "favicon should use the KAIGO red accent");
assert.ok(statSync(faviconPath).size <= 4096, "favicon should stay lightweight");

assert.match(html, /class="[^"]*\bsequence-canvas\b/, "HTML should include the scroll frame canvas");
assert.match(html, /id="frameCanvas"/, "HTML should use one canvas for the single video sequence");
assert.doesNotMatch(html, /frameCanvasNext/, "HTML should not include a second canvas");
assert.match(html, /KAIGO/, "HTML should include KAIGO brand text");
assert.match(html, /class="[^"]*\barrival-intro\b/, "HTML should include a separate landing intro before the video");
assert.match(html, /data-label="Старт"/, "navigation should expose the intro section");

const sequenceMatches = html.match(/class="[^"]*\bscroll-sequence\b/g) || [];
assert.equal(sequenceMatches.length, 1, "prototype should have one scroll-video section");
const canvasMatches = html.match(/id="frameCanvas"/g) || [];
assert.equal(canvasMatches.length, 1, "prototype should keep exactly one frame canvas");
const sequenceCanvasMatches = html.match(/class="[^"]*\bsequence-canvas\b/g) || [];
assert.equal(sequenceCanvasMatches.length, 1, "prototype should keep exactly one sequence canvas");

const mainOpen = html.indexOf("<main>");
const introIndex = html.indexOf('class="arrival-intro"');
const sequenceIndex = html.indexOf('class="scroll-sequence"');
const canvasIndex = html.indexOf('id="frameCanvas"');
assert.ok(mainOpen >= 0, "HTML should include main content");
assert.ok(introIndex > mainOpen, "arrival intro should be inside main");
assert.ok(sequenceIndex > introIndex, "arrival intro should appear before the video sequence");
assert.ok(canvasIndex > sequenceIndex, "frame canvas should live inside the video sequence, not the intro");

const narrativeMatches = html.match(/class="[^"]*\bnarrative\b/g) || [];
assert.equal(narrativeMatches.length, 3, "single video should expose three narrative moments");

assert.match(js, /const SEQUENCE_CONFIG\b/, "JS should define one scroll scene config");
assert.doesNotMatch(js, /SEQUENCE_CONFIGS/, "JS should not keep the old multiple scene config");
assert.doesNotMatch(js, /frames-next/, "JS should not reference the old second frame directory");
assert.doesNotMatch(css, /frames-next/, "CSS should not reference the old second frame directory");
assert.match(js, /requestAnimationFrame/, "JS should render via requestAnimationFrame");
assert.match(js, /INITIAL_PRELOAD/, "JS should preload only the first usable frame window");
assert.match(js, /PRELOAD_RADIUS/, "JS should maintain a rolling preload window around the active frame");
assert.match(js, /MAX_CONCURRENT_REQUESTS/, "JS should limit parallel frame requests");
assert.match(js, /requestIdleCallback|setTimeout/, "JS should warm remaining frames outside the critical load");
assert.match(js, /data-frame-index/, "JS should expose frame index for verification");
assert.match(js, /data-intro-progress/, "JS should expose intro progress for verification");

assert.match(css, /\.scroll-sequence/, "CSS should include the sticky scroll sequence section");
assert.match(css, /\.arrival-intro/, "CSS should include the landing intro section");
assert.match(css, /--intro-progress/, "CSS should drive intro exit with a scroll progress variable");
assert.match(css, /\.site-nav--rail/, "header should be converted to a compact rail instead of a wide top overlay");
assert.match(css, /\.site-nav--rail\.is-intro/, "header should have a distinct intro mode");
assert.doesNotMatch(css, /opacity:\s*var\(--canvas-reveal\)/, "canvas should not be opacity-gated before sequence starts");
assert.doesNotMatch(js, /updateCanvasReveal/, "JS should not compute the removed transparent video reveal");
assert.doesNotMatch(js, /frameHoldEnd/, "JS should map the full single video instead of ending frame motion early");
assert.match(css, /100dvh/, "full viewport sections should use 100dvh");
assert.match(css, /transform/, "motion should stay on transform/opacity");
assert.match(css, /--accent/, "CSS should define a brand accent token");

console.log("Smoke checks passed");
