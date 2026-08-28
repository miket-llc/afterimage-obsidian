# Afterimage — the design model

`CHROME-SPEC.md` gave you three thousand words of values and about forty of
model. It was executed faithfully and the result was wrong. That is the
spec's fault, not the execution's — a table of numbers cannot transmit
judgement, so the first decision that fell outside the table went badly.

This file is the replacement, and it is deliberately short.

**The values live in `CHROME-REFERENCE.html`.** Open it in a browser, then
read its source. Every colour, size and shadow in it is intentional and can be
lifted directly. This document exists so you can derive a value that *isn't*
in there.

---

## The object

Afterimage is **one CRT in a machined case.**

Not a dark UI with CRT decoration on top. Not five small screens set into a
housing. One tube, one phosphor coating, one character generator, and a TUI
drawn on the glass that divides the screen into regions.

The falsification test:

> **If a change would be impossible on a real cathode-ray tube, it is the
> wrong change.**

A coating cannot change hue between elements. A character generator has one
font. Emitted light comes from glyphs, not from panels. Those three sentences
decide most questions on their own.

---

## The four laws

### 1 · The glyphs emit

Glow is `text-shadow` on characters. It is never a radial gradient on a panel
background. Halation across the raster, the light spilling onto the case, the
whole sense that the machine is powered — all of it is downstream of light
coming out of the letters.

*Test:* remove every `text-shadow` in the chrome. If the screen still looks
lit, the glow is on the wrong object.

### 2 · One phosphor

There is no accent colour. There is a phosphor, and things are brighter or
dimmer in it.

*Test:* convert a screenshot to greyscale. Nothing may be lost. If a state was
only distinguishable by hue, that state has no encoding.

### 3 · Four intensities, not seven greys

The real IBM field attributes: **intensified**, **normal**, **protected**
(dim), and **reverse video**. That is the entire vocabulary and it is enough
for every piece of chrome in the app.

*Test:* every chrome colour resolves to one of the four. A fifth value means a
decision was dodged.

### 4 · Nothing is a surface

Regions are divided by rules and frames, not fills. Three exemptions only:
reverse video (selection), a phosphor wash at 7% (hover), and a knockout
(painting tube colour to interrupt a rule).

*Test:* an element with a background that is none of those three is wrong.

---

## Forbidden moves

Every one of these was actually made, in the first spec, by the model that
wrote it. They are the default instincts, and they are all wrong here.

| Move | Why it is wrong |
|---|---|
| **An accent bar across the top of the active tab.** | House style of every IDE shipped since ~2015. A terminal never had it. Selection is reverse video; focus is frame weight. |
| **A second typeface for hierarchy.** | One character generator. Hierarchy comes from intensity, reverse video and position. |
| **Glow on a panel background.** | See law 1. This is the single most common way a "CRT theme" ends up looking like a dark theme with a filter. |
| **Restraint as a default.** | This is a fantasy instrument. When in doubt, commit. A tasteful 1px hairline where Turbo Vision would draw a saturated double rule is a failure, not a refinement. |
| **Deleting ambient motion.** | The drifting refresh bar is a CRT artifact, not decoration. It stays. Scope any "nothing animates" test to chrome *elements* and exempt the tube overlay. |
| **Raised-object cues on screen regions.** | Top-edge catch lights and outward drop shadows say "sitting on top of". A recess is the inverse: top wall dark, bottom wall lit, casts nothing. |
| **Inventing UI Obsidian does not have.** | A menu bar and an F-key row were both invented and both wrong. Grep `theme.css` for a class name before assuming it exists — the theme is the authoritative record of what the app renders. |
| **Soft rounded buttons on the chassis.** | The case is machined metal. Hard radii, deep bevels, keys in milled wells, screws at varying angles, lamp positions drilled whether lit or not. |
| **Two elements saying the same thing.** | In a sidebar the dock tab *is* the pane title. Suppress `.view-header` there and let the tab carry the label via `content: attr(aria-label)`. |

---

## What this reverses from CHROME-SPEC.md

The current `theme.css` implements the old spec. This is partly an undo, and
some of it will fight the existing test suite. That is expected.

| Was | Now | Note |
|---|---|---|
| Five countersunk modules in a case | One tube; the TUI divides it | The gutters go away entirely |
| Blue-grey screen, cobalt accent | P4 blue-white phosphor, no accent | `theme.css` already had the right ink before I overrode it |
| C1–C7, seven-step grey ramp | Four intensities | Law 3 |
| Accent bar on the active tab | Reverse video | Forbidden moves |
| Accent stripe beside the current tree row | Reverse video alone | Inversion is complete on its own |
| Three type faces | One | Law 1's sibling |
| "Nothing moves. Ever." | Refresh bar + mains flicker + phosphor decay | The test that enforces this must be rescoped |
| Phosphor persistence unbuilt | Drawn, on the way out only | The theme is named for it |

---

## The one decision that must be made before starting

The theme ships five accent presets — Cobalt, Amber, Ghost, Ultraviolet, Mono.
Law 2 says a coating cannot change hue, so as *accents* they cannot survive.

They can survive as something better: **five tubes.** The user picks a phosphor
once, and the entire display derives from it — ink, glow, halation, case
spill, reverse plates, everything. Amber becomes a P3 tube. Mono becomes P4
white. Cobalt stays as it is. That makes the presets more meaningful than they
are today, not less, and it costs one indirection: every chrome colour becomes
a derivation of `--after-phosphor` rather than a literal.

**Do not start work until this is settled.** If the answer is "keep accents as
accents", laws 2 and 3 do not apply and this document needs rewriting.

---

## How to verify

You have good infrastructure. Use it, and add to it.

1. **Look at the picture.** Open `TARGET-ONE-TUBE.png`, the owner's canonical
   finished-state target, before comparing a fresh `npm run shots` render. The
   first spec failed because nobody, human or model, looked at a real CRT.
   Reference images live in `docs/reference/` — look at those too, before
   chrome work.
2. **`npm run lint`** — with the new palette and typeface rules in
   `lint-phosphor.mjs`. These make laws 2 and 3 mechanical. A paragraph can be
   forgotten; a failing build cannot.
3. **`npm test`** — rescope the animation assertion, then add the greyscale
   check: render, desaturate, assert the active tab still differs from an
   inactive one by more than N.
4. **One change at a time.** Screenshot after each. Do not implement this
   document in a single pass — that is how the last one went wrong at scale.

---

## Acceptance

- [ ] Greyscale: active tab, focused pane and current row all still readable.
- [ ] Every `text-shadow` removed → the screen looks dead. (Proves law 1.)
- [ ] One `font-family` across all chrome selectors.
- [ ] No chrome colour outside the phosphor hue ±12°, chassis excepted.
- [ ] The refresh bar drifts top to bottom on a ~9s cycle and nothing else moves.
- [ ] Switching phosphor preset changes every lit pixel and no layout.
- [ ] Sidebar dock tab and pane title are one object, at one offset, on both sides.
- [ ] `.sidebar-toggle-button` left and right both present and bracketed.
