# Landing Intro Scroll Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a separate dynamic first screen before the single-video KAIGO scroll sequence.

**Architecture:** Keep the project as a static HTML/CSS/JS prototype. Add an intro section driven by CSS variables from scroll progress, while the existing canvas sequence remains the only video-frame system.

**Tech Stack:** Static HTML, CSS custom properties/animations, vanilla JS, Playwright verification, nginx static deploy.

---

## File Structure

- Modify `prototype/site/index.html`: insert `.arrival-intro` before `.scroll-sequence`.
- Modify `prototype/site/styles.css`: add intro visuals, staged load animations, scroll exit states, nav intro behavior, and stronger sequence panel transforms.
- Modify `prototype/site/app.js`: compute `--intro-progress`, keep one frame config, preload frames while intro is visible, and expose intro state for tests.
- Modify `prototype/smoke.test.mjs`: add structural assertions for the new intro and one-video guarantee.
- Modify `verification/check-local.mjs`: add browser assertions for top intro, sequence canvas, and transition behavior.
- Modify `docs/PLAN.md` and `docs/OPERATIONS.md`: record decisions, operations, screenshots, deployment.

### Task 1: Intro Structure

- [x] Insert a full-viewport `.arrival-intro` before `.scroll-sequence`.
- [x] Add KAIGO brand, short central phrase, compact nav chips, scroll cue, orbit lines, and transition aperture nodes.
- [x] Keep `#frameCanvas` only inside `.scroll-sequence`.
- [x] Update smoke test to require `.arrival-intro` and exactly one `.scroll-sequence`.

### Task 2: Intro Motion System

- [x] Add CSS staged reveal for brand, nav, phrase lines, micro-details, and scroll cue.
- [x] Add scroll-linked exit using `--intro-progress`: text splits away, aperture opens, detail lines translate/rotate.
- [x] Ensure no layout animation uses `top`, `left`, `width`, or `height`; use transform/opacity.
- [x] Add mobile rules so the intro does not overlap or overflow.

### Task 3: JS Scroll Coordination

- [x] Add `introProgress()` based on `.arrival-intro` geometry.
- [x] Set `--intro-progress`, `data-intro-progress`, and nav classes on every scroll frame.
- [x] Keep direct `.scroll-sequence` progress to one frame directory.
- [x] Start frame preloading after loader readiness so the sequence is ready when the user scrolls.

### Task 4: Sequence Panel Energy

- [x] Increase text movement distances and use faster local ranges.
- [x] Add word/line mask children where useful without increasing narrative count.
- [x] Keep one readable panel per checkpoint and preserve the final panel long enough to read.
- [x] Avoid covering the center/right video subject with the nav.

### Task 5: Verification

- [x] Run `npm run smoke`.
- [x] Run local `npm run verify`.
- [x] Inspect generated screenshots for top intro, transition, sequence checkpoints, and mobile.
- [x] Deploy to `/root/kaigo/site-current`, keeping `/old/`.
- [x] Run public `KAIGO_URL=https://kaigo.online KAIGO_PREFIX=public-landing-intro npm run verify`.
- [x] Commit and push the resulting changes to `origin/main`.
