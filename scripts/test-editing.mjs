#!/usr/bin/env node
/**
 * Afterimage — editing-behaviour tests.
 *
 * These are the guarantees no optical effect may break. They run against the
 * DOM harness in a real Chromium, not against assertions about CSS.
 *   node scripts/test-editing.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.AI_BASE ?? 'http://localhost:8817';
let pass = 0, fail = 0;
const ok = (n, c, d = '') => { c ? (pass++, console.log(`  \x1b[32m✓\x1b[0m ${n}`)) : (fail++, console.log(`  \x1b[31m✗\x1b[0m ${n}${d ? ' — ' + d : ''}`)); };

let browser;
try { browser = await chromium.launch({ channel: 'chrome' }); } catch { browser = await chromium.launch(); }
const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });

// ── Properties: real inputs and contenteditable ─────────────────────────────
console.log('\nProperties — editing');
await page.goto(`${BASE}/test/harness/index.html`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const valSel = '.metadata-property[data-property-key="status"] .metadata-input-longtext';
await page.click(valSel);
await page.keyboard.press('End');
await page.keyboard.type('-EDITED');
const typed = await page.$eval(valSel, (e) => e.textContent);
ok('typing into a property value commits the characters', typed.includes('-EDITED'), typed);

const caretVisible = await page.$eval(valSel, (e) => {
  const cs = getComputedStyle(e);
  return cs.caretColor !== 'transparent' && cs.caretColor !== 'rgba(0, 0, 0, 0)';
});
ok('property value has a visible caret colour', caretVisible);

const fillOk = await page.$eval(valSel, (e) => {
  const cs = getComputedStyle(e);
  return cs.webkitTextFillColor !== 'rgba(0, 0, 0, 0)' && cs.color !== 'rgba(0, 0, 0, 0)';
});
ok('property value text is not transparent', fillOk);

// key legend must stay legible while its row is hovered / focused
const keySel = '.metadata-property[data-property-key="status"] .metadata-property-key-input';
const keyState = await page.$eval(keySel, (e) => {
  const cs = getComputedStyle(e);
  return { fill: cs.webkitTextFillColor, bg: cs.backgroundColor, clip: cs.backgroundClip, img: cs.backgroundImage };
});
ok('focused row: key legend has a solid fill', keyState.fill !== 'rgba(0, 0, 0, 0)', JSON.stringify(keyState));
ok('focused row: key plate is not clipped to the glyphs',
   !(keyState.img === 'none' && keyState.clip.split(',')[0].trim() === 'text'),
   `clip=${keyState.clip} img=${keyState.img}`);

// ── Overlays must never intercept pointers ──────────────────────────────────
console.log('\nOverlays — hit testing');
for (const [name, sel] of [['internal link', '.markdown-rendered a.internal-link'],
                           ['file tree row', '.tree-item-self.nav-file-title'],
                           ['tab header', '.workspace-tab-header']]) {
  const hit = await page.$eval(sel, (el) => {
    const r = el.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return el.contains(top) || top === el;
  });
  ok(`${name} receives the pointer (no overlay on top)`, hit);
}

// ── Selection ───────────────────────────────────────────────────────────────
console.log('\nSelection');
const selInfo = await page.evaluate(() => {
  const p = document.querySelector('.markdown-preview-sizer > p');
  const r = document.createRange(); r.setStart(p.firstChild, 5); r.setEnd(p.firstChild, 25);
  const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  return { text: s.toString().length };
});
ok('prose is selectable', selInfo.text === 20, `selected ${selInfo.text} chars`);

const copied = await page.evaluate(() => {
  const h = document.querySelector('.markdown-rendered h1');
  const r = document.createRange(); r.selectNodeContents(h);
  const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  return s.toString();
});
// NOTE: Chromium's Selection.toString() returns TRANSFORMED text, so this
// comes back upper-cased. That is the inherited `text-transform: uppercase`
// on reading-view headings, not a raster defect — the point of this check is
// that a clipped, transparent-filled heading still yields real characters
// rather than nothing. Case is compared insensitively on purpose; the
// uppercase-on-copy behaviour is recorded in docs/TESTING.md as a known
// limitation.
ok('a raster-rendered heading copies as real text, not blank',
   copied.trim().toLowerCase().startsWith('heading 1'), JSON.stringify(copied.slice(0, 40)));

// ── Sidebar panes must agree ────────────────────────────────────────────────
// Obsidian builds the file explorer, tag pane, outline and backlinks from the
// same .tree-item scaffolding. Styling one and not the others makes the
// sidebar read as several different applications stacked up — which is exactly
// what happened when the row rhythm was first scoped to the file explorer
// alone. This asserts they stay in step.
console.log('\nSidebar — pane consistency');
const panes = await page.evaluate(() => {
  const pitch = (s) => { const n = [...document.querySelectorAll(s)]; return n.length < 2 ? null
    : Math.round(n[1].getBoundingClientRect().top - n[0].getBoundingClientRect().top); };
  const fs = (s) => { const e = document.querySelector(s); return e ? parseFloat(getComputedStyle(e).fontSize) : null; };
  return {
    'file explorer': [pitch('.nav-file-title'), fs('.nav-file-title-content')],
    'tag pane':      [pitch('.tag-pane-tag .tree-item-self'), fs('.tag-pane-tag-text')],
    'outline':       [pitch('.outline-view .tree-item-self'), fs('.outline-view .tree-item-inner')],
    'backlinks':     [pitch('.backlink-pane .tree-item-self'), fs('.search-result-file-title')],
  };
});
const pitches = Object.values(panes).map((p) => p[0]).filter((n) => n != null);
const sizes = Object.values(panes).map((p) => p[1]).filter((n) => n != null);
for (const [name, [p, f]] of Object.entries(panes))
  ok(`${name} present and measured`, p != null && f != null, JSON.stringify(panes[name]));
ok('every sidebar pane uses the same type size', new Set(sizes).size === 1, JSON.stringify(panes));
ok('every sidebar row pitch is within 4px', Math.max(...pitches) - Math.min(...pitches) <= 4,
   `pitches ${pitches.join(', ')}`);
ok('sidebar rows are dense (pitch < 1.9x the type size)', Math.max(...pitches) < sizes[0] * 1.9,
   `max pitch ${Math.max(...pitches)} vs ${sizes[0]}px type`);

// ── Live Preview harness ────────────────────────────────────────────────────
console.log('\nLive Preview');
await page.goto(`${BASE}/test/harness/editor.html`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const lineFill = await page.$eval('.cm-line:nth-child(3)', (e) => getComputedStyle(e).webkitTextFillColor);
ok('editable line text is not transparent', lineFill !== 'rgba(0, 0, 0, 0)', lineFill);

const rasterOn = await page.evaluate(() => {
  const ed = document.querySelector('.cm-editor');
  const cs = getComputedStyle(ed, '::before');
  return { content: cs.content, blend: cs.mixBlendMode, pe: cs.pointerEvents, z: cs.zIndex };
});
ok('editor raster layer exists on .cm-editor::before', rasterOn.content !== 'none', JSON.stringify(rasterOn));
ok('editor raster uses a blend mode', ['multiply', 'screen'].includes(rasterOn.blend), rasterOn.blend);
ok('editor raster never takes pointer events', rasterOn.pe === 'none', rasterOn.pe);

const cmContentPos = await page.$eval('.cm-content', (e) => getComputedStyle(e).position);
ok('.cm-content keeps its own positioning (CodeMirror layers unaffected)',
   cmContentPos === 'static', `position: ${cmContentPos}`);

await page.click('.cm-line:nth-child(3)');
await page.keyboard.type('XYZ');
const cmTyped = await page.$eval('.cm-line:nth-child(3)', (e) => e.textContent);
ok('typing works in the Live Preview harness', cmTyped.includes('XYZ'));

const compZ = await page.$eval('.cm-composition', (e) => +getComputedStyle(e).zIndex);
ok('IME composition sits above the raster layer', compZ >= 6, `z-index ${compZ}`);

const matchBg = await page.$eval('.cm-searchMatch-selected', (e) => getComputedStyle(e).backgroundColor);
ok('active search match has a distinct background', matchBg !== 'rgba(0, 0, 0, 0)', matchBg);

await page.screenshot({ path: '/tmp/ai-shots/editor-harness.png' });
await browser.close();

console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
