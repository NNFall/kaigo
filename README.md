# KAIGO

Current KAIGO scroll-controlled cinematic prototype.

## Structure

- `prototype/site/` - static site served on `https://kaigo.online/`
- `prototype/site/frames/` - first scroll video frame sequence
- `prototype/site/frames-next/` - second scroll video frame sequence
- `prototype/smoke.test.mjs` - static project checks
- `verification/check-local.mjs` - Playwright visual/canvas checks
- `docs/` - plan, operations log, and motion notes

The previous production site is preserved in the Git branch `old-version`.

## Local Check

```bash
npm install
npm run smoke
```

For browser verification, serve `prototype/site` locally on `127.0.0.1:4174`, then run:

```bash
npm run verify
```

The deployed server keeps the old site available at `https://kaigo.online/old/`.
