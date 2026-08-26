# Prompt for Claude Design

Paste everything below the line. Attach the screenshots noted at the end.

---

I need a **visual design specification** for an Obsidian theme called
**Afterimage**. I don't need code — I need decisions, with values, precise
enough that an engineer can implement them without guessing. The
implementation has been converging badly because it's been reacting to
individual complaints instead of following a spec. That's what I want from
you: the spec.

## What the theme is

A CRT-terminal theme for Obsidian (a Markdown notes app). It's an explicit
derivative of an existing theme called **Bureau**, whose architecture it keeps
and whose "noir government case-file" identity it replaces with an
IBM-DOS-derived cyber-retro CRT identity.

It should feel like an advanced personal workstation from a plausible
alternate 1990s — an IBM terminal that kept growing until it became a
knowledge machine. A serious tool with just enough theatre to be fun, that
stays interesting while completely motionless.

It must **not** feel like: a DOS emulator pasted over the app, a fake command
line, a game HUD, synthwave, a modern dashboard with scanlines, or a generic
dark theme.

## The one non-negotiable idea

Most "CRT" themes lay a striped film over finished text, so the type reads as
sitting *behind a screen door*. Afterimage makes **the glyphs themselves
participate in the raster**:

- On live text, a striped overlay in `mix-blend-mode: multiply`. Multiply is
  proportional, so on a near-black surface it takes ~3/255 off the background
  and ~66/255 off the glyphs — the stripes appear only where light is emitted.
- On display text (title, H1–H3, property legends), the raster is clipped into
  the letterforms via per-layer `background-clip: text, padding-box`, so a
  heading's plate and its lettering share one grid and fuse into one object.

Any direction you propose has to preserve that. It's the reason the theme
exists.

## Current state — real values, not adjectives

**Dark palette**
| Role | Value |
|---|---|
| chassis / window ground | `#020810` |
| note surface | `#0a141d` |
| panel surface | `#0f1c27` |
| raised | `#162632` |
| border | `#22384a` |
| border bright | `#33566c` |
| body ink | `#cbe0f0` |
| muted ink | `#8ba6bd` |
| faint ink | `#6d879c` |
| **inverted plate** | `#b9cbd8` |
| **inverted plate ink** | `#06121c` |
| primary signal (cobalt) | `#2e9dff` |
| attention (amber) | `#ffb000` |
| live (mint) | `#4ee6c0` |

**Type** — three fonts ship, all monospace or terminal:
- **Courier Prime** — body/prose. Default. Has real bold + italic.
- **IBM VGA (WebPlus 9x16 / 8x16)** — display face: inline title, H1–H3,
  property legends. A *bitmap* font on a 16px cell: only crisp at 16px and
  multiples. Single weight, no italic.
- **3270** — technical labels, status bar, chips. Outline font, scales freely.
  Single weight, no italic.

Sizes now: body 16px, UI/file-tree 14.5px, technical label 13.5px, property
legend 15px, property value 15px. Spacing is a 4px scale; icons a 30px box.

**Bold is brightness, not weight** — the terminal faces have one weight, and
synthetic bold smears a pixel font, so bold = full-brightness ink plus a small
bloom. That constraint is fixed.

## The specific decisions I need from you

### 1. Inverted plates — the important one

A light plate carrying dark ink is a **signature** of this theme, inherited
from Bureau. It currently appears on: the inline title, H1–H3, property
legends, and a few chips.

I previously had it on inactive tabs, the status bar and tab hover as well, and
the owner's verdict was that it was "a shit show" — so I removed it from those
places entirely. That was an over-correction: the complaint was about
*execution*, not the idea. I need it back as a governed system.

**Give me a rule for when inversion is used and when it isn't**, and say why.
Consider that:
- inverted plates are the theme's strongest recognition cue at a glance;
- small inverted text (11–13px, uppercase, tracked) was genuinely hard to read;
- large inverted display text works well;
- a full-width inverted status bar across a dark window read as a pale slab.

Propose the rule, the size threshold, and which specific surfaces qualify.

### 2. The window ground

The owner's note: *"I'm not sure the background color for the whole window
really helps the UI pop."* Panels are only slightly lighter than the chassis,
so they don't separate strongly. Options are: drop the ground toward black,
lift the panels, separate by edge and shadow instead of by value, or add tint
or texture to the ground. Pick one and give values for the whole ramp.

### 3. Tabs

Every tab is currently a dark surface; the active one has a bright label, a
2px accent top edge and a glow. It reads as fine but unremarkable, and the
owner called the earlier version "less than inspiring". Propose a treatment
that is unmistakable at a glance and at 20% zoom, consistent with §1.

### 4. Tags and inline pills

Currently a mint outline chip at 0.88em in 3270 — hard to read. Options
considered: bigger with a faux-bold double-strike, the display face, an
inverted legend chip, a solid signal fill, or no chip with a phosphor
underline. Pick one, with values.

### 5. Density and scale

Confirm or correct the type and spacing scale above. The owner has said
repeatedly that things are "too small", specifically the 3270 technical
labels. Give me a scale where each step has a stated job.

## What I want back

1. A **table of colour tokens** with hex values for dark mode, and the
   light-mode counterparts.
2. A **type scale** — each size, which face, which elements, and its job.
3. An **inversion rule** — a stated principle plus the list of surfaces.
4. **Per-component specs** for: tabs (3 states), file-tree rows, property
   panel, tags/pills, status bar, headings H1–H6.
5. For each, one sentence of *why* — the principle, so future decisions can
   be derived rather than re-litigated.
6. Anything in the current state you think is actively wrong, and what to do
   instead. Be blunt; the current version is not precious.

Constraints to respect: it's CSS on someone else's DOM, so no new markup; it
has to work in dark **and** light mode; it has to stay readable for 8-hour
working days; and WCAG AA (4.5:1) on body text is a hard floor.

## Screenshots attached

- Full window at 1× — current state
- File-explorer sidebar, zoomed
- Tabs and header, zoomed
- Property panel, zoomed
- Four window-ground options I generated (A current, B true black, C slate,
  D edge-separated)
