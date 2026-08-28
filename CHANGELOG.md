# Changelog

All notable changes to Afterimage. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/); versions follow
[Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Changed

- **The chrome is one CRT in a machined case.** Two design rounds landed in
  sequence. `docs/chrome-spec/CHROME-SPEC.md` first replaced the flat panels
  with five countersunk screen modules; `docs/chrome-spec/DESIGN-MODEL.md`
  then reversed the parts of that which no real machine ever had. The model's
  falsification test — *if a change would be impossible on a real cathode-ray
  tube, it is the wrong change* — is now the section's governing rule. End
  state:
  - **One tube.** `.workspace` is the glass: a single recessed aperture
    (countersink wall dark at the top, lit at the foot, casting nothing) cut
    into a machined grey case. The ribbon is a fixed rail of moulded keys on
    the case; the status bar and vault switcher are drawn ON the glass — a
    protected status run bottom-right, a `VAULT` label with a reverse-video
    chip bottom-left. Panes divide the screen with drawn frames; the gutters
    between modules are gone.
  - **One phosphor** (`--after-phosphor`). Every lit chrome value derives
    from the coating, so a profile is a different **tube**, not a different
    accent: Cobalt is P4 blue-white, Amber P3, Ghost P1, Ultraviolet a badly
    converged violet-blue, Mono P4 white. Switching tube changes every lit
    pixel and no layout — asserted in `npm test`.
  - **Four intensities** — intensified / normal / protected / reverse video,
    the real IBM field attributes, replace the seven-step C1–C7 grey ramp
    (the old names survive as aliases for now). Selection is **reverse
    video** everywhere: the active tab and the current tree row are plates of
    the coating carrying tube-coloured letters with halation, and the active
    tab of an unfocused group is the same plate driven to protected.
  - **The glyphs emit** (law 1). Glow is `text-shadow` on characters —
    inherited at normal intensity by everything on the glass, driven hard on
    the pane title, absent from protected fields and reverse plates. The
    centre bloom the tube background used to carry is deleted: glow on a
    panel is how a CRT theme becomes a dark theme with a filter.
  - **One character generator.** Chrome text is one face; vault file names
    no longer switch to the body face for "content" flavour.
- **Light mode inverts intensity, not structure**: same aperture, paper
  glass, dark reverse plates, and no glow — paper does not bloom.

### Added

- **The rest of the reference picture**: the dock tab IS the pane title in
  sidebars (a reverse chip carrying `attr(aria-label)`, with `.view-header`
  suppressed there); bracketed sidebar toggles; `^N New  ^F Find` set into
  the file explorer's bottom rule as a knockout; the properties panel typed
  per the annotation (protected keys, plain values, reverse multitext chips,
  a dashed field-extent on the empty row, `[ Add property ]`); the refresh
  bar (132px band, ~9s) and mains flicker on the tube overlay; and phosphor
  **decay** — selection plates cool over 600ms on the way out only, which is
  the thing the theme is named for.
- **`lint-phosphor.mjs`** wired into `npm run lint`: no chrome colour off
  the phosphor hue (each profile judged against its own declared coating;
  chassis metal, paper palettes and content semantics documented as exempt),
  and one chrome typeface.
- **Rendered phosphor-law tests** in `npm test`: the greyscale gap between
  active and inactive tabs, the tube-switch derivation check, and the
  layout-invariance check (37 assertions total).

### Removed

- The five per-pane screen modules, their gutters, and the letterbox status
  tube — collapsed into the one aperture.
- The tube background's centre bloom (law 1) and the case stipple (the
  reference case is smooth machined metal).
- The two Style Settings sliders for the drifting refresh bar. The bar now
  uses the design model's fixed 132px / ~9s treatment on the tube overlay;
  the animation test allows that overlay to move while chrome elements stay
  still.

### Fixed

- **Seven confirmed findings from an adversarial six-lens review** of the
  rework (`docs/chrome-spec/REVIEW-BACKLOG.md` holds the unverified rest):
  the accent surviving in three chrome rules (bracketed ON-state, the dock
  lens — now the reference's own fixed-hue lamp — and the resize grip); two
  intensities smuggled in through the frame tokens (focused frames are now
  literally driven normal); the Rolodex hover/active transforms still
  scaling tabs and rows on a tube that has no depth; the power-on animation
  re-parenting the fixed rail (it now boots the whole machine from
  `.app-container`, so nothing snaps); Bureau's card-era pane padding
  double-insetting every frame; popout windows reserving a rail they don't
  have; and the Screen-glow slider description promising a bloom that no
  longer exists.
- **Obsidian's tab-corner curves clip pseudo-elements** with `clip-path` —
  shipped app.css fact the harness never modelled, which rendered the merged
  dock-tab title as a microscopic sliver in the real app while the harness
  showed it perfectly. The label resets every corner-curve property, and the
  harness reset now models the curves.
- The module raster sat **under** the content, where it had nothing bright to
  subtract from. It is now a `multiply` layer over the one glass.
- Twelve open tabs no longer collapse every label into a row of identical
  file icons; tabs hold a 78px floor and the strip scrolls.
- Bureau's split borders and the editor card's bottom fade painted seams and
  phantom surfaces on the glass; both are gone under the one-tube chrome.
- Both DOM harnesses now carry `after-cards` and no longer invent
  `.view-header` elements in side-dock leaves (verified absent in the live
  app).

---

## [0.1.0] — 2026-08-26

First release. Forked from **[Bureau](https://github.com/Sonophage/Bureau)
v2.16.0** by **Sonophage** at commit `155a949`, MIT-licensed. See
[`UPSTREAM.md`](UPSTREAM.md) for the full fork record.

### Added

- **CRT glyph rendering.** The theme's reason to exist. A `multiply` raster on
  every live-text surface, so the stripes appear only where light is emitted —
  inside the glyphs — and a clipped glyph raster on display text via per-layer
  `background-clip`, so a heading's plate and its lettering share one grid and
  read as a single display object.
- **Bloom, afterimage and chromatic misregistration**, composed into one
  `text-shadow` stack. Defaults follow cool-retro-term's IBM-DOS profile.
- **Three typography presets** — Typewriter (Courier Prime, kept from Bureau,
  and the default), IBM DOS (WebPlus IBM VGA 9x16 / 8x16), and 3270. The
  display lettering stays on the pixel face in every preset.
- **Emphasis by brightness**, since these terminal fonts ship one weight and
  synthetic bold smears them.
- **Six display profiles** — Cobalt, Amber, Ghost, Ultraviolet, Mono, Custom.
  Switching never destroys the user's Custom settings.
- **Six distinct heading silhouettes**, rather than one plaque at six sizes.
- **An editing-safety layer**, declared last, guaranteeing that no optical
  effect can break the caret, selection, IME, spellcheck or the clipboard.
- Original raster-test-pattern new-tab artwork (2.8 KB of SVG).
- Tooling: `build`, `lint`, `audit`, `test`, `shots`, `install:vault`,
  `vault:sync`, plus a DOM harness and a Live Preview harness.

### Changed

- **Palette** re-founded: cold blue-black chassis, cool phosphor ivory, an
  electric cobalt signal, and a cool display-film light mode. No sepia.
- **Accent restraint.** Bureau outlined every editable property field in the
  accent at rest and coloured every section legend with it. The accent now
  means selection, focus, current state and significant interaction — nothing
  else.
- **Inline motifs** replaced: links are phosphor traces, unresolved links are
  afterimages, strikethrough is struck-and-still-readable rather than a censor
  bar you must hover to read.
- **Callouts and table headers** became dark panels and structural headers.
  A light slab inside a dark CRT is incoherent, and `multiply` only bites
  bright pixels, so both were being heavily striped.
- **Reduced motion is honoured by default**, without Style Settings installed.
  Bureau gated it on a class only the plugin adds.
- Reading measure 800px → 720px (about 80 characters, a VGA text screen).
- CRT text glow default 55 → 22, since it now layers on a bloom Bureau lacked.
- Namespace migrated from `--bu-*` / `bu-*` to `--after-*` / `after-*`.

### Removed

- Bureau's case-file identity in full: the name, dossier and registry
  language, Federal Bureau of Control / Magnus / Deus references, the
  classified-and-redacted prose, the government-agency artwork, and the
  README's in-character voice.
- **Urbanist** (8 faces, ~173 KB). A geometric humanist sans is the wrong
  voice for a terminal; 3270 carries the labels instead.

### Fixed

- Rails did not render at all: a literal `#` in the re-encoded SVG data URI
  acted as a fragment delimiter and truncated the payload.
- `--bu-magnus` → `--bu-green` during the rebrand collided with Bureau's
  existing `--bu-green`, silently retargeting the accent preset.
- Print output: display text is painted by a background image with
  `color: transparent`, and browsers do not print background graphics — every
  heading, the inline title and every property key printed **blank**.

### Also in 0.1.0, after first-look feedback at 1×

The theme was being judged at 2–4× device pixel ratio during development and
looked very different on a 1080p panel at 1×. Four things changed:

- **Courier Prime is the default body face**, not the IBM VGA pixel font.
- **The plate and ink rasters were split** (`--after-display-raster` /
  `--after-ink-raster`). They were one number, and a 2px band that gives a
  32px title its structure shreds an 11px property legend. Small labels now
  take no ink raster at all, and moved from the pixel face to 3270.
- **Nothing is inverted any more.** Bureau filled inactive tabs and the whole
  status bar with the editor's *text* colour, putting pale slabs across a dark
  machine. Every tab and the status bar are now dark; the active tab is the
  one that is *lit* — bright label, hard accent edge, a glow beneath it.
- **The highlight moved to amber** and the accent to a cooler, more luminous
  phosphor blue. On-accent ink flipped from white to dark: white failed AA on
  eight of the nine accent presets (1.33:1 on P1 green), dark clears it on all
  nine.

### Bundle

`theme.css` 729 KB → 614 KB, despite adding three typefaces.
