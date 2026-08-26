#!/usr/bin/env node
/** Inspect computed styles / CSS variables in the harness.
 *  node scripts/probe.mjs <url> --sel "<css>" --props color,background-color
 *  node scripts/probe.mjs <url> --vars --bu-text,--bu-bg
 */
import { chromium } from 'playwright';
const a = process.argv.slice(2);
const get = (f, d) => { const i = a.indexOf(f); return i === -1 ? d : a[i + 1]; };
const url = a[0];
let browser;
try { browser = await chromium.launch({ channel: 'chrome' }); } catch { browser = await chromium.launch(); }
const page = await browser.newPage({ viewport: { width: +get('--w',1440), height: +get('--h',900) }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
if (a.includes('--vars')) {
  const names = get('--vars', '').split(',').filter(Boolean);
  const out = await page.evaluate((names) => {
    const cs = getComputedStyle(document.body);
    return Object.fromEntries(names.map(n => [n, cs.getPropertyValue(n).trim()]));
  }, names);
  console.log(JSON.stringify(out, null, 1));
}
const sel = get('--sel', null);
if (sel) {
  const props = get('--props', 'color,background-color,font-family,font-size,line-height,opacity,mix-blend-mode').split(',');
  const out = await page.evaluate(({sel, props}) => {
    const els = [...document.querySelectorAll(sel)].slice(0, +3);
    return els.map(el => {
      const cs = getComputedStyle(el);
      const o = { _: el.className.toString().slice(0,60) };
      props.forEach(p => o[p] = cs.getPropertyValue(p));
      return o;
    });
  }, {sel, props});
  console.log(JSON.stringify(out, null, 1));
}
await browser.close();
