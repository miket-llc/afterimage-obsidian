#!/usr/bin/env node
/**
 * Afterimage — lint.
 *   CSS structure, Style Settings YAML, asset references, and the rules the
 *   theme holds itself to (no remote assets, no stray !important, no blanket
 *   animation rules).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const css = fs.readFileSync(path.join(ROOT, 'theme.css'), 'utf8');
let errors = 0, warnings = 0;
const err = (m, d = '') => { errors++; console.log(`  \x1b[31m✗\x1b[0m ${m}${d ? '\n      ' + d : ''}`); };
const warn = (m, d = '') => { warnings++; console.log(`  \x1b[33m!\x1b[0m ${m}${d ? '\n      ' + d : ''}`); };
const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);

/* strip comments once; used by the structural checks */
const bare = css.replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length));

console.log('\nCSS structure');
const open = (bare.match(/\{/g) || []).length, close = (bare.match(/\}/g) || []).length;
open === close ? ok(`braces balanced (${open})`) : err(`brace mismatch: ${open} open, ${close} close`);

const unterminated = (css.match(/\/\*/g) || []).length - (css.match(/\*\//g) || []).length;
unterminated === 0 ? ok('comments terminated') : err(`${unterminated} unterminated comment(s)`);

/* @settings block */
console.log('\nStyle Settings');
const m = css.match(/\/\* @settings\n([\s\S]*?)\n\*\//);
if (!m) err('no @settings block');
else {
  const yamlText = m[1];
  let y;
  try {
    const { load } = await import('js-yaml').catch(() => ({ load: null }));
    y = load ? load(yamlText) : null;
  } catch (e) { err('settings YAML does not parse', e.message); }
  if (!y) {
    // no js-yaml available: fall back to structural checks
    warn('js-yaml not installed — running structural checks only');
    const ids = [...yamlText.matchAll(/^\s*- id:\s*(\S+)/gm)].map((x) => x[1]);
    const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);
    dupes.length ? err(`duplicate setting ids: ${[...new Set(dupes)].join(', ')}`) : ok(`${ids.length} settings, no duplicate ids`);
    y = { settings: [] };
  } else {
    const ids = y.settings.map((s) => s.id);
    const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);
    dupes.length ? err(`duplicate setting ids: ${[...new Set(dupes)].join(', ')}`) : ok(`${ids.length} settings, no duplicate ids`);
    y.name === 'Afterimage' ? ok('panel name is Afterimage') : err(`panel name is "${y.name}"`);
    y.id === 'afterimage' ? ok('panel id is afterimage') : err(`panel id is "${y.id}"`);

    const body = css.slice(0, css.indexOf('/* @settings'));
    const inert = [], noop = [];
    for (const s of y.settings) {
      if (['heading', 'info-text'].includes(s.type)) continue;
      if (s.type.startsWith('variable')) {
        const read = body.includes(`var(--${s.id}`);
        const declared = new RegExp(`--${s.id}\\s*:`).test(body);
        if (!read && !declared) { inert.push(`${s.id} (${s.type}) — variable never read`); continue; }
        /* A var() with NO FALLBACK on a variable the CSS never declares is a
           silent landmine: it makes the whole declaration invalid-at-computed-
           value-time, so the property drops to its initial value. That is how
           --after-ink-raster wiped background-image off every heading while
           lint stayed green.
           `var(--x, fallback)` is fine undeclared — that is Bureau's normal
           pattern for a value Style Settings supplies at runtime — so only
           bare, undeclared reads are flagged. */
        if (!declared) {
          const bare = new RegExp(`var\\(\\s*--${s.id}\\s*\\)`).test(body);
          if (bare) inert.push(`${s.id} — read as var(--${s.id}) with NO fallback and never declared; every declaration using it is invalid`);
        }
      } else if (s.type.startsWith('class')) {
        const vals = s.options ? s.options.map((o) => o.value) : [s.id];
        for (const v of vals) {
          if (body.includes(`.${v}`)) continue;
          /* A select's DEFAULT option is often a deliberate no-op: it names the
             state where no override applies, so there is nothing to declare.
             That is only legitimate for the default — any OTHER option with no
             CSS behind it does nothing when chosen, which is a real defect. */
          if (v === s.default) { noop.push(`${s.id} → .${v}`); continue; }
          inert.push(`${s.id} → .${v} — class never used`);
        }
      }
    }
    inert.length ? err(`${inert.length} inert control(s)`, inert.join('\n      ')) : ok('every non-default option is wired to real CSS');
    if (noop.length) console.log(`      \x1b[2m${noop.length} default option(s) are deliberate no-ops (the "no override" state): ${noop.join(', ')}\x1b[0m`);

    const missingDefault = y.settings.filter((s) => !['heading', 'info-text'].includes(s.type) && s.default === undefined);
    missingDefault.length ? warn(`${missingDefault.length} setting(s) without a default`, missingDefault.map((s) => s.id).join(', ')) : ok('every control has a default');
  }
}

console.log('\nAssets and network');
/* Scan the CSS BODY only. The @settings block is documentation prose and
   legitimately contains example URLs and url(...) syntax in descriptions. */
const cssBody = css.slice(0, css.indexOf('/* @settings'));
/* ...and with comments removed, so prose like "takes a complete url(...) value"
   is not mistaken for a real asset reference. */
const bareBody = bare.slice(0, css.indexOf('/* @settings'));
const remote = [...bareBody.matchAll(/url\(\s*['"]?(https?:)?\/\//g)];
remote.length ? err(`${remote.length} remote url() reference(s) — the theme must work offline`) : ok('no remote asset references');
/* Ignore anything inside a data: URI — an inline SVG's own fragment
   references (url(#gradient)) are not theme-folder assets. */
const relative = [...bareBody.replace(/url\(\s*(['"])data:[\s\S]*?\1\s*\)/g, 'url(data:)')
  .replace(/url\(\s*data:[^\s]*?\)/g, 'url(data:)')
  .matchAll(/url\(\s*['"]?(?!data:|#)([^'")]+)['"]?\s*\)/g)].filter((x) => !/^https?:/.test(x[1]));
relative.length ? err(`${relative.length} relative url() — Obsidian injects theme.css inline, so these cannot resolve`,
  relative.slice(0, 4).map((x) => x[1]).join(', ')) : ok('no relative url() references');
const brokenData = [...bareBody.matchAll(/data:image\/svg\+xml,[^"')]*#/g)];
brokenData.length ? err(`${brokenData.length} SVG data URI(s) with a literal '#' — truncates at the fragment`) : ok("no data URIs broken by a literal '#'");

console.log('\nHouse rules');
const bangs = [...cssBody.matchAll(/!important/g)];
const printStart = cssBody.indexOf('@media print');
const motionStart = cssBody.indexOf('REDUCED MOTION (final word)');
const printBangs = printStart === -1 ? 0
  : (cssBody.slice(printStart, motionStart > printStart ? motionStart : undefined).match(/!important/g) || []).length;
const motionBangs = motionStart === -1 ? 0
  : (cssBody.slice(motionStart, motionStart + 2000).match(/!important/g) || []).length;
const other = bangs.length - printBangs - motionBangs;
console.log(`      !important: ${bangs.length} total — ${printBangs} in print, ${motionBangs} in reduced-motion, ${other} elsewhere`);
other <= 8 ? ok(`!important kept to ${other} outside print / reduced-motion`) : warn(`${other} !important outside print and reduced-motion`);

const blanket = [...bare.matchAll(/^\s*\*\s*\{[^}]*animation\s*:/gm)];
blanket.length ? err(`${blanket.length} blanket \`* { animation }\` rule(s)`) : ok('no blanket universal animation rules');

const oldNs = (css.match(/--bu-|\.bu-|--ai-\b/g) || []).length;
oldNs === 0 ? ok('namespace fully migrated to --after-') : err(`${oldNs} legacy --bu-/--ai- reference(s) remain`);

console.log(`\n  ${errors} error(s), ${warnings} warning(s)\n`);
process.exit(errors ? 1 : 0);
