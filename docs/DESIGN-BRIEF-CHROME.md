# Prompt for Claude Design — the chrome

Paste everything below the line. Attach a current screenshot of the app window.

This is a **companion** to `DESIGN-BRIEF-REQUEST.md`, which covers the reading
surface (headings, plates, prose, tags). This one covers only the **chrome**:
the window ground, the panes, the tab strips, the ribbon, the vault switcher
and the status bar. Read that one first for the palette and type facts; they
are not repeated in full here.

---

I need a **visual design specification for the chrome** of an Obsidian theme
called **Afterimage**. Not code — decisions, with values, precise enough to
implement without guessing. Several implementation attempts have converged
badly because they reacted to individual complaints instead of following a
spec. I want the spec.

## The idea, in the owner's own words

Assembled from his notes across several rounds. These are the requirements;
where I've paraphrased anything below, his words win:

> "Blue areas — UX areas — should look like they are **screens**, and the
> background needs to be like a **rugged device we're using**."
>
> "The **vault selector** should look like it's part of the device as well."
>
> "**Tabs at the top should look like they are on the screen that the content
> is on.**"
>
> "The content screens can be **CRT** … just have **one CRT look**, like the
> one for the content, then use that everywhere **except for the background of
> the window, which should just be a ruggedized dark grey device**."
>
> "**Leave space around the screens.** Imagine like a flat CRT with a
> **scanline animation** on it."
>
> "And that you had an old school terminal and had to create a **TUI** for the
> tabs — for everything. EXCEPT you can get a little creative and use
> **different sized fonts and maybe some colour** here and there."

So: **one machine.** A ruggedized dark grey housing, with flat CRT modules set
into it, and every piece of interface drawn *on those tubes* as a terminal UI.
Nothing in the interface is a physical control except the housing itself.

The last instruction is the least explored and probably the most important:
**a TUI for everything.** Think tmux status lines, Norton Commander, Turbo
Vision, `dialog(1)`, an oscilloscope menu system — box-drawing rules, aligned
columns, inverse-video selection, key hints, field labels in a different
weight or colour from values. Not a modern sidebar with a CRT filter over it.
The permission to "get a little creative" means it does not have to be a
faithful 80×25 emulation: sizes may vary, colour may be used deliberately.

## What exists now, and what is wrong with it

Current implementation, so you don't re-propose it:

- **Housing** — flat `#1c1d21` dark grey with a fine non-directional stipple
  and a soft overhead gradient. Reads acceptably as a case.
- **Screens** — every Obsidian *tab group* is one module: fill `#0a141d`,
  horizontal scan lines on a 2px grid, a centre phosphor bloom tinted from the
  accent, a corner vignette, a glass sheen, a 2px near-black bezel, an inset
  top shadow and a lit bottom lip. A soft refresh bar drifts down every ~9s.
- **Tabs** — drawn on the tube. Inactive: dim label, no fill, 1px dim rules
  between tabs. Active: solid accent block with dark knocked-out lettering
  (inverse video), scan lines running across the block, flat.
- **Ribbon** — the only hardware: a raised moulded rail with backlit keys.
- **Vault switcher** — a raised stamped plate with engraved lettering.

**The owner's verdict on this is that it is not working.** Assume the whole
chrome is open for redesign. Specific things I already know are weak:

1. It reads as *dark panels on a dark background* more than as *screens in a
   device*. The value separation between housing and screen is small, and
   everything is competing at the same low contrast.
2. The TUI instruction has barely been acted on. The tabs got inverse video
   and separator rules; nothing else did. There is no box-drawing, no field
   grammar, no aligned columns, no key hints — no system.
3. There is no typographic hierarchy in the chrome. Nearly all of it is one
   size of dim grey. The permission to vary size and colour is unused.
4. Several attempts failed and should not be repeated:
   - **LCD/backlight treatment** (subpixel mask, edge bleed) — wrong machine.
   - **Vertical ribs on the housing** — read as denim, and a tube scans
     horizontally, so any vertical stripe fights the one axis that means
     something.
   - **A darker sub-panel behind the tab strip** — a surface drawn on a screen
     reads as a panel *on* the screen, with a seam. It broke the illusion.
   - **Dock tabs as raised physical keys on the housing** — cut the tab row
     away from the pane it belongs to.

## The elements you must design

This is CSS over Obsidian's DOM, so this list is fixed — no new markup:

| Element | Notes |
|---|---|
| Window ground | the housing |
| Tab group (pane) | the CRT module; sidebars and editor are the same thing |
| Editor tab strip | icon, title, close, "+" — 1 to ~12 tabs, titles ellipsize hard |
| Sidebar dock tabs | **icon only**, no labels, typically 1–4 per group |
| Pane header | a title, sometimes breadcrumbs, an actions cluster |
| File tree rows | folder/file, collapse arrow, indent guides, active + focused states |
| Nav action row | 4–5 icon buttons above the tree |
| Left ribbon | vertical icon rail, ~8 icons + settings at the bottom |
| Vault switcher | vault name + 2 icons, bottom of the left sidebar |
| Status bar | a few text items, bottom right |
| Resize handles | between panes |

States needed for anything interactive: rest, hover, active/current, focused.

## Fixed constraints

- **CSS only, on someone else's DOM.** No new elements. Pseudo-elements
  (`::before` / `::after`) are available on most nodes and *are* fair game for
  box-drawing characters, rules, brackets and key hints.
- **Three faces ship**, all terminal: **Courier Prime** (body, has real bold
  and italic), **IBM VGA** (bitmap, 16px cell — crisp only at 16px and
  multiples, single weight), **3270** (outline, scales freely, single weight).
- **Bold is brightness, not weight.** The terminal faces have one weight.
- **Dark and light mode both.** Light mode is a daylight-readable version of
  the same machine, not a different design.
- **WCAG AA (4.5:1) on body text is a hard floor.** Chrome labels should clear
  it too — the current dim greys are the thing that makes it all mush.
- **Readable for 8-hour working days.** Motion must be ignorable, and must
  respect `prefers-reduced-motion`.
- The accent means *selection, focus, current state, significant interaction*.
  It is not decoration. Five accent presets exist (cobalt `#2e9dff`, amber
  `#ffb000`, P1 green `#43ff7d`, violet `#8b7dff`, mono `#c3ccd4`), so nothing
  may depend on the accent being blue.

## What I want back

The previous rounds failed because I was handed a *look* and had to invent the
values. Every gap I filled by guessing, I guessed wrong. So this deliverable
has to be **implementable without a single judgement call left to me.** Two
parts, and I need both.

### Part A — artboards

1. **The full window**, dark mode, realistic proportions — left sidebar with
   file tree, editor with 3–4 tabs, right sidebar with 2–3 stacked panes,
   status bar. This is the one that has to sell the idea.
2. **The same window in light mode.**
3. **Tab strip detail** at 3–4× — every state, editor tabs *and* icon-only
   dock tabs, showing exactly how selection reads.
4. **A TUI grammar sheet** — the vocabulary drawn once: rules and corners,
   field label vs value, selection, focus, key hints, counts/badges, empty
   states, truncation.
5. **The housing/screen boundary** at high zoom, with the values that make it
   read as set-in rather than drawn-on.

### Part B — the spec, and this is the part I actually build from

**1. The boundary rule.** One stated principle answering "is this element
housing, or is it screen?", plus the complete verdict for every element in the
inventory above. I have flip-flopped on the dock tabs three times because no
rule existed. I need the rule, not the answers alone.

**2. A surface manifest.** For every element: does it paint a background, yes
or no? This is the specific thing that broke twice — a filled tab strip reads
as a panel *on* the screen, and a filled active tab punched a hole in the
tube's glow. I want an explicit "paints a surface / paints nothing" column, so
I stop reintroducing it.

**3. Per-element, per-state values.** A table, not prose. For each element ×
each state (rest / hover / active-or-current / focused):
background, border or bezel, text colour, font face, px size, letter-spacing,
padding, and any glow or shadow with its full value. "Dim grey" is what got me
here; give me `#8ba6bd at 62%`.

**4. The tube stack, in order.** The screen effect is layered — scan, phosphor
bloom, vignette, glass sheen, drifting refresh bar. I need the **paint order
front-to-back**, each layer's colour, alpha, geometry and blend mode, and
which of them sit *under* content versus *over* it. I got this order wrong
once and the effect silently disappeared.

**5. Tokens, expressed as roles.** A colour table for both modes. Nothing may
be a literal blue: five accent presets ship, so every value must be either a
fixed neutral or a stated relationship to the accent ("accent at 15% over the
screen fill"). Same for the housing ramp.

**6. A chrome type scale** — size, face, colour and the *job* of each step.
Say explicitly where size or colour is carrying hierarchy. Right now the whole
chrome is one size of dim grey and the owner's permission to vary it is unused.

**7. The TUI vocabulary as literal glyphs.** I implement these with
pseudo-element `content`, so I need the actual characters (`│ ├ ─ ┤ ▸ ▾ [ ]`
or whatever you choose), where each is used, and their colour and size. "Add
box-drawing" is not implementable; `┤` at 13.5px 3270 in muted at 42% is.

**8. Degradation.** What happens at: a 200px-wide sidebar; a 40-character tab
title; twelve open tabs; a tab group with exactly one icon tab (the current
build gives that a lot of empty strip and it looks broken); a pane with no
content. These are where it falls apart in the real app, not in a mockup.

**9. Motion.** What moves, its amplitude, period and easing, and what it
degrades to under `prefers-reduced-motion`. If the answer is "nothing moves",
say that — it's a legitimate answer and cheaper to build.

**10. A build order.** Ranked: what to change first for the largest gain, and
what is polish. If I only get three changes in, tell me which three.

### Also

- **Flag anything CSS-on-Obsidian's-DOM cannot do.** I cannot add markup. If a
  proposal needs an element that isn't there, say so and give the fallback.
- **Anything you think is actively wrong**, bluntly. Nothing is precious. If
  "CRT modules in a rugged case" is itself the problem, say so and propose
  what actually delivers the owner's intent.

## Hard limits the spec must not violate

These are load-bearing in the implementation and a proposal that breaks them
cannot be built:

- Editable text is never made transparent, never given a `background-clip`,
  never filtered. The caret, selection, IME composition and clipboard must
  behave exactly as the app intends.
- No overlay may intercept a pointer.
- The body-text raster is a `multiply` overlay on live text and is out of
  scope here — do not redesign it, but don't propose anything that fights it.

The single test every proposal has to pass: at a glance, and at 20% zoom, does
this read as **one machine** — a terminal whose interface is drawn on its own
tubes — rather than as a dark app with a scanline filter?
