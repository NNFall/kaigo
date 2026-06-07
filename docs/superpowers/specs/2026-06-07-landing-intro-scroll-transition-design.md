# Landing Intro Scroll Transition Design

Date: 2026-06-07

## Goal

Restore a true first-screen landing impression for KAIGO: the page must open on a dynamic abstract KAIGO scene with no visible person or video frame, then transition into the single scroll-controlled video sequence after the first scroll.

## Current Problem

The current prototype starts directly on `frame_0001.webp`. Technically it uses one video sequence, but visually it feels like an old first video/static frame followed by the longer video. The first impression is therefore a technical scroll demo, not a landing entrance.

## Chosen Approach

Use one separate intro section before `.scroll-sequence`.

- The intro is CSS/HTML motion only: no portrait frame, no video canvas, no additional source video.
- Video frames preload in the background while the intro is visible.
- The intro exit uses scroll progress: typography splits, the center panel opens, orbit/line details move, and the fixed nav shifts from an intro top system into the sequence rail.
- The `.scroll-sequence` remains the only video-driven section and still uses `prototype/site/frames`.

## Motion Direction

- First viewport: cinematic, mysterious, sparse, warm dark KAIGO world.
- Motion level: high for a landing site, but implemented through `transform` and `opacity`.
- Text reveal: staggered masks and line slides, not simple fade-only motion.
- Transition: curtain/mask-like reveal into the canvas, not a transparent preview of the video.
- Sequence panels: faster kinetic movement and one readable panel per scene.

## Taste Skill Use

Applied from `design-taste-frontend` and the linked Taste Skill repo:

- High variance layout instead of centered generic hero.
- One accent color, warm neutral palette, no purple/blue AI gradient.
- Transform/opacity-only animation for performance.
- No generic cards or explanatory feature blocks in the first viewport.
- Full-height sections use `100dvh`.
- Compact UI that avoids covering the video subject.

## Files

- `prototype/site/index.html`: add intro section and intro-specific UI nodes.
- `prototype/site/styles.css`: intro composition, staged reveal, scroll-linked exit, nav mode, stronger panel motion.
- `prototype/site/app.js`: intro progress, background frame preload, nav state, sequence progress still mapped to one frame directory.
- `prototype/smoke.test.mjs`: assert intro exists, canvas is not first viewport content, one video sequence only.
- `verification/check-local.mjs`: assert intro top has no visible canvas, then sequence canvas appears and scrubs.
- `docs/OPERATIONS.md` and `docs/PLAN.md`: record the iteration and checks.

## Verification

- `npm run smoke`
- `npm run verify`
- public `KAIGO_URL=https://kaigo.online KAIGO_PREFIX=public-landing-intro npm run verify`
- screenshot review of top, transition, sequence checkpoints, and mobile top.
