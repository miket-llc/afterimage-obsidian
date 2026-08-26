---
title: Component Matrix
type: checklist
status: active
tags: [qa, matrix]
---

# Component Matrix

Tick these in each combination that matters. The point is coverage, not
beauty — beauty is judged on the other sheets.

## Appearance × preset

| | IBM DOS | 3270 | Typewriter |
|---|---|---|---|
| Dark | ☐ | ☐ | ☐ |
| Light | ☐ | ☐ | ☐ |
| Split (inverted editor) | ☐ | ☐ | ☐ |

## Display profile

| Profile | Dark | Light | Notes |
|---|---|---|---|
| Cobalt (default) | ☐ | ☐ | |
| Amber | ☐ | ☐ | |
| Ghost | ☐ | ☐ | |
| Ultraviolet | ☐ | ☐ | |
| Mono | ☐ | ☐ | |
| Custom | ☐ | ☐ | |

## Editor surfaces

- [ ] Inline title — raster visible through plate **and** glyphs
- [ ] H1 · H2 · H3 · H4 · H5 · H6 — six distinct treatments, not one shape six sizes
- [ ] Heading that wraps to two lines
- [ ] Live Preview — caret, selection, IME, spellcheck all intact
- [ ] Reading View — prose raster present, links still clickable
- [ ] Source mode — plain and reliable
- [ ] Find in document (Ctrl+F) — active match clearly distinguished
- [ ] Text selection across a heading plate
- [ ] Copy a raster-rendered heading → paste elsewhere → plain text arrives

## Chrome

- [ ] Active tab unmistakable at a glance
- [ ] Inactive tabs legible
- [ ] Stacked tab group (vertical spines)
- [ ] Selected file in explorer — decisive
- [ ] Long file name ellipsizes
- [ ] Status bar
- [ ] Command palette
- [ ] Settings modal
- [ ] Right sidebar: Backlinks, Outline, Tags
- [ ] Scrollbars
- [ ] Tooltips
- [ ] Notices / toasts

## Views

- [ ] Canvas
- [ ] Graph
- [ ] Bases
- [ ] Search results
- [ ] New tab (empty state)

## Safeguards

- [ ] Mobile emulation — heavy effects reduced, targets large
- [ ] `prefers-reduced-motion` — nothing animates
- [ ] Print / PDF export — white, no scanlines, no bloom
