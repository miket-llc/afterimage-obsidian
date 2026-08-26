---
title: Afterimage — Theme Test Sheet
status: ACTIVE
clearance: 4
verified: true
opened: 2026-06-03
reviewed: 2026-06-03T09:00:00
operators:
  - Operator A
  - Operator B
link: "[[Example Note]]"
url: https://github.com/Sonophage/Afterimage
tags:
  - afterimage
  - calibration
  - qa
---

> [!quote] Afterimage — Display Calibration
> Every surface the theme touches, on one page. Flip through it in **dark**, **light**, and **inverted-editor**, in both **reading** and **live-preview**, then run the matrix at the foot of the file. The frontmatter above doubles as the **Properties** test: text (`title`/`status`), number (`clearance`), boolean (`verified`), date (`opened`), datetime (`reviewed`), list (`operators`), internal-link (`link`), URL (`url`), and tags.

> [!warning] Two surfaces need a target from *your* vault
> This sheet ships standalone, so a few blocks reference placeholder names that won't resolve in a fresh vault. To test them fully:
> 1. **Resolved links / transclusion** (§2, §5, §10) — create a note called `Example Note` (or swap the link text for any note you already have). Until then those links render in the *unresolved* (blurred) state, which is itself a valid test.
> 2. **Bases** (§8) — replace the embed with any `.base` file in your vault.
> 3. **Local image** (§10) — drop any image into the vault and point the embed at it.
>
> Everything else works as-is.

---

## 1 · Typography

Body text — set in whichever typography preset is active (IBM DOS 9x16 by default). It should sit at a comfortable measure and line height (both adjustable in **Style Settings → Cards & layout**). A run of plain prose to check line-height, measure, and the phosphor text-glow at default strength. Secondary detail in a smaller voice leans on the faint/muted tokens — make sure it stays legible.

Here is **bold text** (brighter, not fatter — bold is brightness in a single-weight terminal font), *italic text* (a cooler cast), ***bold italic*** (brightest, with an accent trace beneath), ~~struck-through text~~ (struck, dimmed, and still readable — nothing is hidden), ==highlighted text==, and `inline code` (a small inset chip). This sentence should survive a soft  
line break (two trailing spaces) without becoming a new paragraph.

HTML inline atoms the theme styles directly: a <kbd>Ctrl</kbd> + <kbd>K</kbd> key-cap, an H<sub>2</sub>O subscript, an E=mc<sup>2</sup> superscript, and an <del>HTML strike</del>.

### Heading 3 — chip should read "H3"
#### Heading 4 — chip should read "H4"
##### Heading 5 — chip should read "H5"
###### Heading 6 — chip should read "H6"

Six levels, six silhouettes: plate, keyed band, terminal block, rule, side-key, micro-heading. The raster runs through plate **and** glyphs on the plated levels. An external link riding inside a heading ↓

### See also: [the font pack](https://int10h.org/oldschool-pc-fonts/)

---

## 2 · Links — connected vs. severed

- **Resolved internal link** (phosphor trace — needs `Example Note` to exist; see note up top): [[Example Note]]
- **Unresolved internal link** (note does *not* exist) — should render as an **afterimage** — dim, with its own decay tail and a dashed trace — resolving on hover: [[Nonexistent Note 7-A]]
- **Internal link with alias**: [[Example Note|an aliased reference]]
- **Heading link** (jump within file): [[#1 · Typography|↑ back to Typography]]
- **External link** (dotted trace + a steel ↗): [the Afterimage repo](https://github.com/miket-llc/afterimage-obsidian)
- **Bare URL** (also gets the www tag): https://obsidian.md
- **Markdown anchor**: [an in-page anchor](#9--math)

Internal link riding inside a heading (should **invert** to label-fg fill, distinct from a body chip) ↓

### Cross-reference: [[Example Note|an aliased reference]]

---

## 3 · Lists & tasks

- First bullet
- Second bullet
    - Nested bullet (check the indentation guide + accent marker)
        - Deeper still
- Third bullet

1. Ordered item one
2. Ordered item two
   1. Nested ordered
3. Ordered item three

- [ ] Unchecked task (empty printed box)
- [x] Completed task (eased tick — white-on-dark / black-on-paper, accent check)
- [ ] Another open task

---

## 4 · Blockquote & rule

> The rain hit like a dropped pallet of bricks. No mist, no polite warning — just the sky opening its payload bay and dumping.
> — someone in the Afterimage

The three divider syntaxes below should all render as the ❖ filing-tab ornament:

---

***

___

---

## 5 · Callouts

Note the Afterimage treatment: **no left icon** — the title is a small uppercase **stamp tab pinned to the top-right** of the block. The set below spans all six of the theme's colour families (note/info · tip/success · question · warning/important · danger · example/quote).

Standard, titled, with body:

> [!note] Note callout
> Title text rides on the accent/colour bar — check legibility in both modes.

> [!tip] Tip callout
> With **bold** that renders brighter, tinted toward the callout colour.

> [!warning] Warning callout
> Amber / attention styling.

> [!danger] Danger callout
> The red of a door you shouldn't open.

> [!success] Success callout
> Confirmation styling.

> [!question] Question callout
> Would I actually use this?

> [!example] Example callout
> A worked example.

> [!important] Important callout
> Load-bearing.

> [!quote] Quote callout
> Concrete and steel that were never trying to be warm.

Fold states — the first starts **open**, the second **collapsed** (click to expand):

> [!info]+ Info callout (expanded by default)
> With an internal link inside: [[Example Note]] — hover to preview.

> [!abstract]- Abstract callout (collapsed by default)
> Hidden until you click the chevron.

Nested callout:

> [!warning] Outer warning
> Body of the outer.
> > [!danger] Inner danger
> > A callout inside a callout — check the inset and bar alignment.

Unknown type (deliberate fallback — should degrade gracefully to the default note styling, **not** break):

> [!nomenclatura] Nomenclature
> Not a theme-styled type. Confirm it still reads cleanly.

---

## 6 · Table

| Designation | Status   | Clearance | Notes                     |
| ----------- | -------- | --------- | ------------------------- |
| Specimen 01 | ACTIVE   | 4         | Header row = accent fill  |
| Specimen 02 | PENDING  | 2         | Even rows = dimmed accent |
| Specimen 03 | SEALED   | 5         | Hover a row to test       |
| Specimen 04 | REDACTED | —         | Last row                  |

Alignment (left / center / right):

| Field      | Value               | Score |
| :--------- | :-----------------: | ----: |
| Atmosphere | heavy, redacted     |     9 |
| Legibility | holding its breath  |     8 |
| Cohesion   | one bad bulb        |     7 |

---

## 7 · Code fences (language chips)

```js
const afterimage = { mode: "noir", crt: true };
function open(file) { return `OPENED: ${file}`; }
```

```python
def calibrate(theme):
    return [c for c in theme if c.visible]
```

```css
.theme-dark { --bu-accent: #e23b2c; }
```

```bash
gh release create 2.8.0 theme.css manifest.json
```

```json
{ "accent": "cobalt", "phosphor": false }
```

```typescript
const accent: string = "cobalt"; // chip → "TS"
```

```sql
SELECT designation FROM specimens WHERE clearance >= 4; -- chip → "SQL"
```

```yaml
accent: cobalt   # chip → "YAML"
phosphor: false
```

```toml
# Unmapped language — chip should fall back to "CODE", not break.
accent = "cobalt"
```

```
Plain fence — no language. Chip should also read "CODE".
```

---

## 8 · Bases (database view)

Replace the embed below with any `.base` file in your vault, then cycle its views (Table / Cards / List) to test each:

![[Example.base]]

---

## 9 · Math

Inline math: $e^{i\pi} + 1 = 0$ sits in the line without disturbing the baseline.

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

---

## 10 · Embeds & image

Note transclusion (header should respect the theme's embed framing) — point it at any note in your vault:

![[Example Note]]

Local image (sized), should sit in a framed plate — point it at any image in your vault:

![[example-image.png|320]]

Remote image with alt text (works as-is):

![Obsidian logo](https://obsidian.md/images/obsidian-logo-gradient.svg)

---

## 11 · Tags, comment & footnotes

Inline tags: #afterimage #calibration #specimen and a #nested/tag for good measure.

Here is an inline comment that should be invisible in reading view: %%redacted operator note%%

A claim that needs a citation.[^1] And a second claim.[^2]

[^1]: The footnote text lands down here.
[^2]: The second footnote, with a backref arrow.

---

## 12 · Verification matrix

Tick each once it reads cleanly in **all three** palettes (dark · light · inverted-editor). While here, also flip **Effects Mode** (Low / Medium / High), the **accent presets** (cobalt / amber / P1 / deus-gold), the **`bu-phosphor`** toggle, and **`bu-print-link-urls`** (raw URLs should print after links).

- [ ] **Properties panel** — keys render as uppercase label chips; list/tag values as multi-select pills (frontmatter above)
- [ ] §1 Typography — emphasis by brightness, bold-italic trace, readable strikethrough, soft break, kbd/sub/sup, heading chips
- [ ] §2 Links — resolved chip / **unresolved blur→sharp** / alias / heading **inversion** / external "www" tag / bare URL
- [ ] §3 Lists & tasks — nesting guides, printed checkbox, accent tick
- [ ] §4 Blockquote & the ❖ dividers
- [ ] §5 Callouts — **top-right stamp title, no icon**, all six colour families, fold open/collapsed, nested, unknown-type fallback
- [ ] §6 Table — header accent fill, zebra rows, hover, alignment
- [ ] §7 Code — chip gallery (JS/PY/CSS/SH/JSON/TS/SQL/YAML) + **unmapped → "CODE"** fallback
- [ ] §8 Bases — Table / Cards / List views (panel styling)
- [ ] §9 Math — inline + block
- [ ] §10 Embeds — note transclusion, sized local image, remote image
- [ ] §11 Tags / comment hidden in reading / footnotes + backref
- [ ] Reading **and** live-preview both hold

---

*End of test sheet. If every block reads cleanly across the matrix, the calibration holds.*
