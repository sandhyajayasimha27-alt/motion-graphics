# Magnesium — slide-and-bounce title

5s vertical (1080×1920, 30fps) motion graphic: a supplement box rises in, the word
**MAGNESIUM** whips in from the left, overshoots, and settles on the box's orange band
with a spring bounce, impact flash, shock ring and particle burst. "GLYCINATE" and a
tagline track in after.

- `index.html` — the animation. Open it in a browser for a looping live preview.
- `render.mjs` — captures frames with Playwright and encodes `magnesium.mp4` via ffmpeg.
- `fonts/` — Anton and Inter (SIL Open Font License), self-hosted so renders work offline.

Re-render: `npm i playwright` (or link a global install into `node_modules/`), then `node render.mjs`.

Tweak the bounce in `index.html`: `D` (damping), `OMEGA` (bounce speed), `T_IN` (entry time).
