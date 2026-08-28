# Afterimage — chrome design specification

Response to `docs/DESIGN-BRIEF-CHROME.md`. Direction A, dark mode, 1× at 100% display scale.

Visual reference: `CHROME-SPEC.html` in this folder — open it in a browser. It is a **design reference**, not production code. Values are lifted into the tables below; where the two disagree, the HTML is the intent and this file is the contract.

**Scope:** `theme.css` chrome only. Nothing here touches `.cm-content`, editor typography, or the reading view.

---

## 0. The verdict

The concept is sound. "Rugged housing, flat CRT modules set into it, TUI drawn on the tubes" is buildable and worth building. Four measurable faults:

| # | Fault | Evidence | Fix |
|---|---|---|---|
| 1 | **Value ramp inverted** | Housing `#1c1d21` (L\* ≈ 11.5), screens `#0a141d` (L\* ≈ 7.0). Δ 4.5 L\* is below the two-materials threshold, and an unlit hole in a lighter case is what a *switched-off* monitor looks like. | §2, §3 |
| 2 | **Raised, not recessed** | The bezel was lit on its **top** edge (`0 -1px 0 3px #4a4f58`) and cast an outward drop shadow. Both are raised-object cues. A hole is the inverse. | §3 |
| 3 | **No TUI, only a costume** | Inverse video on one element plus separators is not a grammar. | §6, §7 |
| 4 | **One size of one grey** | Nearly all chrome is 13.5px 3270 in `#8ba6bd`. That clears AA at 7.3:1 — contrast is not the failure, *sameness* is. | §8 |

**Delete outright:** the drifting refresh bar (a 9s moving object, invisible in a week, intolerable in month two, and it consumes the third compositing layer you need) and the centre bloom *as currently tuned* (raise it, per §5).

---

## 1. The boundary rule

> **Housing is what the machine *is*. Screen is what the machine is *showing*.**

Operational test: **if it changes when you open a different note, it is screen.**

**Corollary 1.** Housing and screen never meet without an aperture. There is no flush join — a flush join is what made the darker sub-panel behind the tab strip read as a seam.

**Corollary 2.** Housing never lights up. One exception: the ribbon's open-dock lens.

**Corollary 3 — this decides controls, and it is the metaphor.** Two kinds of control, distinguishable without reading:

| | **Keys** | **Fields** |
|---|---|---|
| Where | On the case | On the tube |
| Look | Moulded cap, engraved glyph | Drawn glyph in `[ ]` brackets |
| Operates | The machine — which panel is open, settings | Content — new note, sort, collapse |
| Feedback | Presses in; lights a lens | Bracket brightens |
| Precedent | A physical function key | `[ OK ]` in `dialog(1)` |

A control's *shape* tells you what it acts on before you read its glyph. Nothing on the ribbon ever gets brackets; nothing on a tube ever gets a keycap.

### Element inventory

| Element | Verdict | Because |
|---|---|---|
| Window ground | **HOUSING** | The case. Identical in every vault, at every moment. |
| Left ribbon rail | **HOUSING** | Fixed global controls. Never scrolls, never changes with the note. |
| Vault switcher | **HOUSING** | The nameplate — which installation you are sitting at. Engraved, not printed. |
| Resize handles | **HOUSING** | There is no handle. The handle is the gap between two modules — bare case. |
| Tab group (pane) | **SCREEN** | The tube. Sidebars and editor are the same object at different sizes. No reduced treatment for small panes. |
| Editor tab strip | **SCREEN** | Lists open documents. Content by definition. It is the top rule of its frame. |
| Sidebar dock tabs | **SCREEN** | **Settled.** They select which view is showing, so they are showing. Identical grammar to editor tabs, minus the label. Never raised keys on the housing — that cut the row away from its pane. |
| Pane header | **SCREEN** | A second rule inside the frame. |
| File tree rows, nav actions | **SCREEN** | Content, and controls over content. |
| Status bar | **SCREEN** | Reports on the open document, so it cannot be case. **Give it its own tube** — a letterbox strip set into the case bottom. |

---

## 2. Surface manifest

**Default is PAINTS NOTHING.** A surface on a tube reads as a card on a screen, with a seam — which is what broke twice. Three exemptions only: inverse video (the terminal's own selection mechanism), a phosphor wash (an emitting region emitting more), and a knockout (painting the tube's own colour to interrupt a rule).

| Element | Surface? | What and why |
|---|---|---|
| Window ground | PAINTS | The only real material. Ramp + stipple. |
| Tab group / tube | PAINTS | Tube fill, bloom, vignette — background layers under content. |
| Tab strip (band) | **NOTHING** | 1px bottom hairline only. **Never a fill, never a darker sub-panel.** That was the seam. |
| Tab — rest / hover | NOTHING / WASH | Hover only: `rgba(INK, .07)`. A wash of the ink already present. |
| Tab — active | **NOTHING** + knockout | Three borders. The only paint is a 2px strip of tube fill at the bottom edge, interrupting the band hairline. |
| Pane header / nav row | NOTHING | Rules and glyphs. |
| Tree row — rest | NOTHING | — |
| Tree row — hover | WASH | `rgba(INK, .07)`, full width to the frame's inner edge. |
| Tree row — current | INVERSE | Full `--after-text` plate, tube-fill ink. **No accent bar** — inverse video is complete on its own. |
| Icon buttons | NOTHING | On the tube: brackets, no fill, ever. |
| Ribbon keys | MOULDING | On the housing: a real moulded cap, because the housing is real. |
| Vault nameplate | NOTHING | Two 1px milled grooves and engraved text. |
| Status bar | PAINTS | It is a tube. Its items paint nothing. |
| Resize handle | NOTHING | Hover: 2px × 60%-height `#7fa8c4`, centred, fading at both ends. Drag: accent. |

---

## 3. The aperture

The load-bearing section. **A hole is not a frame.**

A raised object is lit on top, shaded below, and casts a shadow outward. A recess is the exact inverse: its top wall faces away from the light and goes dark, its bottom wall faces the light and goes bright, and **it casts nothing, anywhere.**

Paint order, outside in:

| # | Layer | Value | Job |
|---|---|---|---|
| 1 | Housing | `#26282e`, ramp `#32353c → #1d1f23` | The case. One light source, above, and it never moves. |
| 2 | Spill | `0 0 30px 6px` of `mix(ink 60%, accent) @ 7.5%` | **Proof the tube is on.** Light from inside the recess falling back out onto the case. |
| 3 | Contact shadow | `0 0 7px 1px rgba(0,0,0,.45)` | Occlusion at the mouth. Every real hole has one. |
| 4 | Cut edge | `0 0 0 1px #0a0b0e` | Where the router broke through. Keeps the silhouette crisp at 20% zoom. |
| 5 | **Countersink wall** | 4px, `linear-gradient(180deg,#0d0e11 0%,#191b1f 36%,#2c3037 70%,#474c55 100%)` | **Dark at the top, light at the foot.** The only layer that states which way is up. Painted `border-box` behind a transparent border. |
| 6 | Aperture shadow | `inset 0 3px 5px -2px rgba(0,0,0,.95)` | The top wall shading the glass. Soft, not a hairline. |
| 7 | Tube fill | `#050b11` | 13 L\* below the housing. |
| 8 | Lit lip | `inset 0 -1px 0 rgba(190,224,244,.12)` | Emitted light catching the bottom of the aperture. Bottom only. |
| — | ~~Top catch light `0 -1px 0 3px #4a4f58`~~<br>~~Outward drop shadow `0 6px 20px 4px`~~ | **DELETE** | The raised-object cues. This is why it floats. |

---

## 4. Tube stack, in paint order

Back to front. **The break is between 3 and 4:** layers 1–3 are background layers of the module element, so they sit under content automatically and need no z-index. Layers 5–6 are pseudo-elements and must be *over* it. Get that wrong and multiply lands under the glyphs, where it has nothing bright to subtract from — which is how the effect silently disappears.

| # | Layer | Colour · alpha | Blend | Carrier |
|---|---|---|---|---|
| 1 | Countersink wall, clipped `border-box` | `#0d0e11 → #474c55` | normal | bg-image 4 |
| 2 | Tube fill, clipped `padding-box`, then bloom `radial-gradient(120% 92% at 50% 38%, …, transparent 66%)` | `mix(INK 60%, ACC) @ 7.5%` | normal | bg-image 2,3 |
| 3 | Corner vignette `radial-gradient(132% 112% at 50% 50%, transparent 50%, … 100%)` | `#000` · 0 → 58% | normal | bg-image 1 |
| **4** | **CONTENT** — tabs, frame, rows, prose | — | — | DOM |
| 5 | Scan grid `repeating-linear-gradient(180deg, transparent 0 2px, … 2px 3px)` | `rgba(0,0,0,.34)` | **multiply** | `::before` |
| 6 | Glass sheen `linear-gradient(166deg, … 0%, … 24%, transparent 44%)` | `#c4e0f8` · 5.5% → 1.4% → 0 | **screen** | `::after` |
| ~~7~~ | ~~Drifting refresh bar~~ | — | — | **DELETE** |

Three rules that ship with the stack:

1. Both pseudo-elements carry `pointer-events: none`. No overlay may intercept a pointer.
2. The module **must** be a stacking context (`position: relative; isolation: isolate`) or `multiply` blends against the housing and the aperture goes black.
3. Layer 5 is the *module* raster, deliberately coarser than the editor's own body-text raster. Separate systems on separate elements. **Do not merge them.**

---

## 5. Tokens, as roles

Nothing below is "blue". Every colour is a fixed neutral or a stated relationship to `--after-accent` / `--after-text`, so all five presets work unchanged.

Light mode is the same machine with the room lights on. One asymmetry: **the spill becomes a shadow** — emitted light does not read against a bright case.

| Role | Dark | Light | Note |
|---|---|---|---|
| housing-lit (ramp top) | `#32353c` | `#d3d7dd` | one light source, above |
| housing (base) | `#26282e` | `#c3c7cd` | was `#1c1d21` |
| housing-shade (ramp foot) | `#1d1f23` | `#adb2ba` | — |
| wall-top (recess, in shade) | `#0d0e11` | `#6d737c` | faces away from the light |
| wall-foot (recess, lit) | `#474c55` | `#eef1f5` | faces into it. The gap between these two is the whole illusion |
| cut-edge | `#0a0b0e` | `#3f444b` | 1px, hard, over everything |
| tube-fill | `#050b11` | `#e8edf1` | 13 L\* from the case, both modes |
| spill / shadow | `mix(INK 60%,ACC) 7.5%` | `rgba(40,48,58,.22)` | the asymmetry: glow → `0 6px 16px` shadow |
| frame | `#44637c` | `#8ea2b2` | 3.2:1 vs tube — UI-component floor |
| frame-hi (focused, active tab) | `#7fa8c4` | `#3d5d76` | 7.9:1 |
| frame-faint (sub-rules) | `#2f4658` | `#c0ccd6` | dividers, property grid |
| ink-hi · C1, active tab | `#ffffff` / `#eaf2f9` | `#000d16` / `#16222c` | 14.6:1 |
| ink · C2 rows | `#dbe6ef` / `#c3d6e6` | `#1e2a35` / `#33424f` | folder / file |
| ink-muted · C3, C5 | `#93b0c7` | `#3f5568` | 8.7:1 |
| ink-label · C4 | `#7e97ab` | `#516576` | 6.4:1 |
| ink-faint · C6 | `#6b8195` | `#5f7183` | 4.9:1 — **the floor.** Nothing in the chrome goes below it |
| housing-ink · nameplate | `#9aa3ad` → `#cfd5dc` | `#4e545c` → `#23272c` | rest → hover; 5.8:1 on the case |
| inverse plate / plate ink | `INK` / `tube-fill` | `#16222c` / `#e8edf1` | derived, never literal |
| wash (hover) | `rgba(INK, .07)` | `rgba(22,34,44,.06)` | never a hue |
| scan | `rgba(0,0,0,.34)` | `rgba(0,0,0,.10)` | daylight washes the raster out; do not fight it |

---

## 6. TUI grammar — ten pieces

Everything in the design is one of these. If a future element needs a treatment not on this list, **the list is wrong, not the element.**

1. **Rule, corner, junction.** Corners and junctions are glyphs. The runs between them are **1px backgrounds** in the same colour. `#44637c` at rest.
2. **Focus = the frame doubles.** `1px #44637c` → `3px double #7fa8c4`. No hue change, no glow, no accent.
3. **Title set into the rule.** `┤ FILES ├` then a 1px flex-fill; count in `┤ ├` at the right.
4. **Field label vs value.** Label: 3270, tracked, uppercase, muted. Value: Courier Prime, untracked, true case, bright. Two axes change at once.
5. **Selection = inverse video.** Full inversion at ≥14px, for *current* only. Hover is a 7% wash of the same ink — never a new hue.
6. **Key hints in the bottom rule.** Focused pane only. This fills the dead space at the bottom of a sidebar.
7. **Counts, badges, leaders.** Right-aligned, tabular, 3270 13px, dotted leader.
8. **Empty state.** Never blank. Frame closes; four `░` at 24px centred; a C4 line stating the condition.
9. **Truncation.** Titles clip at the end. Paths clip at the **start** (`direction: rtl`). Never fade-out masks — a gradient over live text fights the multiply raster.
10. **Bracketed controls.** Every icon button wears `[ ]` as `::before`/`::after`. The bracket carries state; the glyph only brightens.

### Glyphs, literally

| Glyph | Codepoint | Used for | Size · colour |
|---|---|---|---|
| `┤ ├` | U+2524 U+251C | Brackets around any title or count set into a rule | 14–15px · `#44637c`; focused pane `#7fa8c4` |
| `┌ ┐ └ ┘` | U+250C…U+2518 | Corners **only where a 3px radius will not do**. Real panes use radii. | 16px · `#44637c` |
| `│` | U+2502 | Divider between inactive tabs, between status items | as a 1px × 12–13px div, `#2f4658` |
| `▸ ▾` | U+25B8 U+25BE | Collapse indicator | 14.5px · `#93b0c7` · no rotation transition |
| `[ ]` | U+005B U+005D | Every icon button and key hint | 14.5px / 12px · `#44637c` → `#7fa8c4` → ACC |
| `░` | U+2591 | Empty-state mark, ×4, centred | 24px · +0.3em · `#2f4658` |
| `·` | U+00B7 | Dotted leader (as `border-bottom: 1px dotted`, not repeated glyphs) | `rgba(#44637c,.5)` |
| `…` | U+2026 | Truncation. Native `text-overflow`, never a mask | inherits |

> **Do not tile box-drawing characters to make a line.** A run of `─` in a fluid container clips mid-glyph at the end and shifts by a fraction of a cell at every width. Corners are glyphs because they are single characters at fixed positions. Runs are 1px backgrounds. The two match at 13–16px in 3270 to within half a pixel.

---

## 7. Selection, and why there is no accent bar

**Silhouette first, rule weight second, brightness third.**

The active tab is where the frame's top rule **breaks open** into the pane below it. A shape change — it survives 20% zoom, greyscale, and all five presets. It paints no fill, so it cannot punch a hole in the tube's glow.

**No accent anywhere in the tab strip.** A coloured bar across the top of the selected tab is the house style of every IDE and browser shipped since ~2015; a terminal never had it. The rule around the notch lifting `#44637c → #7fa8c4` says the same thing in the vocabulary the machine already speaks, and costs no hue.

**Accent appears in exactly four places in the whole chrome:** hotkey glyphs in key hints, the `:focus-visible` ring, the ribbon's indicator lens, and a status value that is itself the subject.

---

## 8. Chrome type scale

**Size carries hierarchy between C1 and C4** — the pane title is deliberately *larger* than the row text beneath it, which is the inversion of most app chrome and the thing that makes a terminal feel like a terminal. **Colour carries state within a step**, never across one. **Face carries kind:** 3270 for anything the machine says about itself; Courier Prime for anything out of the vault.

| Step | Face · size · tracking | Job |
|---|---|---|
| **C1** | 3270 · 15px · +0.14em · UPPER · `#eaf2f9` | Pane title, set into the frame. Brightest and largest thing in the chrome. **Size is the hierarchy.** |
| **C2** | Courier Prime · 14.5px · 0 | Anything from the vault: file names, outline entries, search results, tags. True case always. Folder `#dbe6ef`, file `#c3d6e6`. **Face is the hierarchy.** |
| **C3** | 3270 · 14px · +0.04em | Tab titles. `#ffffff` active / `#93b0c7` rest. **Colour is the hierarchy** — no size change between states. |
| **C4** | 3270 · 12.5px · +0.20em · UPPER · `#7e97ab` | Field labels, section stamps, column heads, breadcrumbs, status labels. Tracking is what makes 12.5px legible; do not reduce it. |
| **C5** | 3270 tabular · 13px · +0.02em · `#93b0c7` | Every numeral. Right-aligned, dotted leader where the label is far. Accent only when the count *is* the subject. |
| **C6** | 3270 · 12px · +0.10em | Key hints and bracketed controls. Three colours in one run — bracket, key, word. |
| **C7** | 3270 · 13–16px · 0 · `#44637c` | Structure glyphs. Always 3270, never the bitmap face — box-drawing on a 16px-locked grid cannot align to a fluid layout. |

Housing has two steps only: **H1** nameplate, 13px 3270 +0.20em UPPER engraved; **H2** ribbon glyphs, 17px. The case does not carry paragraphs.

---

## 9. Per-element, per-state values

`ACC` = `--after-accent`. `INK` = `--after-text`.

### Editor tab
| State | Background | Border / rule | Ink · type |
|---|---|---|---|
| rest | none | band hairline 1px `#44637c`; 1px × 13px `#2f4658` divider between tabs | `#93b0c7` · C3 · pad 0 14px · h 31px |
| hover | `rgba(INK,.07)` | unchanged | `#dbe6ef` · no size change |
| active | none + 2px knockout strip in tube fill at bottom −1px | **1px `#7fa8c4`** top+sides, radius 3px 3px 0 0, no bottom. No accent, no fill, no glow. | `#ffffff` · C3 · close × `#93b0c7`. *Group unfocused:* ink `#cbe0f0`, rule unchanged |

### Dock tab (icon)
Identical to editor tab; box 44 × 31px, glyph 16px 3270.

### Pane frame
| State | Border | Title |
|---|---|---|
| rest | `1px solid #44637c`, no top, radius 0 0 2px 2px | C1 in `┤ ├` at `#44637c` |
| focused | **`3px double #7fa8c4`**, no top; band hairline becomes `linear-gradient(#7fa8c4 0 1px, tube 1px 2px, #7fa8c4 2px 3px)` | `┤ ├` lift to `#7fa8c4`; bottom rule reveals key hints |

### Tree row
| State | Background | Border | Ink |
|---|---|---|---|
| rest | none | indent guide 1px `rgba(#44637c,.55)` per level, 20px apart | file `#c3d6e6` / folder `#dbe6ef` · C2 · pad 4px 12px |
| hover | `rgba(INK,.07)` | — | `#dbe6ef` |
| current | `INK` solid | none | tube fill `#050b11` · C2 |
| focused | as current | `outline: 1px solid ACC; outline-offset: 1px` — `:focus-visible` only | as current |

### Nav action button (tube)
Rest: brackets `[ ]` 14.5px `#44637c`, glyph `#93b0c7`. Hover: brackets `#7fa8c4`, glyph `#ffffff`. On: brackets ACC, glyph `#ffffff`. **No background, ever.**

### Ribbon key (housing)
| State | Background | Shadow | Ink |
|---|---|---|---|
| rest | `linear-gradient(180deg,#34373e,#282b31)` · radius 4px · 30 × 30px | `0 1px 0 rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.10), inset 0 -1px 0 rgba(0,0,0,.5), 0 0 0 1px #1a1c20` — **a moulded cap, always, not on hover** | `#aeb6c0` · 17px 3270 · engraved: `text-shadow: 0 1px 0 rgba(255,255,255,.06), 0 -1px 0 rgba(0,0,0,.55)` |
| hover | unchanged | unchanged · `transform: translateY(1px)`, 60ms | `#dfe6ee` |
| dock open | **pressed in** — `linear-gradient(180deg,#212329,#292c32)` | `inset 0 2px 4px rgba(0,0,0,.65), inset 0 -1px 0 rgba(255,255,255,.05), 0 0 0 1px #1a1c20`<br>**lens** 5px circle at the rail's inner edge: `radial-gradient(circle at 38% 32%, #b9e0ff, ACC 55%, shade(ACC))`, `0 0 7px 1px rgba(ACC,.6)`, `0 0 0 1px #101216`, `inset 0 -1px 0 rgba(0,0,0,.45)` | `#e4ebf3` · **the only lit thing on the housing** |

### Vault nameplate (housing)
Rest: no background; `inset 0 1px 0 #16181c, inset 0 2px 0 -1px #3d424b, inset 0 -1px 0 #16181c`; h 28px; ink `#9aa3ad`, H1, `text-shadow: 0 1px 0 rgba(255,255,255,.07), 0 -1px 0 rgba(0,0,0,.6)`. Hover: ink `#cfd5dc`. **Never accent** — hardware does not light.

### Status tube
`#050b11` + faint bloom · radius 6px · h 28px · 3px countersink wall. Dividers 1px × 12px `#2f4658`. Label C4, value C5, subject value ACC. **Raster at half strength (.18).**

### Resize handle (housing)
Rest: nothing — the 10px gutter is the handle. Hover: 2px × 60%h `#7fa8c4`, centred, mask-faded top and bottom 20%. Dragging: 2px × 100%h ACC.

---

## 10. Degradation

| Condition | Behaviour |
|---|---|
| Sidebar at 200px | Tube padding 9 → 8px. Dock tabs 44 → 36px. Tree rows 14.5 → 13.5px, pad 4 → 3px. Nav buttons drop to four, lose their gap. **The frame never thins, the title never abbreviates, the wall never changes.** Below 180px (Obsidian's floor) nothing further is specified. |
| 40-char tab title | Tab max-width 220px, ellipsis at the end. Below 96px the close × hides on inactive tabs (returns on hover); the active tab keeps its × at every width. |
| Twelve open tabs | Tabs flex to a 78px floor, then the strip scrolls horizontally, no visible scrollbar. Active tab pinned to 150px min and scrolled into view. Overflow count (C5, `+4`) immediately before the "+". |
| **A group with one icon tab** | **Nothing special happens, and that is the fix.** The band hairline runs from the tab to the far corner and turns down into the frame; the pane title sits in the header rule beneath. It looked broken because there was no frame for the empty run to belong to. **Do not centre the tab, do not stretch it, do not hide the strip.** |
| A pane with no content | Frame closes; four `░` at 24px centred; C4 line beneath. Vertically centred in the frame body, not top-aligned. |
| Window < 900px wide | Gutters 10 → 6px, wall 4 → 3px, spill 30 → 20px. Proportional — the machine just gets smaller. Below 700px Obsidian switches to mobile and the effect stack is already off. |

---

## 11. Motion

> **Nothing in the chrome moves on its own. Ever.**

A machine that is idle is idle. The drifting refresh bar is the thing most likely to be switched off by a real user in week three, it costs a compositing layer you need, and it undermines the theme's own claim — that this stays interesting while completely motionless.

| Transition | Duration · easing | Reduced motion |
|---|---|---|
| Selection → inverse video | 90ms · `steps(2)` | identical — a step is not motion |
| Hover wash | 0ms in · 120ms out · linear | identical |
| Frame single → double (focus) | 0ms | identical |
| Ribbon key press | 60ms · ease-out (1px down) | no travel; brightness only |
| Pane resize | none — track the pointer | identical |
| Scan, bloom, sheen | static | identical |

`prefers-reduced-motion` needs one rule: kill the 60ms key travel. The theme's master motion switch then has nothing left to disable in the chrome — which is a feature. The setting becomes about the *editor*, where the user actually wants control.

---

## 12. Build order

If only three land, take 1–3. They are also the cheapest.

1. **The value ramp + the countersink.** Housing to `#26282e` with the ramp, tube to `#050b11`, wall gradient in, top catch light and drop shadow out, 30px spill on every module. Four tokens and one box-shadow rewrite. Fixes "dark panels on a dark background" *and* "sitting on top rather than set in", completely.
2. **The frame.** 1px inset frame on every tab group, pane title set into the top rule, 3px double on focus. ~40 lines, and it is the entire difference between "app with a filter" and "TUI".
3. **The type ramp.** C1–C7 in place of the one dim grey. Largest legibility gain per byte in the document. This is the fault described as "too small" — the problem was never the size, it was that nothing was bigger.
4. **Tabs as notches.** Retire the solid accent block. Silhouette selection, no fill, one knockout strip.
5. **The status tube.** Its own module. High gadget-per-line ratio; the bottom of the window stops being dead.
6. **Brackets, key hints, leaders, nameplate, moulded ribbon keys.** Polish, in that order. Delete the refresh bar whenever you next touch the tube stack.

---

## 13. Token block

```css
.theme-dark {
  /* housing — the case. One light source, above. */
  --after-chassis:        #26282e;
  --after-chassis-lit:    #32353c;
  --after-chassis-shade:  #1d1f23;
  --after-chassis-ink:    #9aa3ad;
  --after-chassis-ink-hi: #cfd5dc;

  /* the aperture — a hole, not a raised frame.
     Top wall faces away from the light and is dark; the foot faces into it. */
  --after-wall-w:    4px;
  --after-wall:      linear-gradient(180deg,#0d0e11 0%,#191b1f 36%,#2c3037 70%,#474c55 100%);
  --after-cut-edge:  #0a0b0e;

  /* tube */
  --after-tube:           #050b11;
  --after-tube-radius:    8px;   /* outer; the glass reads 4px inside the wall */
  --after-tube-pad:       5px;
  --after-gutter:         10px;

  /* emission — always derived, never literal */
  --after-emit:  color-mix(in srgb, var(--after-text) 60%, var(--after-accent));
  --after-spill: 0 0 30px 6px color-mix(in srgb, var(--after-emit) 7.5%, transparent);
  --after-bloom: radial-gradient(120% 92% at 50% 38%,
                   color-mix(in srgb, var(--after-emit) 7.5%, transparent), transparent 66%);
  --after-vignette: radial-gradient(132% 112% at 50% 50%,
                   transparent 50%, rgba(0,0,0,.58) 100%);
  --after-sheen: linear-gradient(166deg,
                   rgba(196,224,248,.055) 0%, rgba(196,224,248,.014) 24%, transparent 44%);
  --after-scan:  repeating-linear-gradient(180deg,
                   transparent 0 2px, rgba(0,0,0,.34) 2px 3px);

  /* frame */
  --after-frame:       #44637c;
  --after-frame-hi:    #7fa8c4;
  --after-frame-faint: #2f4658;

  /* chrome ink ramp — C1 → C6 */
  --after-c1: #eaf2f9;   --after-c2: #dbe6ef;   --after-c2-file: #c3d6e6;
  --after-c3: #93b0c7;   --after-c3-on: #ffffff;
  --after-c4: #7e97ab;   --after-c5: #93b0c7;   --after-c6: #6b8195;

  --after-wash: color-mix(in srgb, var(--after-text) 7%, transparent);
}

/* the module — a screen set INTO the case */
.workspace-tabs {
  position: relative; isolation: isolate;
  padding: var(--after-tube-pad);
  border: var(--after-wall-w) solid transparent;   /* the countersink */
  border-radius: var(--after-tube-radius);
  background:
    var(--after-vignette) padding-box,
    var(--after-bloom)    padding-box,
    linear-gradient(var(--after-tube), var(--after-tube)) padding-box,
    var(--after-wall)     border-box;              /* dark at the top, lit at the foot */
  box-shadow:
    0 0 0 1px var(--after-cut-edge),
    0 0 7px 1px rgba(0,0,0,.45),                   /* contact shade at the mouth */
    var(--after-spill),
    inset 0 3px 5px -2px rgba(0,0,0,.95),          /* the top wall, shading the glass */
    inset 0 -1px 0 rgba(190,224,244,.12);
  /* NO outward drop shadow. A hole does not cast one. */
}

/* NOTE: a bare colour cannot carry a padding-box keyword in the background
   shorthand — the whole declaration is dropped. Wrap it in a gradient. */

.workspace-tabs::before,                 /* 5 · scan, over content */
.workspace-tabs::after {                 /* 6 · sheen, over scan   */
  content: ""; position: absolute; inset: 0; pointer-events: none;
  border-radius: calc(var(--after-tube-radius) - var(--after-wall-w));
}
.workspace-tabs::before { background: var(--after-scan);  mix-blend-mode: multiply; z-index: 40; }
.workspace-tabs::after  { background: var(--after-sheen); mix-blend-mode: screen;   z-index: 41; }

/* the notch */
.workspace-tab-header-container-inner { box-shadow: inset 0 -1px 0 var(--after-frame); }
.workspace-tab-header.is-active {
  border: 1px solid var(--after-frame-hi); border-bottom: none;
  border-radius: 3px 3px 0 0;
  /* no accent bar, no fill, no glow — the broken rule IS the selection */
}
.workspace-tab-header.is-active::after {          /* knockout: break the rule */
  content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
  background: var(--after-tube);
}
```

---

## 14. What CSS on Obsidian's DOM cannot do

Each with its fallback. These are the places where the spec above is knowingly approximate.

| Limit | Fallback |
|---|---|
| **Two pseudo-elements, no more.** The tube needs two over-content layers and you have exactly two. | Deleting the refresh bar is what makes this work. A third layer must hang on `.workspace-tab-container` — but it will not cover the tab strip. |
| **Titles cannot move into the frame.** A true TUI sets the title in the top rule; you cannot reparent `.view-header-title`. | The header row *becomes* a rule: `┤ TITLE ├` then a 1px flex-fill to the frame edge. Visually identical. |
| **Counts cannot be hoisted.** The `14` in the FILES rule cannot be read out of the tree below it. | Where a count exists in the DOM (backlinks, tags, search) it is already in `.tree-item-flair` and can be styled in place. Where it does not, **omit it — do not fake it.** |
| **Key hints are static text.** CSS cannot read the user's keymap; `^N` would be hard-coded. | Ship hints only for bindings Obsidian does not let the user rebind away, or make the row a Style Settings toggle (default on) with a one-line caveat. **Do not invent shortcuts.** |
| **Multiply needs a stacking context.** Without `isolation: isolate`, the scan layer blends against the housing and the aperture goes black. | This is the failure that reads as "the effect disappeared". |
| **The editing safety rules still bind.** | `.cm-content` stays `position: static`. Both tube layers are `pointer-events: none`. No chrome element clips, filters or recolours editable text. The module raster stays a separate, coarser system from the body-text raster. |

---

## 15. Acceptance

- [ ] At 20% browser zoom the window reads as **one machine**, not a set of panels.
- [ ] Every module reads as **set into** the case, not sitting on it — no element casts an outward shadow onto the housing.
- [ ] Squint test: the brightest thing in any pane is its **title**, not its body rows.
- [ ] Greyscale test: active tab and focused pane are both still identifiable.
- [ ] Switch through all five accent presets: nothing in the tab strip changes.
- [ ] No chrome element animates unprompted at any point.
- [ ] 200px sidebar, 12 tabs, and a one-icon dock all hold the grammar.
