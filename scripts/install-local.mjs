#!/usr/bin/env node
/**
 * Afterimage — local install.
 *
 *   npm run install:vault -- "/path/to/Test Vault"
 *   npm run install:vault -- "/path/to/Test Vault" --link
 *   npm run install:vault -- "/path/to/Test Vault" --force
 *
 * Copies (or symlinks) ONLY this theme's own folder into the vault's
 * .obsidian/themes/. It never reads, writes or deletes a note, and it never
 * silently overwrites a theme it did not install.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';

const ROOT = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a) => !a.startsWith('--'));

const LINK = flags.has('--link');
const FORCE = flags.has('--force');
const YES = flags.has('--yes');
const ACTIVATE = flags.has('--activate');

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  b: (s) => `\x1b[1m${s}\x1b[0m`,
  g: (s) => `\x1b[32m${s}\x1b[0m`,
  y: (s) => `\x1b[33m${s}\x1b[0m`,
  r: (s) => `\x1b[31m${s}\x1b[0m`,
  c: (s) => `\x1b[36m${s}\x1b[0m`,
};

/** Files that make up the installable theme. Nothing else is copied. */
const THEME_FILES = ['theme.css', 'manifest.json'];
const OPTIONAL_FILES = ['LICENSE', 'THIRD_PARTY_NOTICES.md', 'FONT_LICENSES.md'];

function die(msg, hint) {
  console.error(`\n${c.r('✗')} ${msg}`);
  if (hint) console.error(`  ${c.dim(hint)}`);
  process.exit(1);
}

async function confirm(question) {
  if (YES) {
    console.log(`${c.y('?')} ${question} ${c.dim('→ --yes')}`);
    return true;
  }
  if (!process.stdin.isTTY) {
    die(
      `Needs confirmation: ${question}`,
      'Re-run in an interactive terminal, or pass --yes to accept.'
    );
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const a = (await rl.question(`${c.y('?')} ${question} [y/N] `)).trim().toLowerCase();
  rl.close();
  return a === 'y' || a === 'yes';
}

function manualInstructions(themeName) {
  return `
${c.b('Manual installation')}

  1. In your vault, open (or create) the folder:
       ${c.c('<vault>/.obsidian/themes/' + themeName + '/')}
  2. Copy these files into it from this repository:
       ${THEME_FILES.join('\n       ')}
  3. In Obsidian: ${c.b('Settings → Appearance → Themes')} and pick
     ${c.b(themeName)}. If it does not appear, use the
     ${c.b('Reload themes')} / restart-Obsidian option in that panel.
  4. For the full control surface, install the ${c.b('Style Settings')}
     community plugin, then open its pane and expand ${c.b(themeName)}.
`;
}

function readManifest() {
  const p = path.join(ROOT, 'manifest.json');
  if (!fs.existsSync(p)) die('manifest.json not found', `looked in ${ROOT}`);
  const m = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!m.name) die('manifest.json has no "name"');
  return m;
}

function dirSize(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true, recursive: true })) {
    const fp = path.join(e.parentPath ?? e.path, e.name);
    if (e.isFile()) n += fs.statSync(fp).size;
  }
  return n;
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

async function main() {
  const manifest = readManifest();
  const THEME = manifest.name;

  if (positional.length === 0) {
    console.log(`
${c.b(THEME)} — local install

${c.b('Usage')}
  npm run install:vault -- ${c.c('"/path/to/Test Vault"')}

${c.b('Options')}
  --link       symlink the theme folder instead of copying
               (edits to this repo appear in the vault immediately)
  --force      replace an existing theme folder that this script
               did not install
  --activate   also set cssTheme in .obsidian/appearance.json
  --yes        assume yes for every prompt (non-interactive use)

The vault path is required and is never guessed.
${manualInstructions(THEME)}`);
    process.exit(positional.length === 0 && args.length === 0 ? 0 : 1);
  }

  const vault = path.resolve(positional[0]);
  const changes = [];

  // ── validate the vault ────────────────────────────────────────────────
  if (!fs.existsSync(vault)) die(`Vault does not exist: ${vault}`);
  if (!fs.statSync(vault).isDirectory()) die(`Not a directory: ${vault}`);

  const dotObsidian = path.join(vault, '.obsidian');
  if (!fs.existsSync(dotObsidian)) {
    console.log(`${c.y('!')} ${c.b(vault)}`);
    console.log(`  has no ${c.c('.obsidian')} folder, so it may not be an Obsidian vault.`);
    const ok = await confirm(`Create ${c.c('.obsidian')} there?`);
    if (!ok) die('Aborted. Nothing was changed.');
    fs.mkdirSync(dotObsidian, { recursive: true });
    changes.push(`created  ${dotObsidian}`);
  }

  const themesDir = path.join(dotObsidian, 'themes');
  if (!fs.existsSync(themesDir)) {
    fs.mkdirSync(themesDir, { recursive: true });
    changes.push(`created  ${themesDir}`);
  }

  const dest = path.join(themesDir, THEME);

  // ── never clobber someone else's theme ────────────────────────────────
  if (fs.existsSync(dest) || fs.lstatSync(dest, { throwIfNoEntry: false })) {
    const lst = fs.lstatSync(dest);
    const stampPath = path.join(dest, '.afterimage-installed-by');
    const ours = lst.isSymbolicLink() || fs.existsSync(stampPath);
    if (!ours && !FORCE) {
      console.log(`${c.y('!')} ${c.c(dest)} already exists and was not installed by this script.`);
      const ok = await confirm('Replace it?');
      if (!ok) {
        die('Aborted. Nothing was changed.', 'Pass --force to skip this prompt.');
      }
    }
    fs.rmSync(dest, { recursive: true, force: true });
    changes.push(`removed  ${dest}${ours ? '' : c.y('  (pre-existing, replaced on confirmation)')}`);
  }

  // ── install ───────────────────────────────────────────────────────────
  for (const f of THEME_FILES) {
    if (!fs.existsSync(path.join(ROOT, f))) {
      die(`Missing ${f} — run \`npm run build\` first.`);
    }
  }

  if (LINK) {
    fs.symlinkSync(ROOT, dest, 'dir');
    changes.push(`linked   ${dest} ${c.dim('→')} ${ROOT}`);
  } else {
    fs.mkdirSync(dest, { recursive: true });
    let bytes = 0;
    for (const f of [...THEME_FILES, ...OPTIONAL_FILES]) {
      const src = path.join(ROOT, f);
      if (!fs.existsSync(src)) continue;
      fs.copyFileSync(src, path.join(dest, f));
      const size = fs.statSync(src).size;
      bytes += size;
      changes.push(`copied   ${path.join(dest, f)} ${c.dim(`(${kb(size)})`)}`);
    }
    fs.writeFileSync(
      path.join(dest, '.afterimage-installed-by'),
      `${THEME} local install\nsource: ${ROOT}\n`
    );
    changes.push(`wrote    ${path.join(dest, '.afterimage-installed-by')} ${c.dim('(ownership marker)')}`);
    console.log(c.dim(`\n  total ${kb(bytes)}`));
  }

  // ── optionally activate ───────────────────────────────────────────────
  const appearancePath = path.join(dotObsidian, 'appearance.json');
  if (ACTIVATE) {
    let appearance = {};
    if (fs.existsSync(appearancePath)) {
      try {
        appearance = JSON.parse(fs.readFileSync(appearancePath, 'utf8'));
      } catch {
        die(`Could not parse ${appearancePath}`, 'Left untouched.');
      }
    }
    const prev = appearance.cssTheme ?? '(none)';
    appearance.cssTheme = THEME;
    fs.writeFileSync(appearancePath, JSON.stringify(appearance, null, 2) + '\n');
    changes.push(`updated  ${appearancePath} ${c.dim(`cssTheme: ${prev} → ${THEME}`)}`);
  }

  // ── report exactly what changed ───────────────────────────────────────
  console.log(`\n${c.g('✓')} ${c.b(THEME)} v${manifest.version} installed into`);
  console.log(`  ${c.c(vault)}\n`);
  console.log(c.b('Changed:'));
  for (const ch of changes) console.log(`  ${ch}`);
  console.log(`\n${c.dim('No note, attachment or other vault content was read or modified.')}`);

  if (!ACTIVATE) {
    console.log(
      `\n${c.b('Next:')} Obsidian → ${c.b('Settings → Appearance → Themes')} → ${c.b(THEME)}` +
        `\n${c.dim('      (or re-run with --activate to set it in appearance.json)')}`
    );
  } else {
    console.log(`\n${c.b('Next:')} restart Obsidian, or use ${c.b('Reload themes')} in Appearance settings.`);
  }
  console.log(manualInstructions(THEME));
}

main().catch((e) => die(e.message, e.stack));
