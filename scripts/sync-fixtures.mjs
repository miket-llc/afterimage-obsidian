#!/usr/bin/env node
/** Copy the canonical fixtures at test/ into the disposable vault, so the two
 *  cannot drift. node scripts/sync-fixtures.mjs [--check] */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const MAP = {
  'theme-test-sheet.md':      '10 Projects/Afterimage/Theme Test Sheet.md',
  'long-form-note.md':        '30 Resources/Reference/Long-Form Note — Phosphor and Persistence.md',
  'properties-heavy-note.md': '10 Projects/Afterimage/Properties-Heavy Note.md',
  'component-matrix.md':      '10 Projects/Afterimage/Component Matrix.md',
};
const CHECK = process.argv.includes('--check');
let drift = 0;
for (const [src, dst] of Object.entries(MAP)) {
  const a = path.join(ROOT, 'test', src), b = path.join(ROOT, 'test/vault', dst);
  const A = fs.readFileSync(a, 'utf8');
  const B = fs.existsSync(b) ? fs.readFileSync(b, 'utf8') : null;
  if (A === B) { console.log(`  = ${src}`); continue; }
  drift++;
  if (CHECK) { console.log(`  \x1b[31m✗\x1b[0m ${src} differs from the vault copy`); continue; }
  fs.mkdirSync(path.dirname(b), { recursive: true });
  fs.writeFileSync(b, A);
  console.log(`  \x1b[32m→\x1b[0m ${src} → vault`);
}
if (CHECK && drift) process.exit(1);
