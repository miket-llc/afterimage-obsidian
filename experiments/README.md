# Glyph-raster spike

Open [`glyph-raster.html`](glyph-raster.html) over HTTP (the fonts are
relative to `../fonts/`, so `file://` will not load them):

```bash
npm run preview
```

then <http://localhost:8817/experiments/glyph-raster.html>.

---

## The question

Not *"can we draw scanlines"* — that is trivial and wrong. The question is
whether **the glyphs themselves can participate in the raster**: whether the
character, its glow, its afterimage and the surface raster can read as one
coherent display object, while staying sharp on a Retina panel and never
interfering with editing.

## Methods compared

| | Method | Verdict |
|---|---|---|
| A | No treatment (control) | baseline |
| B | Page-wide scanline overlay, normal blend | **rejected** |
| C | Striped overlay in `mix-blend-mode: multiply` | **ships — editor** |
| D | `background-clip: text` + `color: transparent` | **ships — display text only** |
| E | `text-shadow` bloom + 1px afterimage | ships (layered on C/D) |
| F | Sub-pixel RGB misregistration | ships, default 0 |
| G | Plate raster + glyph raster on a shared grid | **ships — headings** |
| H | `mix-blend-mode: screen` for light surfaces | ships (light mode) |
| I | Integer DPI alignment | constraint, not a method |
| L | Emphasis by brightness, not weight | ships |

---

## Why B fails

A striped translucent film in normal blend crosses glyph and background with
equal indifference, so the type reads as sitting *behind a screen door*. It
also costs contrast everywhere for no perceptual gain. This is the failure
mode the brief warns about, and it is what most "CRT" themes actually ship.

## Why C is the answer for the editor

`mix-blend-mode: multiply` scales each channel, so the darkening is
**proportional to how bright the pixel already is**:

```
surface  #04090f × 0.66  →  #030609      Δ ≈  3/255   invisible
glyph    #cbe0f0 × 0.66  →  #86939e      Δ ≈ 66/255   obvious
```

The stripes therefore appear **only where light is being emitted** — inside
the glyphs. This is not a trick; it is the correct physical model. The dark
gap between scan lines cannot remove light that was never emitted, and only
lit phosphor emits. Multiply *is* that operation.

Verified at 4× against the real fonts: the bands cut visibly through the
letterforms while the card background stays clean.

Crucially, the text element is never touched — no `color: transparent`, no
clip, no filter. So caret, selection, IME composition, spellcheck underlines,
search-match highlighting and clipboard fidelity are all unaffected, and it
applies to **every** descendant automatically, including inline elements
Obsidian has not invented yet.

## Why D is confined to display text

Three things were assumed about `background-clip: text` and **two of them
turned out to be false when tested**:

| Assumption | Reality |
|---|---|
| Selection becomes unreadable | **False.** `::selection { color }` *does* override the transparent fill in Chromium — selected text renders solid and crisp. It loses its raster while selected, which is cosmetic. |
| The caret disappears | **False.** `caret-color` is independent of `color`; the caret renders normally in a `contenteditable` whose text is transparent. |
| Inline children break the effect | **True, and it is the disqualifier.** |

The third is decisive and is shown directly in `align-test` (D1 in the
capture below): a paragraph with `background-clip: text` containing a link
renders **the link solid**, with no raster, because the child has its own
`color`. Making it work requires clipping *every* inline element
individually — links, bold, italic, code, tags, highlights, math, footnote
refs — and any Obsidian update that introduces a new inline span silently
renders it solid. That is unmaintainable in the editor.

`background-attachment: fixed` (D3) does solve the *alignment* problem
elegantly — every clipped element then shares one viewport-anchored grid — but
it does not solve the enumeration problem, which is the fatal one.

For **display text** the enumeration problem disappears: the inline title,
H1–H6, property keys, tab labels and rail labels are a small, closed set that
the theme fully controls. There D's higher fidelity is worth having.

## Why G makes the heading work

The brief's hardest requirement is that the heading plate and its lettering
read as **one physical object**, with raster through both. That needs two
cooperating layers on a shared grid, because the substrate and the ink sit on
opposite sides of the brightness midpoint:

- the **plate** is light, so a *darkening* stripe shows on it;
- the **ink** is dark, so its clipped raster must *lighten* to be visible.

Both use the same period and both anchor to the plate's top edge, so the
bands run continuously across substrate and letterform. Verified at 3×: the
raster crosses the plate and the characters without a seam, and survives a
heading that wraps to a second line.

## The integer-alignment constraint

`WebPlus IBM VGA 8x16` and `9x16` have `unitsPerEm = 1600` over a 16-pixel
cell — exactly **100 font units per pixel row**. At `font-size: 16px` one font
pixel is one CSS pixel, and two device pixels at 2×. Every raster band then
lands on a pixel-row boundary.

At 15 px or 17 px the grid no longer divides evenly, the renderer resamples,
stems go grey, and the crispness that justified choosing a pixel font is
thrown away. **The IBM DOS preset therefore snaps to 16 px and its
multiples** (32 px, 48 px for display sizes). The 3270 and Typewriter presets
are outline fonts and scale freely.

## Emphasis without a bold face

IBM VGA and 3270 ship **one weight and no italic**. Synthetic bold smears a
pixel font badly.

The fix is period-correct: on a real terminal, bold was *brighter*, not
fatter. Afterimage rests body text slightly below full brightness so bold has
somewhere to go, and reserves full-brightness ivory plus a touch of bloom for
it. Italic falls back to synthetic oblique with a cooler tint. Bureau already
treated bold and bold-italic as graphical stamps, so this inherits cleanly.

## What ships where

| Surface | Method | Reason |
|---|---|---|
| Inline title, H1–H6, property keys, tabs, rail and status labels | **D + G** (clipped glyph raster, plate raster) | closed set, fully theme-controlled, highest fidelity |
| Reading View prose | **C**, at full strength | universal and safe; D would break every link |
| Live Preview / source mode | **C**, at reduced strength | editing reliability wins; the surface is shared with the caret |
| Light surfaces | **H** (`screen`), ~half strength | paper does not glow |
| Mobile | C only, reduced; D retained for headings | compositing cost |
| Print | none | ink on paper |

Reading View and Live Preview are therefore **related but not identical** —
the same method at different strengths — which is what the brief asks for.

## Rejected outright

- **Page-wide overlay in normal blend** (B) — the screen-door failure.
- **`filter:` on text** — forces a compositing layer per element, blurs
  punctuation, and tanks scroll performance in a long note.
- **SVG `feTurbulence` / displacement filters on live text** — beautiful in
  isolation, unusable at editor scroll rates, and it breaks hit-testing.
- **Repeating `text-shadow` stacks to fake scanlines** — cost grows with the
  number of bands and the result is a blur, not a raster.
- **Bloom above ~6 px** — commas and full stops stop being distinguishable.
  The slider is capped below the failure point.
- **RGB split ≥ 1 px** — reads as a printing fault, not a tube. Default 0.
