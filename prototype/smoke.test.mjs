import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const testDir = dirname(fileURLToPath(import.meta.url));
const siteDir = join(testDir, "site");
const indexPath = join(siteDir, "index.html");
const stylesPath = join(siteDir, "styles.css");
const appPath = join(siteDir, "app.js");
const framesDir = join(siteDir, "frames");
const framesNextDir = join(siteDir, "frames-next");

assert.equal(existsSync(indexPath), true, "site/index.html should exist");
assert.equal(existsSync(stylesPath), true, "site/styles.css should exist");
assert.equal(existsSync(appPath), true, "site/app.js should exist");
assert.equal(existsSync(framesDir), true, "site/frames should exist");
assert.equal(existsSync(framesNextDir), true, "site/frames-next should exist");

const frames = readdirSync(framesDir).filter((name) => /^frame_\d{4}\.webp$/.test(name));
const framesNext = readdirSync(framesNextDir).filter((name) => /^frame_\d{4}\.webp$/.test(name));
assert.equal(frames.length, 73, "first scroll scene should ship 73 replacement WebP frames");
assert.equal(frames[0], "frame_0001.webp", "first frame should be named predictably");
assert.equal(frames.at(-1), "frame_0073.webp", "last frame should be named predictably");
assert.equal(framesNext.length, 73, "second scroll scene should ship 73 WebP frames");
assert.equal(framesNext[0], "frame_0001.webp", "second scene first frame should be named predictably");
assert.equal(framesNext.at(-1), "frame_0073.webp", "second scene last frame should be named predictably");

const html = readFileSync(indexPath, "utf8");
const js = readFileSync(appPath, "utf8");
const css = readFileSync(stylesPath, "utf8");

assert.match(html, /class="[^"]*\bsequence-canvas\b/, "HTML should include scroll frame canvases");
assert.match(html, /KAIGO/, "HTML should include KAIGO brand text");
assert.match(js, /SEQUENCE_CONFIGS/, "JS should define multiple scroll scene configs");
assert.match(js, /requestAnimationFrame/, "JS should render via requestAnimationFrame");
assert.match(js, /drawFrame/, "JS should expose frame drawing logic");
assert.match(css, /\.scroll-sequence/, "CSS should include the sticky scroll sequence section");
assert.match(css, /--accent/, "CSS should define a brand accent token");

const narrativeMatches = html.match(/class="[^"]*\bnarrative\b/g) || [];
assert.equal(narrativeMatches.length, 2, "prototype should now have two scroll-video narrative overlays");
const sequenceMatches = html.match(/class="[^"]*\bscroll-sequence\b/g) || [];
assert.equal(sequenceMatches.length, 2, "prototype should now have two scroll-video sections");
assert.match(html, /class="arrival-shell"/, "arrival shell should exist");
assert.match(html, /class="[^"]*\barrival-phrase\b/, "minimal arrival phrase should exist");
assert.match(html, /class="[^"]*\bsequence-message\b[^"]*\bnarrative\b/, "single sequence message should exist");
assert.match(html, /class="[^"]*\bkinetic-nav\b/, "kinetic nav should exist");
assert.match(js, /updateIntroProgress/, "intro scroll progress should be driven in JS");
assert.match(js, /--intro-progress/, "JS should publish intro progress as a CSS variable");
assert.match(css, /\.arrival-shell/, "arrival shell styles should exist");
assert.match(css, /\.kinetic-nav/, "kinetic nav styles should exist");
assert.match(html, /class="abstract-field"/, "first screen should use an abstract field layer");
assert.match(html, /class="[^"]*\barrival-signal\b/, "first screen should include animated signal layers");
assert.match(css, /\.abstract-field/, "abstract first-screen background styles should exist");
assert.doesNotMatch(css, /url\(["']?\/frames\/frame_0001\.webp["']?\)/, "arrival screen should not show the raw first video frame as a background");
assert.match(css, /--canvas-reveal/, "CSS should define canvas reveal opacity");
assert.match(css, /\.sequence-canvas[\s\S]*opacity:\s*var\(--canvas-reveal\)/, "canvas should be opacity-gated before sequence starts");
assert.match(js, /updateCanvasReveal/, "JS should compute canvas reveal timing");
assert.match(js, /--canvas-reveal/, "JS should publish canvas reveal opacity");
assert.match(js, /updateFrameHoldProgress/, "JS should finish video motion early and hold final readable text");
assert.match(js, /--sequence-frame-progress/, "JS should expose frame hold progress for verification");
assert.match(css, /navItemReveal/, "header links should have visible entrance motion");
assert.match(css, /brandBreath/, "brand mark should have a living header animation");
assert.match(css, /navPanelReveal/, "header panel should slowly expand from the center");
assert.match(html, /class="[^"]*\barrival-notes\b/, "first screen should include extra staged text notes");
assert.match(html, /class="[^"]*\barrival-particle\b/, "first screen should include small moving particles");
assert.match(html, /class="[^"]*\bsequence-transition-layer\b/, "scroll sequences should include a transition overlay layer");
assert.match(css, /transitionDrift/, "transition overlay should animate between intro and video");
assert.match(css, /phraseReveal\s+1\./, "arrival phrase reveal should be slower than the previous sub-second animation");

console.log("Smoke checks passed");
