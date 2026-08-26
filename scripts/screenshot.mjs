#!/usr/bin/env node
/**
 * Afterimage — deterministic screenshots.
 *   node scripts/screenshot.mjs <url-or-file> [--out FILE] [--sel CSS]
 *        [--w 1440] [--h 900] [--dpr 2] [--full] [--select "CSS@start,end"]
 */
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const a = process.argv.slice(2);
const get = (f, d) => { const i = a.indexOf(f); return i === -1 ? d : a[i + 1]; };
const has = (f) => a.includes(f);

const target = a.find((x) => !x.startsWith('--') && a[a.indexOf(x) - 1]?.startsWith('--') !== true) ?? a[0];
const url = target.startsWith('http') ? target : 'file://' + path.resolve(target);
const out = get('--out', 'shot.png');
const sel = get('--sel', null);
const selectRange = get('--select', null);

let browser;
try {
  browser = await chromium.launch({ channel: 'chrome' });   // system Chrome
} catch {
  browser = await chromium.launch();                        // bundled build
}
const page = await browser.newPage({
  viewport: { width: +get('--w', 1440), height: +get('--h', 900) },
  deviceScaleFactor: +get('--dpr', 2),
  colorScheme: has('--light') ? 'light' : 'dark',
  reducedMotion: has('--reduced-motion') ? 'reduce' : 'no-preference',
});
await page.goto(url, { waitUntil: 'networkidle' });

// --body-class "a b c"   set theme classes (presets, profiles, toggles)
// --body-class-remove "x" strip classes (e.g. theme-dark)
const addCls = get('--body-class', null);
const rmCls = get('--body-class-remove', null);
if (addCls || rmCls) {
  await page.evaluate(({ addCls, rmCls }) => {
    if (rmCls) rmCls.split(/\s+/).filter(Boolean).forEach(c => document.body.classList.remove(c));
    if (addCls) addCls.split(/\s+/).filter(Boolean).forEach(c => document.body.classList.add(c));
  }, { addCls, rmCls });
}
// --var "--name:value;--n2:v2"  set inline custom properties on body
const varStr = get('--var', null);
if (varStr) {
  await page.evaluate((v) => {
    v.split(';').filter(Boolean).forEach(pair => {
      const i = pair.indexOf(':');
      document.body.style.setProperty(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
    });
  }, varStr);
}
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(+get('--wait', 250));

if (selectRange) {
  const [css, range] = selectRange.split('@');
  const [s, e] = (range ?? '0,20').split(',').map(Number);
  await page.evaluate(({ css, s, e }) => {
    const el = document.querySelector(css);
    const t = el.firstChild;
    const r = document.createRange();
    r.setStart(t, s); r.setEnd(t, e);
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
  }, { css, s, e });
}

fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
const node = sel ? page.locator(sel).first() : page;
await node.screenshot({ path: out, fullPage: !sel && has('--full'), animations: 'disabled' });
console.log(`wrote ${out}`);
await browser.close();
