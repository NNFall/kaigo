# KAIGO

Current KAIGO cinematic landing prototype with an animated intro and one scroll-controlled video sequence.

## Structure

- `prototype/site/` - static site served on `https://kaigo.online/`
- `prototype/site/frames/` - single 30fps scroll video frame sequence, 363 WebP frames
- `prototype/smoke.test.mjs` - static project checks
- `verification/check-local.mjs` - Playwright visual/canvas checks
- `verification/static-server.mjs` - local static server used by verification
- `docs/` - plan, operations log, and motion notes

The first viewport is an abstract animated KAIGO intro. The frame canvas starts only in the following scroll sequence, so the prototype uses one video source without visually exposing frame 1 as the landing screen. The previous production site is preserved in the Git branch `old-version`.

## Local Check

```bash
npm install
npm run smoke
```

For browser verification, serve `prototype/site` locally on `127.0.0.1:4174`, then run:

```bash
node verification/static-server.mjs prototype/site 4174 127.0.0.1
```

In a second terminal:

```bash
npm run verify
```

The deployed server keeps the old site available at `https://kaigo.online/old/`.
