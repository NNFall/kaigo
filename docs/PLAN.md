# KAIGO Scroll Prototype Plan

Date: 2026-06-06

## Goal

Build a first deployable prototype for `kaigo.online` with a scroll-controlled cinematic hero based on `generated_video_8.mp4`, while keeping the current site available as an old version.

## Status Legend

- `[ ]` Pending
- `[~]` In progress
- `[x]` Done

## Plan

1. `[x]` Prepare local workspace folders for source assets, prototype, deployment package, and verification screenshots.
2. `[x]` Inspect the provided Claude/Nano Banana scroll-stop skills and extract the relevant frame-sequence/canvas technique.
3. `[x]` Analyze the video source: duration, FPS, resolution, frame count, and preview contact sheet.
4. `[x]` Inspect the current server state: `/root/kaigo`, nginx config, active routes, and old-site behavior.
5. `[x]` Build the local prototype:
   - Extract production-ready frame sequence from the MP4.
   - Create a React/Vite prototype or static prototype if faster for the first proof.
   - Implement canvas frame preloading and scroll-position-to-frame rendering.
   - Match the provided references: warm cinematic background, red KAIGO accent, section counter, large Russian typography, and 6-lane structure.
6. `[x]` Add smoke checks for local prototype behavior:
   - HTML loads.
   - Required frame files exist.
   - Canvas/scroll script references valid frames.
   - Old-site route plan is documented before server deploy.
7. `[x]` Run local browser verification:
   - Start a local server.
   - Capture desktop screenshots.
   - Check hero, scroll sequence, section overlays, and mobile layout if time allows.
8. `[x]` Prepare server deploy package.
9. `[x]` Preserve current production site as old version:
   - Backup current nginx config.
   - Copy current `/root/kaigo/dist` to an old-version directory.
   - Configure `kaigo.online/old/` and old internal routes without breaking the new root.
10. `[x]` Deploy prototype to server and switch `kaigo.online/` root to the new prototype.
11. `[x]` Verify public domain:
    - `https://kaigo.online/`
    - `https://kaigo.online/old/`
    - sample old routes
    - prototype assets and frames
12. `[x]` Record final deployment details and residual risks.

## Current Design Direction

- Register: brand/portfolio, design is the product.
- Visual language: warm cinematic KAIGO world, human-centered AI, mountain/cloud environment, reflective spheres, red accent.
- First prototype scope: prove the scroll-controlled video hero and page rhythm. Other blocks can be intentionally rough placeholders.
- Main technical technique: extracted frame sequence drawn to a sticky canvas based on scroll progress.

## Deployment Result

- New prototype: `https://kaigo.online/`
- Old site: `https://kaigo.online/old/`
- Old internal routes checked: `/old/about`, `/old/projects`
- Server prototype directory: `/root/kaigo/site-current`
- Server old-site directory: `/root/kaigo/old-public/old`
- Server deploy ZIP: `/root/kaigo/deploy/kaigo-scroll-prototype.zip`
- Server backups:
  - `/root/kaigo/deploy/backups/kaigo.online.nginx.20260606-010320.bak`
  - `/root/kaigo/deploy/backups/App.tsx.20260606-010320.bak`

## Current Iteration

- Latest local iteration: landing intro plus single-video `videokaigo.mp4` scroll sequence, 2026-06-07.
- Source video: `C:\Users\User\Downloads\videokaigo.mp4`, `12.1s`, `1920x1080`, `30fps`, `363` frames.
- Frame output: `prototype/site/frames/frame_0001.webp` through `frame_0363.webp`, scaled to `1440x810`, total about `14.9 MB`.
- Main change: restored a separate animated landing intro before the video. The first viewport no longer shows the person, the first frame, or the canvas.
- Video architecture: still one frame directory, one canvas, one `SEQUENCE_CONFIG`, and no `frames-next`.
- Header change: the header starts as a centered intro strip, then becomes a compact left rail in the video sequence.
- Performance change: the page becomes ready after the first `6` decoded frames, then uses a rolling preload window, priority promotion, a delayed idle warmup, and a bounded warmup queue.
- Local verification prefix: `local`
- Local verification results:
  - loader unblocked in `210ms`
  - initial frame requests: `20`
  - total frame requests during full verification sweep: `301`
  - intro is the first visible section on desktop and mobile
  - frame canvas starts below the first viewport
  - wheel test advanced scroll and frame index
  - canvas nonblank at progress `0`, `0.25`, `0.5`, `0.75`, `1`
  - request failures: `[]`
- Public verification prefix: `public-landing-intro`
- Public verification results:
  - loader unblocked in `1012ms`
  - initial frame requests: `7`
  - total frame requests during full verification sweep: `200`
  - intro is the first visible section on desktop and mobile
  - frame canvas starts below the first viewport
  - canvas nonblank at sequence progress `0`, `0.25`, `0.5`, `0.75`, `1`
  - request failures: `[]`
  - old site remains available at `/old/`, `/old/about`, and `/old/projects`

## Previous Iteration

- Latest deployed iteration: two-video scroll sequence and slower intro motion, 2026-06-07.
- Implementation plan: `docs/superpowers/plans/2026-06-06-hero-motion-iteration.md`
- Motion direction: `docs/HERO_MOTION_DIRECTION.md`
- Latest server backup before this iteration: `/root/kaigo/deploy/backups/site-current-dir.20260607-003632`
- Latest public verification prefix: `public-two-scenes-v1`
- Main change: the first provided replacement video now drives the first scroll scene, and the second provided video drives a new second scroll scene. The first screen keeps the abstract cinematic background and now has slower staged motion, extra micro-particles, staged text notes, and a header panel that reveals from the center.
- Canvas reveal checkpoints from verification:
  - pre-sequence: opacity `0`
  - scene 01 progress `0.00`: opacity `0`
  - scene 01 progress `0.08`: opacity `0.1551`
  - scene 01 progress `0.25`: opacity `0.9949`
  - scene 02 progress `0.00`: opacity `0`
  - scene 02 progress `0.08`: opacity `0.2376`
  - scene 02 progress `0.25`: opacity `1`
- Frame hold checkpoints from verification:
  - scene 01 progress `0.60`: frame progress `1`, message opacity `1`
  - scene 01 progress `0.85`: frame progress `1`, message opacity `1`
  - scene 02 progress `0.60`: frame progress `1`, message opacity `1`
  - scene 02 progress `0.85`: frame progress `1`, message opacity `1`

## Residual Risks / Next Iteration

- This is still a first motion prototype, not the final React/Vite implementation.
- Lower sections are intentionally simple placeholders and should be rebuilt with final content/assets.
- The old site was rebuilt with `/old/` routing support; keep the backup files until the new root is fully approved.
- Public Playwright verification emits one canvas readback warning from the test's `getImageData` sampling; it is a verification-side warning, not a production rendering error.
- The single-video mechanics and separate landing intro are now deployed. The next visual improvement should tune final copy, intro art direction, and crop choices after reviewing the public motion in-browser.
