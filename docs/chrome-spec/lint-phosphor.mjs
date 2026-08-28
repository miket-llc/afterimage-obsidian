/* lint-phosphor.mjs — makes laws 2 and 3 mechanical.
 *
 * Two checks the prose cannot enforce on its own:
 *   1. no chrome colour outside the phosphor hue (the accent-bar guard)
 *   2. one typeface across chrome (the hierarchy-by-font guard)
 *
 * Wire into scripts/lint.mjs:
 *   import { checkPhosphor } from './lint-phosphor.mjs';
 *   errors.push(...checkPhosphor(css));
 */

const HUE_TOLERANCE = 12;      // degrees either side of the phosphor
const NEUTRAL_SAT   = 0.10;    // below this, treat as a neutral (chassis metal)

/* Selectors that are the CASE, not the screen. Real materials, real hues. */
const CHASSIS = [
  'workspace-ribbon', 'side-dock', 'titlebar', 'chassis', 'ribbon',
  'status-bar-item', 'sidedock-vault-profile',
];

/* ── Scope refinements added while wiring (documented deviations) ──────────
   The law is about the CHROME of the machine as currently fitted. Three
   things in theme.css are legitimately outside it:

   1  OTHER TUBES. Each `after-profile-*` block is a different coating; its
      colours must agree with ITS OWN --after-phosphor, not the default one.
      Blocks are therefore checked against the phosphor they declare.
   2  PAPER. Light mode and the mixed d-chrome/l-chrome overrides render the
      machine's *paper* idiom; a paper palette is not a coating.
      DESIGN-MODEL.md is silent on light mode — revisit when it is not.
   3  CONTENT SEMANTICS. The error red, attention amber, tag teal, the
      daily-note weekday accents and opt-in content looks are things the
      machine is SHOWING, not the machine. They are named-token declarations,
      never chrome rules, so they are exempted by token name.               */
const PAPER = ['theme-light', 'after-d-', 'after-l-'];
const CONTENT_SELECTORS = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
  'after-tree-stamp', 'markdown', 'cm-', 'callout', 'banner-', 'graph',
];
const SEMANTIC_TOKENS = /--after-(red|accent-green|gold|amber|p1|cobalt|accent-custom|teal|amber-ink|accent|on-accent)[\w-]*\s*:/;
/* Chassis MATERIAL declared as tokens rather than under a chassis selector:
   the countersink wall, the cut edge, the moulded shell. Metal, not coating. */
const CHASSIS_TOKENS = /--after-(chassis|wall|cut-edge|bezel|shell|recess)[\w-]*\s*:/;

function hexToHsl(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let hh;
  if (max === r) hh = ((g - b) / d + (g < b ? 6 : 0));
  else if (max === g) hh = (b - r) / d + 2;
  else hh = (r - g) / d + 4;
  return { h: hh * 60, s, l };
}

function angularDelta(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export function checkPhosphor(css) {
  const errors = [];

  /* The phosphor is whatever --after-phosphor is declared as. */
  const decl = css.match(/--after-phosphor:\s*(#[0-9a-f]{3,8})/i);
  if (!decl) {
    return ['[phosphor] --after-phosphor is not declared; laws 2 and 3 cannot be checked'];
  }
  const phosphor = hexToHsl(decl[1]);

  /* Every tube's own coating, so a profile block is judged by its own light. */
  const tubes = {};
  for (const m of css.matchAll(/after-profile-(\w+)[^{]*\{[^}]*--after-phosphor:\s*(#[0-9a-f]{6})/gi)) {
    tubes[m[1]] = hexToHsl(m[2]);
  }

  /* The @settings YAML is configuration metadata — option swatches and
     documentation, not painted chrome. */
  const settingsAt = css.indexOf('/* @settings');
  const lines = (settingsAt === -1 ? css : css.slice(0, settingsAt)).split('\n');
  let selector = '';
  let openDecl = '';   // a multi-line declaration keeps its exemption to the ;

  lines.forEach((line, i) => {
    /* a '{' inside a comment must not become the governing selector */
    if (line.includes('{') && !/^\s*\/?\*/.test(line)) selector = line.split('{')[0].trim();
    const declStart = line.match(/(--[\w-]+)\s*:/);
    if (declStart) openDecl = declStart[1] + ':';
    const exemptDecl = SEMANTIC_TOKENS.test(openDecl) || CHASSIS_TOKENS.test(openDecl);
    if (line.includes(';')) openDecl = '';
    if (CHASSIS.some(c => selector.includes(c))) return;
    if (PAPER.some(c => selector.includes(c))) return;
    if (CONTENT_SELECTORS.some(c => selector.toLowerCase().includes(c))) return;
    if (/^\s*\/\*/.test(line)) return;
    if (exemptDecl) return;

    let governing = phosphor;
    const prof = selector.match(/after-profile-(\w+)/);
    if (prof) {
      if (!tubes[prof[1]]) return;   // custom declares no coating on purpose
      governing = tubes[prof[1]];
    }

    for (const m of line.matchAll(/#[0-9a-f]{6}\b/gi)) {
      const c = hexToHsl(m[0]);
      if (!c || c.s < NEUTRAL_SAT) continue;              // neutrals are fine
      if (c.l < 0.08) continue;   // below visible emission, hue is noise
      if (angularDelta(c.h, governing.h) > HUE_TOLERANCE) {
        errors.push(
          `[phosphor] ${m[0]} at line ${i + 1} is ${Math.round(angularDelta(c.h, governing.h))}° ` +
          `off the phosphor hue — a coating cannot change colour. (${selector.slice(0, 60)})`
        );
      }
    }
  });

  /* One character generator. */
  const chromeFonts = new Set();
  for (const m of css.matchAll(/--after-font-(ui|label|chrome|tab|tree)[\w-]*:\s*([^;\n]+);/g)) {
    chromeFonts.add(m[2].trim());
  }
  if (chromeFonts.size > 1) {
    errors.push(
      `[phosphor] ${chromeFonts.size} chrome typefaces declared; a terminal has one ` +
      `character generator: ${[...chromeFonts].join(' | ')}`
    );
  }

  return errors;
}
