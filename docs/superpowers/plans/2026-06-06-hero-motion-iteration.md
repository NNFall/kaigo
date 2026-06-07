# KAIGO Hero Motion Iteration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the first KAIGO screen so it starts as a cinematic minimal arrival state, then transforms into the existing scroll-controlled canvas sequence without a hard visual jump.

**Architecture:** Keep the current static/Vite-compatible prototype. The HTML defines the arrival scene, the shared sequence canvas, and one focused narrative overlay. CSS handles load-in choreography and scroll-linked transforms through CSS variables. JavaScript keeps the frame preloader/canvas renderer and adds requestAnimationFrame-driven intro/sequence progress variables.

**Tech Stack:** Static HTML/CSS/JS, canvas frame sequence, Playwright verification, Node smoke tests, Python HTTP server for local preview.

---

### Task 1: Lock The Desired Structure With Tests

**Files:**
- Modify: `D:\papka for all\work\kaigo\prototype\smoke.test.mjs`

- [x] **Step 1: Add assertions for the new hero structure**

Add checks that require:

```js
const narrativeMatches = indexHtml.match(/class="narrative\b/g) || [];
assert.equal(narrativeMatches.length, 1, "first scroll-video should have exactly one narrative overlay");
assert.match(indexHtml, /class="arrival-shell"/, "arrival shell should exist");
assert.match(indexHtml, /class="arrival-phrase"/, "minimal arrival phrase should exist");
assert.match(indexHtml, /class="sequence-message narrative/, "single sequence message should exist");
assert.match(appJs, /updateIntroProgress/, "intro scroll progress should be driven in JS");
assert.match(appJs, /--intro-progress/, "JS should publish intro progress as a CSS variable");
assert.match(stylesCss, /\.arrival-shell/, "arrival shell styles should exist");
assert.match(stylesCss, /\.kinetic-nav/, "kinetic nav styles should exist");
```

- [x] **Step 2: Run the test and verify it fails**

Run:

```powershell
node prototype/smoke.test.mjs
```

Expected: failure caused by the old multi-card hero/sequence structure.

### Task 2: Rework Markup

**Files:**
- Modify: `D:\papka for all\work\kaigo\prototype\site\index.html`

- [x] **Step 1: Replace the current full-information hero**

Create an arrival hero with:

```html
<section class="hero-arrival" id="top" aria-label="KAIGO intro">
  <div class="arrival-backdrop" aria-hidden="true"></div>
  <div class="arrival-shell">...</div>
</section>
```

The first viewport should expose only `KAIGO`, 2-3 nav items, one short phrase, a minimal scroll cue, and small technical marks.

- [x] **Step 2: Replace six sequence cards with one focused message**

Keep the canvas and progress affordance, but use one message:

```html
<div class="sequence-message narrative is-visible">
  <p class="eyebrow">01 / вход в систему</p>
  <h2>Я создаю сайты и AI-системы, которые запоминаются.</h2>
  <p>...</p>
</div>
```

### Task 3: Rework Motion CSS

**Files:**
- Modify: `D:\papka for all\work\kaigo\prototype\site\styles.css`

- [x] **Step 1: Add load-in and scroll transform styles**

Create CSS for:

- `body.is-ready`
- `.hero-arrival`
- `.arrival-backdrop`
- `.arrival-shell`
- `.arrival-phrase`
- `.kinetic-nav`
- `.orbital-control`
- `.sequence-message`

Use only `transform` and `opacity` for motion.

- [x] **Step 2: Remove card-like sequence behavior**

Replace the old six-card narrative look with a single lightweight overlay that feels connected to the scene.

### Task 4: Rework JS Progress Model

**Files:**
- Modify: `D:\papka for all\work\kaigo\prototype\site\app.js`

- [x] **Step 1: Keep canvas preloading/rendering**

Retain the existing 73-frame loader and canvas draw logic.

- [x] **Step 2: Add intro progress**

Implement:

```js
function updateIntroProgress() {
  const heroHeight = heroArrival.offsetHeight;
  const raw = window.scrollY / Math.max(1, heroHeight * 0.9);
  const progress = Math.min(1, Math.max(0, raw));
  document.documentElement.style.setProperty("--intro-progress", progress.toFixed(4));
}
```

- [x] **Step 3: Simplify narrative logic**

The first sequence video should no longer cycle six messages. Keep one message and update only frame/progress values.

### Task 5: Verify Locally

**Files:**
- Modify if needed: `D:\papka for all\work\kaigo\verification\check-local.mjs`

- [x] **Step 1: Run smoke test**

Run:

```powershell
node prototype/smoke.test.mjs
```

Expected: pass.

- [x] **Step 2: Start local static server**

Run:

```powershell
python -m http.server 4174 -d prototype/site
```

- [x] **Step 3: Run Playwright verification**

Run:

```powershell
node verification/check-local.mjs
```

Expected: screenshots generated, canvas nonblank at scroll positions.

### Task 6: Deploy And Verify Public Site

**Files:**
- Modify: `D:\papka for all\work\kaigo\deploy\kaigo-scroll-prototype.zip`
- Modify: `D:\papka for all\work\kaigo\docs\OPERATIONS.md`

- [x] **Step 1: Rebuild ZIP with POSIX paths**

Use Python `zipfile` and include:

- `index.html`
- `styles.css`
- `app.js`
- `frames/frame_0001.webp` through `frames/frame_0073.webp`

- [x] **Step 2: Upload and extract to `/root/kaigo/site-current`**

Keep `/old/` config untouched.

- [x] **Step 3: Verify public domain**

Run:

```powershell
$env:KAIGO_URL='https://kaigo.online'; $env:KAIGO_PREFIX='public-hero-motion'; node verification/check-local.mjs
```

Also check root, assets, first frame, and `/old/` return `200`.

## Self-Review

- Spec coverage: The plan covers minimal arrival, seamless intro-to-canvas transition, one message per video, local verification, deploy, and public verification.
- Placeholder scan: No TBD/TODO placeholders.
- Type consistency: CSS variable names and function names are consistent across tasks.
