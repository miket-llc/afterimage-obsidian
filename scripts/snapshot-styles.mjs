#!/usr/bin/env node
/** Dump computed styles for a broad element set, so a mechanical refactor can
 *  be proved to change nothing. node scripts/snapshot-styles.mjs <out.json> */
import { chromium } from 'playwright';
import fs from 'node:fs';
const out = process.argv[2] ?? 'snap.json';
const BASE = process.env.AI_BASE ?? 'http://localhost:8817';
const PROPS = ['color','background-color','background-image','background-clip','border-color',
  'border-left-color','box-shadow','text-shadow','font-family','font-size','line-height',
  'letter-spacing','text-transform','padding','margin','opacity','mix-blend-mode',
  '-webkit-text-fill-color','filter','display','border-bottom'];
const SELS = ['body','.inline-title','.markdown-rendered h1','.markdown-rendered h2','.markdown-rendered h3',
  '.markdown-rendered h4','.markdown-rendered h5','.markdown-rendered h6','.markdown-preview-sizer',
  '.markdown-preview-sizer > p','.markdown-rendered strong','.markdown-rendered em',
  '.markdown-rendered a.internal-link','.markdown-rendered a.external-link','.markdown-rendered a.is-unresolved',
  '.markdown-rendered del','.markdown-rendered mark','.markdown-rendered code','.markdown-rendered th',
  '.markdown-rendered td','.callout','.callout-title','.metadata-container','.metadata-properties-heading',
  '.metadata-property','.metadata-property-key-input','.metadata-input-longtext','.multi-select-pill',
  '.workspace-tab-header','.workspace-tab-header.is-active','.tree-item-self.nav-file-title',
  '.tree-item-self.is-active','.status-bar','.status-bar-item','.view-header','.workspace-ribbon',
  '.nav-files-container','.search-result-file-title','.backlink-pane'];
let browser; try { browser = await chromium.launch({channel:'chrome'}); } catch { browser = await chromium.launch(); }
const snap = {};
for (const [name, url, cls] of [
  ['dark', `${BASE}/test/harness/index.html`, 'theme-dark'],
  ['light', `${BASE}/test/harness/index.html`, 'theme-light'],
  ['amber', `${BASE}/test/harness/index.html`, 'theme-dark after-profile-amber'],
  ['3270', `${BASE}/test/harness/index.html`, 'theme-dark after-font-3270'],
  ['editor', `${BASE}/test/harness/editor.html`, 'theme-dark'],
]) {
  const page = await browser.newPage({ viewport:{width:1400,height:900} });
  await page.goto(url, { waitUntil:'networkidle' });
  await page.evaluate(()=>document.fonts.ready);
  snap[name] = await page.evaluate(({SELS,PROPS,cls}) => {
    document.body.className = cls + ' mod-macos is-focused';
    const r = {};
    for (const s of SELS) {
      const el = document.querySelector(s);
      if (!el) { r[s] = null; continue; }
      const cs = getComputedStyle(el);
      r[s] = Object.fromEntries(PROPS.map(p => [p, cs.getPropertyValue(p)]));
      for (const ps of ['::before','::after']) {
        const c2 = getComputedStyle(el, ps);
        if (c2.content && c2.content !== 'none')
          r[s+ps] = Object.fromEntries([...PROPS,'content'].map(p => [p, c2.getPropertyValue(p)]));
      }
    }
    return r;
  }, {SELS,PROPS,cls});
  await page.close();
}
fs.writeFileSync(out, JSON.stringify(snap, null, 1));
const n = Object.values(snap).reduce((a,o)=>a+Object.keys(o).length,0);
console.log(`wrote ${out} — ${Object.keys(snap).length} modes, ${n} element snapshots`);
await browser.close();
