# Changelog

All notable changes to Afterimage. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/); versions follow
[Semantic Versioning](https://semver.org/).

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
- **Three typography presets** — IBM DOS (WebPlus IBM VGA 9x16 / 8x16), 3270,
  and Typewriter (Courier Prime, kept from Bureau).
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

### Bundle

`theme.css` 729 KB → 614 KB, despite adding three typefaces.
