// Renders index.html frame-by-frame and encodes magnesium.mp4 (1080x1920, 30fps).
// Usage: node render.mjs
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const framesDir = path.join(dir, 'frames');
const FPS = 30;

rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(pathToFileURL(path.join(dir, 'index.html')).href + '?capture');
await page.evaluate(async () => {
  await Promise.all(['124px Anton', '800 30px Inter', '700 30px Inter', '500 26px Inter'].map(f => document.fonts.load(f)));
  await document.fonts.ready;
  const ok = [...document.fonts].some(f => f.family.replace(/"/g, '') === 'Anton' && f.status === 'loaded');
  if (!ok) throw new Error('Anton font failed to load');
});
const duration = await page.evaluate(() => window.DURATION);
const stage = page.locator('#stage');

const total = Math.round(duration * FPS);
for (let i = 0; i < total; i++) {
  await page.evaluate(t => window.renderAt(t), i / FPS);
  await stage.screenshot({ path: path.join(framesDir, `f${String(i).padStart(4, '0')}.png`) });
}
await browser.close();

execFileSync('ffmpeg', [
  '-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart',
  path.join(dir, 'magnesium.mp4'),
], { stdio: 'inherit' });
rmSync(framesDir, { recursive: true, force: true });
console.log(`Rendered ${total} frames -> magnesium.mp4`);
