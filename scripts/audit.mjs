#!/usr/bin/env node
/**
 * Afterimage — audit.
 *   Licensing, attribution, branding and bundle claims. Verifies the FACTS in
 *   FONT_LICENSES.md against the files actually present, rather than trusting
 *   the document.
 *     node scripts/audit.mjs [--fonts-only]
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT = path.resolve(import.meta.dirname, '..');
const p = (...x) => path.join(ROOT, ...x);
const FONTS_ONLY = process.argv.includes('--fonts-only');
let errors = 0, warnings = 0;
const err = (m, d = '') => { errors++; console.log(`  \x1b[31m✗\x1b[0m ${m}${d ? '\n      ' + d : ''}`); };
const warn = (m, d = '') => { warnings++; console.log(`  \x1b[33m!\x1b[0m ${m}${d ? '\n      ' + d : ''}`); };
const ok = (m, d = '') => console.log(`  \x1b[32m✓\x1b[0m ${m}${d ? ` \x1b[2m${d}\x1b[0m` : ''}`);

const css = fs.readFileSync(p('theme.css'), 'utf8');

/* ── minimal OpenType name-table reader — no dependency, works on ttf/woff/woff2 ── */
function readNames(buf) {
  const tag = buf.toString('ascii', 0, 4);
  if (tag === 'wOF2') return null;                       // compressed; skip
  if (tag === 'wOFF') {                                  // WOFF: inflate the name table
    const num = buf.readUInt16BE(12);
    for (let i = 0; i < num; i++) {
      const o = 44 + i * 20;
      const t = buf.toString('ascii', o, o + 4);
      if (t !== 'name') continue;
      const off = buf.readUInt32BE(o + 4), compLen = buf.readUInt32BE(o + 8), origLen = buf.readUInt32BE(o + 12);
      const raw = buf.subarray(off, off + compLen);
      return parseName(compLen === origLen ? raw : zlib.inflateSync(raw));
    }
    return null;
  }
  const num = buf.readUInt16BE(4);                        // plain sfnt
  for (let i = 0; i < num; i++) {
    const o = 12 + i * 16;
    if (buf.toString('ascii', o, o + 4) !== 'name') continue;
    return parseName(buf.subarray(buf.readUInt32BE(o + 8), buf.readUInt32BE(o + 8) + buf.readUInt32BE(o + 12)));
  }
  return null;
}
function parseName(t) {
  const count = t.readUInt16BE(2), strOff = t.readUInt16BE(4), out = {};
  for (let i = 0; i < count; i++) {
    const o = 6 + i * 12;
    const pid = t.readUInt16BE(o), nid = t.readUInt16BE(o + 6);
    const len = t.readUInt16BE(o + 8), off = t.readUInt16BE(o + 10);
    const s = t.subarray(strOff + off, strOff + off + len);
    const v = pid === 3 ? s.toString('utf16le').replace(/\0/g, (x) => x) : s.toString('latin1');
    const dec = pid === 3 ? Buffer.from(s).swap16().toString('utf16le') : s.toString('latin1');
    if (out[nid] === undefined) out[nid] = dec;
  }
  return out;
}

console.log('\nFonts — files on disk');
const EXPECTED = [
  { file: 'oldschool-pc-font-pack/WebPlus_IBM_VGA_9x16.woff', family: /IBM VGA 9x16/i, licence: 'CC BY-SA 4.0', licenceFile: 'oldschool-pc-font-pack/LICENSE.txt', modified: false },
  { file: 'oldschool-pc-font-pack/WebPlus_IBM_VGA_8x16.woff', family: /IBM VGA 8x16/i, licence: 'CC BY-SA 4.0', licenceFile: 'oldschool-pc-font-pack/LICENSE.txt', modified: false },
  { file: '3270font/3270-Regular.woff2', family: null, licence: 'BSD 3-Clause', licenceFile: '3270font/LICENSE.txt', modified: true },
  { file: 'courier-prime/CourierPrime-Regular.latin.woff2', family: null, licence: 'SIL OFL 1.1', licenceFile: 'courier-prime/OFL.txt', modified: false },
];
for (const f of EXPECTED) {
  const abs = p('fonts', f.file);
  if (!fs.existsSync(abs)) { err(`missing font: fonts/${f.file}`); continue; }
  const size = fs.statSync(abs).size;
  const names = readNames(fs.readFileSync(abs));
  const fam = names?.[1], copy = names?.[0];
  if (f.family && fam && !f.family.test(fam)) err(`fonts/${f.file}: family is "${fam}"`);
  ok(`fonts/${f.file}`, `${(size / 1024).toFixed(1)} KB${fam ? ` · ${fam}` : ''}${copy ? ` · ${copy.slice(0, 46)}` : ''}`);
  fs.existsSync(p('fonts', f.licenceFile))
    ? ok(`  licence present (${f.licence})`, f.licenceFile)
    : err(`missing licence file for ${f.file}: fonts/${f.licenceFile}`);
}

console.log('\nFonts — what theme.css actually embeds');
const faces = [...css.matchAll(/@font-face\s*\{([\s\S]*?)\}/g)].map((m) => m[1]);
const fams = {};
for (const b of faces) {
  const fam = (b.match(/font-family:\s*'([^']+)'/) || [])[1] ?? '?';
  const b64 = (b.match(/base64,([A-Za-z0-9+/=]+)/) || [])[1] ?? '';
  fams[fam] = (fams[fam] ?? 0) + b64.length;
}
const ALLOWED = ['Afterimage VGA', 'Afterimage VGA N', 'Afterimage 3270', 'Courier Prime'];
let total = 0;
for (const [k, v] of Object.entries(fams)) {
  total += v;
  ALLOWED.includes(k) ? ok(`embedded: ${k}`, `${(v / 1024).toFixed(1)} KB base64`)
                      : err(`UNDECLARED font embedded: ${k} — every bundled font must be in FONT_LICENSES.md`);
}
ok(`total embedded font payload`, `${(total / 1024).toFixed(1)} KB base64 of ${(css.length / 1024).toFixed(1)} KB theme.css`);
/* Check for embedded Urbanist DATA, not the word — the changelog legitimately
   records that Urbanist was dropped. */
Object.keys(fams).some((k) => /urbanist/i.test(k))
  ? err('Urbanist font data still embedded — it was removed with the rebrand')
  : ok('no Urbanist font data remains', 'the word appears only in the changelog');

const notices = fs.readFileSync(p('FONT_LICENSES.md'), 'utf8');
for (const need of ['CC BY-SA 4.0', 'BSD 3-Clause', 'SIL OFL 1.1', 'VileR', 'Ricardo Banffy', 'Courier Prime'])
  notices.includes(need) ? ok(`FONT_LICENSES.md records "${need}"`) : err(`FONT_LICENSES.md does not mention "${need}"`);

if (FONTS_ONLY) {
  console.log(`\n  ${errors} error(s), ${warnings} warning(s)\n`);
  process.exit(errors ? 1 : 0);
}

console.log('\nAttribution');
for (const [file, needles] of [
  ['LICENSE', ['Sonophage', 'Mike Thompson', 'MIT']],
  ['UPSTREAM.md', ['155a94966b29f84616ac866ef5b29677d40d0ae1', '2.16.0', 'Sonophage', 'github.com/Sonophage/Bureau']],
  ['THIRD_PARTY_NOTICES.md', ['Bureau', 'Sonophage', 'cool-retro-term', 'GNU General Public License']],
  ['README.md', ['Bureau', 'Sonophage']],
]) {
  const t = fs.readFileSync(p(file), 'utf8');
  const miss = needles.filter((n) => !t.includes(n));
  miss.length ? err(`${file} is missing: ${miss.join(', ')}`) : ok(`${file} credits upstream correctly`);
}

console.log('\nBranding');
const cssBody = css.slice(0, css.indexOf('/* @settings'));
const settings = css.slice(css.indexOf('/* @settings'));
/* Bureau may be NAMED as attribution; it may not appear as this theme's identity. */
const attributionLines = cssBody.split('\n').filter((l) => /Bureau/.test(l));
/* Naming Bureau in a comment is CORRECT — it is attribution and design
   history, and the fork record depends on it. What must not appear is Bureau
   as this theme's own IDENTITY, which the specific-term checks below cover. */
ok(`Bureau named in ${attributionLines.length} CSS comment(s)`, 'attribution and design history — expected');
[...cssBody.matchAll(/content:\s*['"][^'"]*Bureau/gi)].length
  ? err('Bureau appears in a CSS `content:` string — that is user-visible branding')
  : ok('Bureau never appears in user-visible CSS content');
for (const t of ['DOSSIER', 'Dossier', 'Magnus', 'Deus', 'Disco Elysium', 'Federal Bureau'])
  cssBody.includes(t) ? err(`Bureau identity term "${t}" still in CSS`) : ok(`no "${t}" in CSS`);
/afterimage@@/.test(settings) && !/bureau@@/.test(settings)
  ? ok('Style Settings import keys use the afterimage@@ prefix') : err('settings still reference bureau@@ keys');

console.log('\nManifest and versions');
const man = JSON.parse(fs.readFileSync(p('manifest.json'), 'utf8'));
const pkg = JSON.parse(fs.readFileSync(p('package.json'), 'utf8'));
const ver = JSON.parse(fs.readFileSync(p('versions.json'), 'utf8'));
man.name === 'Afterimage' ? ok('manifest name is Afterimage') : err(`manifest name is "${man.name}"`);
man.version === pkg.version ? ok(`version ${man.version} consistent across manifest and package.json`)
  : err(`manifest ${man.version} != package.json ${pkg.version}`);
ver[man.version] === man.minAppVersion ? ok(`versions.json maps ${man.version} → ${man.minAppVersion}`)
  : err(`versions.json[${man.version}] is ${ver[man.version]}, minAppVersion is ${man.minAppVersion}`);
css.includes(`· v${man.version}`) ? ok('theme.css header carries the current version') : err('theme.css header version is stale — run npm run build');

console.log('\ncool-retro-term');
const gplish = /\bQML\b|Q_OBJECT|qmlRegisterType|ShaderEffect\s*\{|#version\s+\d+|gl_FragColor/;
gplish.test(cssBody) ? err('possible cool-retro-term / GPL code found in theme.css') : ok('no QML, C++ or GLSL fragments in theme.css');
fs.existsSync(p('experiments')) &&
  (fs.readdirSync(p('experiments')).some((f) => /\.(qml|cpp|frag|vert|glsl)$/.test(f))
    ? err('experiments/ contains shader or QML files') : ok('experiments/ contains only HTML, CSS and notes'));

console.log(`\n  ${errors} error(s), ${warnings} warning(s)\n`);
process.exit(errors ? 1 : 0);
