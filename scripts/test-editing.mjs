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
    // This assertion is about OCCLUSION, so it has to sample a point the element
    // actually paints. Two ways it used to sample a point the element does not:
    //
    //  1. Below the fold. elementFromPoint is viewport-relative and returns null
    //     outside it, which is indistinguishable here from "an overlay is on
    //     top". The internal link sits ~3200px down the note, so the result
    //     depended on how far earlier steps in this file had scrolled the pane.
    //  2. The union box of a WRAPPED inline. A link broken across two lines has
    //     a bounding rect spanning both, and its centre falls in the leading
    //     BETWEEN them — where the paragraph paints, not the link.
    //
    // Both reported a phantom overlay. Scroll it into view, then sample the
    // centre of its first client rect, which is a point inside one real line box.
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getClientRects()[0] ?? el.getBoundingClientRect();
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

// ── The tube stack ──────────────────────────────────────────────────────────
// The module raster is the spec's central mechanism and its two failure modes
// are both silent: land it UNDER the content and it has nothing bright to
// subtract from, so the effect just disappears; drop `isolation: isolate` and
// `multiply` blends against the housing instead of the tube, so the aperture
// goes black. Neither shows up as an error anywhere — only as a wrong picture.
console.log('\nTube stack — the module raster');
const tube = await page.evaluate(() => {
  const m = document.querySelector('.workspace');   // ONE tube — the glass is .workspace itself
  const host = getComputedStyle(m);
  const scan = getComputedStyle(m, '::before');
  const sheen = getComputedStyle(m, '::after');
  return {
    isolation: host.isolation,
    position: host.position,
    scan: { content: scan.content, blend: scan.mixBlendMode, pe: scan.pointerEvents, z: +scan.zIndex },
    sheen: { content: sheen.content, blend: sheen.mixBlendMode, pe: sheen.pointerEvents, z: +sheen.zIndex },
  };
});
ok('the tube is its own stacking context (multiply blends against the glass, not the case)',
   tube.isolation === 'isolate' && tube.position === 'relative', JSON.stringify(tube));
ok('tube raster exists on .workspace::before', tube.scan.content !== 'none', JSON.stringify(tube.scan));
ok('tube raster multiplies', tube.scan.blend === 'multiply', tube.scan.blend);
ok('tube raster sits OVER the content', tube.scan.z >= 10, `z-index ${tube.scan.z}`);
ok('glass sheen exists and screens', tube.sheen.content !== 'none' && tube.sheen.blend === 'screen',
   JSON.stringify(tube.sheen));
ok('neither tube layer takes pointer events',
   tube.scan.pe === 'none' && tube.sheen.pe === 'none', `${tube.scan.pe} / ${tube.sheen.pe}`);

// Chrome ELEMENTS do not move on their own. The tube OVERLAY may: the refresh
// bar and the mains flicker are CRT artifacts, not decoration
// (docs/chrome-spec/DESIGN-MODEL.md, forbidden moves — "deleting ambient
// motion"). So the assertion is scoped: everything drawn ON the tube is
// still, and only the overlay that IS the tube is allowed to animate.
const chromeAnim = await page.evaluate(() => {
  document.body.classList.add('after-anim');
  const els = [
    '.mod-root .workspace-tabs', '.workspace-tab-header', '.status-bar',
    '.status-bar-item', '.workspace-sidedock-vault-profile',
    '.side-dock-ribbon-action', '.tree-item-self', '.view-header',
  ].map((s) => document.querySelector(s)).filter(Boolean);
  const names = [];
  for (const el of els) {
    for (const pseudo of [null, '::before', '::after']) {
      const n = getComputedStyle(el, pseudo).animationName;
      if (n && n !== 'none') names.push(`${el.className.split(' ')[0]}${pseudo ?? ''}: ${n}`);
    }
  }
  document.body.classList.remove('after-anim');
  return names;
});
ok('no chrome ELEMENT animates (tube overlay exempt)', chromeAnim.length === 0, chromeAnim.join(', '));

// …and the tube overlay DOES: the refresh bar is the one expected ambient
// animation (DESIGN-MODEL.md — "one expected animation on the tube overlay").
const refresh = await page.evaluate(() => {
  document.body.classList.add('after-anim');
  const cs = getComputedStyle(document.querySelector('.workspace'), '::after');
  const names = cs.animationName;
  document.body.classList.remove('after-anim');
  return names;
});
ok('the refresh bar drifts on the tube overlay under Animations',
   refresh.includes('after-refresh') && refresh.includes('after-flicker'), refresh);

// Paper: the reverse plate inverts to a dark slate with paper letters, and
// keeps a real luminance gap. Light mode had zero rendered coverage before.
const paper = await page.evaluate(() => {
  document.body.classList.remove('theme-dark');
  document.body.classList.add('theme-light');
  // color-mix values compute to color(srgb r g b) with 0–1 floats — handle both
  const lum = (c) => {
    let v = (c.match(/[\d.]+/g) || []).map(Number);
    if (c.startsWith('color(')) v = v.map((x) => x * 255);
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  };
  const row = document.querySelector('.tree-item-self.is-active');
  const plate = lum(getComputedStyle(row).backgroundColor);
  const ink = lum(getComputedStyle(row.querySelector('.tree-item-inner, .nav-file-title-content')).color);
  document.body.classList.remove('theme-light');
  document.body.classList.add('theme-dark');
  return { plate, ink };
});
ok('paper: reverse plate is dark, letters are paper, gap holds',
   paper.plate < 120 && paper.ink > 150 && (paper.ink - paper.plate) > 60, JSON.stringify(paper));

// ── The phosphor laws, mechanically ─────────────────────────────────────────
// Law 2's greyscale test: if a state was only distinguishable by hue, that
// state has no encoding. Desaturate the active and an inactive tab title and
// require a real luminance gap.
console.log('\nPhosphor laws — rendered');
const grey = await page.evaluate(() => {
  const lum = (el) => {
    const color = getComputedStyle(el).color;
    let channels = (color.match(/[\d.]+/g) || []).map(Number);
    if (color.startsWith('color(')) channels = channels.map((x) => x * 255);
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const act = document.querySelector('.mod-root .workspace-tab-header.is-active .workspace-tab-header-inner-title');
  const rest = document.querySelector('.mod-root .workspace-tab-header:not(.is-active) .workspace-tab-header-inner-title');
  return { act: lum(act), rest: lum(rest) };
});
ok('greyscale: active tab differs from inactive by luminance, not hue',
   Math.abs(grey.act - grey.rest) > 40, JSON.stringify(grey));

// Five tubes: switching phosphor preset changes every lit pixel and no
// layout. Chrome inks must therefore DERIVE from --after-phosphor rather
// than restate it — a literal hex passes the hue lint and fails here.
const tubes = await page.evaluate(() => {
  const probe = () => {
    const g = (sel, prop = 'color') => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el)[prop] : 'missing';
    };
    return {
      tabActive: g('.mod-root .workspace-tab-header.is-active .workspace-tab-header-inner-title'),
      tabRest: g('.mod-root .workspace-tab-header:not(.is-active) .workspace-tab-header-inner-title'),
      row: g('.nav-file-title-content'),
      flair: g('.tree-item-flair'),
      status: g('.status-bar-item-segment'),
      frame: g('.mod-root .workspace-tab-container', 'borderLeftColor'),
      geometry: document.querySelector('.mod-root .workspace-tabs').getBoundingClientRect().toJSON(),
    };
  };
  const cobalt = probe();
  document.body.classList.add('after-profile-amber');
  const amber = probe();
  document.body.classList.remove('after-profile-amber');
  return { cobalt, amber };
});
{
  const inks = ['tabActive', 'tabRest', 'row', 'flair', 'status', 'frame'];
  const unchanged = inks.filter((k) => tubes.cobalt[k] === tubes.amber[k]);
  ok('switching tube changes every lit chrome ink',
     unchanged.length === 0, `unchanged: ${unchanged.join(', ')}`);
  ok('switching tube changes no layout',
     JSON.stringify(tubes.cobalt.geometry) === JSON.stringify(tubes.amber.geometry),
     JSON.stringify(tubes.amber.geometry));
}

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
