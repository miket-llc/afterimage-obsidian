# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## What this is

**Afterimage** — a CRT-terminal theme for Obsidian, built by evolving
**[Bureau](https://github.com/Sonophage/Bureau) v2.16.0 by Sonophage** (MIT).
It is an explicit, attributed derivative, not a clean-room rewrite. Read
[`UPSTREAM.md`](UPSTREAM.md) before making architectural changes — a lot of
what looks like odd CSS is Sonophage's hard-won solution to a real Obsidian
quirk, and the comments usually say which.

## The one idea

Most "CRT" themes lay a striped film over finished text; the type ends up
sitting *behind a screen door*. Afterimage makes the **glyphs participate in
the raster**. If a change breaks that, it is the wrong change.

Two mechanisms, and the boundary between them matters:

| Surface | Mechanism | Why |
|---|---|---|
| Live text (Reading View, Live Preview, sidebars) | `mix-blend-mode: multiply` overlay | Proportional, so it only darkens what is already bright — the glyphs. Never touches the text element, so caret / selection / IME / clipboard are safe, and every descendant is covered without enumerating inline elements. |
| Display text (inline title, H1–H3, property keys) | per-layer `background-clip: text, padding-box` | Two background layers on one element share a grid, so plate and lettering fuse. Confined to display text because an inline child renders **solid** unless it too is clipped. |

`experiments/README.md` records what was tried and rejected, including two
assumptions that testing disproved.

## Non-negotiables

- **Never break editing.** The `AFTERIMAGE — EDITING SAFETY` section is
  declared last on purpose. `npm run test` enforces it.
- **`.cm-content` must stay `position: static`.** CodeMirror's caret and
  selection are absolutely positioned layers; making `.cm-content` positioned
  re-parents their containing block. The editor raster hangs off `.cm-editor`.
- **Reset `background-clip` whenever you reset `background-image`.** With one
  background layer, a two-value clip list truncates to the *first* value, so
  `background-color` gets clipped to the text and the plate vanishes — while
  `getComputedStyle` still reports the plate colour.
- **Percent-encode `#` in SVG data URIs.** A literal `#` is a fragment
  delimiter and truncates the payload. `npm run lint` checks this.
- **A bare colour cannot carry a `padding-box` keyword** in the `background`
  shorthand — the whole declaration is dropped, silently. Wrap it:
  `linear-gradient(var(--after-tube), var(--after-tube)) padding-box`.
- **The tube must be a stacking context.** `position: relative` plus
  `isolation: isolate` on `.workspace` (the ONE glass), or the scan layer's
  `multiply` blends against the case and the aperture goes black. `npm run
  test` enforces this, and that the scan sits *over* the content — under the
  glyphs it has nothing bright to subtract from and the effect vanishes.
- **The phosphor laws are mechanical.** `docs/chrome-spec/DESIGN-MODEL.md`
  governs the chrome; `lint-phosphor.mjs` (wired into `npm run lint`) and the
  rendered checks in `npm test` enforce it. Every lit chrome value derives
  from `--after-phosphor` — a literal hex passes the hue lint and fails the
  tube-switch test.
- **`text-shadow` does not accumulate across rules.** Bloom, afterimage,
  chromatic split and the accent glow live in one stack; adding a second rule
  on a descendant silently replaces all of it.
- **Accent restraint.** Cobalt means selection, focus, current state,
  significant interaction. Not "a field exists".
- **No inert controls.** Every Style Settings entry must map to real CSS.
  `npm run lint` fails otherwise.
- **Attribution stays.** `LICENSE`, `UPSTREAM.md`, `THIRD_PARTY_NOTICES.md`,
  `FONT_LICENSES.md`. `npm run audit` checks them.

## Layout

```
theme.css              the shipped artifact — hand-authored EXCEPT between BUILD: markers
manifest.json          name, version, minAppVersion
versions.json          version → minAppVersion map
fonts/                 real font binaries + their licence text (auditable)
assets/new-tab.svg     original raster test pattern, embedded at build time
experiments/           the glyph-raster spike and its findings
docs/chrome-spec/      DESIGN-MODEL.md (governing), CHROME-REFERENCE.html, the lint, and the superseded first spec
test/                  canonical fixtures + the DOM harnesses + a disposable vault
scripts/               build, lint, audit, test, screenshot, probe, install
docs/TESTING.md        what was and was NOT tested
```

`theme.css` is generated only in the `BUILD:FONTS` and `BUILD:ARTWORK`
regions. Edit the rest by hand; let the build own those two.

Everything must be embedded as a `data:` URI — **Obsidian injects `theme.css`
as an inline `<style>`, so a relative `url()` cannot resolve to a file in the
theme folder.**

## Commands

```bash
npm run check          # build + lint + audit + fixture drift
npm test               # 37 editing + phosphor-law checks in real Chromium
npm run preview        # serve on :8817 for the harnesses
npm run shots          # deterministic screenshots
npm run install:vault -- "/path/to/vault" [--activate|--link]
```

The install script never touches a note and never overwrites a theme it did
not install.

## Working style that paid off here

- **Verify, do not assert.** Two firm assumptions about `background-clip`
  turned out to be wrong, and the real disqualifier was a third thing
  entirely. Render it and look.
- **Watch for computed-style/render disagreement.** More than one bug here
  had a correct `getComputedStyle` and a wrong picture. Force a garish colour
  to find out whether a property is being painted at all.
- **Snapshot before a refactor.** `scripts/snapshot-styles.mjs` proved the
  namespace migration changed nothing across 249 element snapshots.
