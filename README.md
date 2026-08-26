# Afterimage

A CRT-terminal theme for [Obsidian](https://obsidian.md). An advanced personal
workstation from a plausible alternate 1990s: an IBM terminal that kept
growing until it became a knowledge machine.

> [!IMPORTANT]
> **Afterimage is a modified derivative of [Bureau](https://github.com/Sonophage/Bureau) by [Sonophage](https://github.com/Sonophage)**, used under the MIT licence.
> Bureau supplied the application architecture this theme is built on — the whole-application coverage, the framed editor, the heading and properties systems, the settings engine, the effects framework, and the mobile, print and reduced-motion safeguards. A great deal of what makes Afterimage work is still Sonophage's engineering. Afterimage replaces Bureau's case-file identity and its typography; it did not invent the machinery underneath.
> See [`UPSTREAM.md`](UPSTREAM.md) for exactly what was kept and what was replaced.

> [!TIP]
> Most of Afterimage lives in the [Style Settings](https://github.com/mgmeyers/obsidian-style-settings) plugin. Install it and you get a single **Afterimage** panel with every option in one place. The theme runs fine without it, on its defaults.

---

## The idea

Most "CRT" themes lay a striped translucent film over finished text. The
stripes cross the letters and the background with equal indifference, and the
result reads as exactly what it is: a page sitting behind a screen door. The
type does not belong to the raster; it is merely behind it.

On a real tube, the raster is not an overlay — it is *how the image is
constructed*. The beam paints one line at a time, and the dark gap between
lines can only subtract light that phosphor actually emitted. Nothing else on
screen is affected, because nothing else is emitting.

Afterimage reproduces that relationship rather than its symptoms. The editor's
raster is a striped layer in `mix-blend-mode: multiply`, which scales each
channel in proportion to how bright it already is:

```
surface  #04090f × 0.66  →  #030609     Δ ≈  3/255    invisible
glyph    #cbe0f0 × 0.66  →  #86939e     Δ ≈ 66/255    obvious
```

So the stripes appear **only inside the glyphs**. The characters, their bloom,
their afterimage and the surface raster are one system — and because the text
element itself is never touched, the caret, selection, IME composition,
spellcheck and clipboard all behave exactly as they should.

Headings go further: the plate and its lettering carry **cooperating** rasters
on a shared grid, so the bands run unbroken across substrate and character and
the heading reads as one physical display object.

The full method comparison, including what was tried and rejected and why, is
in [`experiments/`](experiments/README.md).

## Typography

Three presets. Each changes the body face; the technical labels stay 3270
throughout so the system reads as one machine.

| Preset | Face | Character |
|---|---|---|
| **IBM DOS** *(default)* | WebPlus IBM VGA 9x16 / 8x16 | The real thing: a pixel font on a 16-pixel grid, the same family cool-retro-term uses for its IBM-DOS preset. |
| **3270** | 3270 | A smoother, more forgiving terminal voice. An outline font, so it scales freely. |
| **Typewriter** | Courier Prime | Bureau's own voice, kept deliberately. |

Two things about the IBM DOS preset are worth knowing:

**It snaps to 16 px.** The font has exactly 100 units per pixel row over a
16-pixel cell, so at `16px` one font pixel is one CSS pixel and every raster
band lands on a boundary. At 15 or 17 px the grid stops dividing, the renderer
resamples, and the crispness that justified a pixel font is thrown away. The
size slider therefore steps in multiples of 16 for this preset only.

**Bold is brightness, not weight.** These terminal fonts ship one weight and no
italic, and synthetic bold smears a pixel font. On a real terminal bold *was*
brighter, not fatter — so body text rests slightly below full brightness and
bold gets full-brightness ivory plus a touch of bloom. Italic falls back to a
synthetic oblique with a cooler tint.

## Display profiles

Six complete presets. Each tunes the palette, the raster, bloom, persistence
and chromatic offset together.

| Profile | |
|---|---|
| **Cobalt** *(default)* | Cold blue-black chassis, cool phosphor ivory, electric cobalt signal. |
| **Amber** | Warm amber phosphor on a neutral black chassis, with longer persistence. |
| **Ghost** | Green phosphor, deeper surface, a longer but still readable afterimage. |
| **Ultraviolet** | Muted violet-blue signal, ice-grey text, a subtle chromatic split. |
| **Mono** | Black, ivory and steel. Minimal chroma, full graphical structure. |
| **Custom** | Your own settings, honoured individually. |

Switching profiles does not destroy your Custom selections — Custom restores
them.

## Installation

### Local install (recommended)

```bash
npm run install:vault -- "/path/to/Your Vault"
```

The vault path is required and is never guessed. The script validates the
vault, refuses to overwrite a theme it did not install, touches no note, and
prints exactly what it changed. Add `--activate` to also select the theme, or
`--link` to symlink the repo so edits appear live.

### Manual

Copy `theme.css` and `manifest.json` into
`<vault>/.obsidian/themes/Afterimage/`, then pick **Afterimage** in
**Settings → Appearance → Themes**.

Everything the theme needs — all three typefaces and the new-tab artwork — is
embedded in `theme.css`. Nothing is fetched at runtime, so the theme works
offline and never blocks first paint. (It has to be embedded: Obsidian injects
`theme.css` as an inline `<style>`, so relative `url()` paths cannot resolve to
files in the theme folder.)

## Style Settings

The panel is organised so the things you actually change sit near the top:

- **Profile & typography** — display profile, body preset, size, line height, reading width, heading scale.
- **Glyph rendering** — raster strength and spacing, separately for display text, Reading View and Live Preview; bloom; afterimage strength and offset; chromatic misregistration; text contrast.
- **Surface** — editor scanlines, grain, vignette, chassis and plate texture, perimeter marks.
- **Colour** — per-appearance palettes, independent sidebar/editor polarity, black and white levels, base-hue tint, accent.
- **Layout** — cards, pane gap and rounding, note framing, rails, rulers, density.
- **Motion** — master switch, speed, easing, and each effect individually.
- **Hide / Focus**, **Scrollbars**, **Resize handles**, **File explorer**, **Daily notes**, **Mobile**.

Every control is wired to real CSS. There are no inert settings.

## Mobile

On a phone the heavy raster, bloom, ghosting and full-screen compositing layers
are **off by default** — they are frame-rate expensive and the reason is
performance, not looks. Touch targets, file-tree row padding and caret
clearance above the keyboard are all adjustable. A single *Atmosphere on
mobile* toggle opts back in to the full effect stack.

## Accessibility

- `prefers-reduced-motion` is honoured by default, and there is an explicit toggle.
- No motion during ordinary typing; no default scanning beam; no ordinary interaction longer than 250 ms.
- Text contrast, raster strength and bloom are all independently adjustable, and every optical effect can be taken to zero while keeping the layout and typography.
- The raster method leaves the text element untouched, so screen readers, spellcheck, IME and search-match highlighting are unaffected.
- Focus rings are `:focus-visible`, so they appear for keyboard and assistive-technology navigation without firing on every mouse click.

## Print and PDF export

Print defaults to ink on white paper: no scanlines, no bloom, no ghosting, no
chromatic offset, no grain, no dark background. Heading hierarchy and
properties stay legible, page breaks are sensible, and link targets can
optionally be printed after the link text. If you deliberately want a
CRT-styled dark export, there is a setting for it — it is not the default.

## Development

```bash
npm install
npm run build       # embed fonts + artwork, sync versions, write theme.css
npm run lint        # CSS + Style Settings YAML validation
npm run audit       # licences, branding, assets, settings wiring
npm run check       # all three
npm run preview     # serve the repo at :8817
npm run shots       # deterministic DOM-harness screenshots
```

`theme.css` is the shipped artifact and is generated: fonts and artwork are
embedded into it from `fonts/` and `assets/` by `npm run build`. Edit the CSS
directly, but let the build own the regions between its `BUILD:` markers.

Release: `python3 release.py <version>`.

`npm test` runs 18 editing-behaviour checks in real Chromium against the DOM
harness. [`docs/TESTING.md`](docs/TESTING.md) records exactly what has been
verified in Obsidian itself, what was only verified in the harness, and what
has not been tested at all.

Repository: <https://github.com/miket-llc/afterimage-obsidian>

## Licensing

Afterimage is **MIT**, as Bureau is. See [`LICENSE`](LICENSE) — Sonophage's
copyright is preserved and Afterimage's is added alongside it, not in place
of it.

| | |
|---|---|
| [`UPSTREAM.md`](UPSTREAM.md) | The fork record: pinned commit, what was kept, what was replaced. |
| [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) | Bureau, the fonts, and Afterimage's relationship to cool-retro-term. |
| [`FONT_LICENSES.md`](FONT_LICENSES.md) | Every bundled font: source, version, licence, and whether it was modified. |

Bundled fonts: **WebPlus IBM VGA** (© VileR, CC BY-SA 4.0, shipped unmodified),
**3270** (© Ricardo Banffy and the 3270font Authors, BSD-3-Clause), and
**Courier Prime** (© The Courier Prime Project Authors, SIL OFL 1.1).

[cool-retro-term](https://github.com/Swordfish90/cool-retro-term) was used as a
**visual reference only** — to read the factual definition of its IBM-DOS
preset rather than guess it from the name. None of its GPL-licensed QML, C++ or
shader code is present here, and CSS could not express a fragment shader in any
case.

Afterimage is a personal theme. It is not affiliated with or endorsed by
Sonophage, VileR, Ricardo Banffy, Filippo Scognamiglio or Dynalist Inc.
