# Upstream

Afterimage is a **modified derivative** of the **Bureau** Obsidian theme by
**Sonophage**. It is not a clean-room reimplementation and it is not an
original work: it began as Bureau's actual working `theme.css` and evolved
from there. Bureau's architecture — the way the theme reaches into every
corner of the application — is Sonophage's, and remains Sonophage's.

## Fork record

| | |
|---|---|
| Upstream project | **Bureau** |
| Upstream repository | <https://github.com/Sonophage/Bureau> |
| Upstream author | **Sonophage** (<https://github.com/Sonophage>) |
| Upstream licence | MIT — see [`LICENSE`](LICENSE) |
| Pinned upstream commit | `155a94966b29f84616ac866ef5b29677d40d0ae1` |
| Upstream version at fork | **2.16.0** |
| Date forked | **2026-08-26** |
| Local baseline tag | `bureau-2.16.0-baseline` |
| Fork branch | `afterimage/main` |
| Derivative name | **Afterimage** |
| Derivative author | Mike Thompson |

The upstream git history is preserved in this repository. The original
`origin` remote was renamed to `upstream`, so `git log bureau-2.16.0-baseline`
shows Bureau's own history unmodified, and `git diff bureau-2.16.0-baseline`
shows exactly what Afterimage changed.

Afterimage does not track upstream automatically. Any future merge from
Bureau is a deliberate, reviewed act.

## What Afterimage preserves from Bureau

Afterimage keeps Bureau's application architecture more or less intact. The
following systems are Bureau's design and engineering, carried forward and
retuned rather than rebuilt:

- **Whole-application coverage.** Bureau styles far more than the editor:
  menus, modals, the command palette, suggestion lists, notices, settings,
  Canvas, Graph, Bases, search, the status bar, tooltips and the ribbon.
- **The framed central editor.** The note as a distinct card floating on a
  desk, with perimeter rails, registration marks and edge architecture.
- **The heading and inline-title plate system.** Headings as graphical
  objects with their own substrate, rather than merely larger text.
- **First-class properties architecture.** The frontmatter block as a
  designed panel with stamped key labels and distinct value fields.
- **Decisive tab and file-selection states.** Inverted inactive tabs, a
  solid raised active tab, and a stamped selected row in the file tree.
- **The dual-palette engine.** Independent per-appearance and per-pane
  palettes, the inverted-editor split, base-hue tinting and black/white
  level controls.
- **The Style Settings surface.** Bureau's deep, well-documented settings
  block, its effects-mode preset layer, and its habit of exposing every
  lever it actually implements.
- **The effects framework.** Atmosphere layers (grain, glow, halo,
  vignette), the animation suite, and the CRT scanline/phosphor layer that
  Afterimage builds directly upon.
- **Mobile, print and reduced-motion safeguards.**
- **Scrollbar, resize-handle and card-geometry controls.**
- **The release tooling** (`release.py`), retained and repointed.

Where Afterimage changed these, it changed their *material and colour*,
not their existence.

## What Afterimage replaces

The identity, and the typography that carries it:

- **The case-file identity is gone.** Bureau's premise is a noir government
  dossier — "Disco Elysium meets Control". Every trace of that framing has
  been removed: the Bureau name, dossier and registry language, Federal
  Bureau of Control / Magnus / Deus references, classified-and-redacted
  prose, the government-agency artwork, and the README's in-character voice.
- **The palette is re-founded.** Bureau's warm manila-and-Control-red case
  file becomes a cold blue-black chassis with cool phosphor ivory text and
  an electric cobalt signal, expressed as a semantic palette rather than a
  single accent swapped throughout.
- **The typography is re-founded.** Bureau's Courier Prime typewriter voice
  becomes an IBM-DOS-derived terminal voice. Courier Prime is retained as
  the *Typewriter* preset, in acknowledgement of where it came from.
- **CRT rendering is promoted from an effect to the identity.** Bureau
  offers scanlines and phosphor glow as an overlay *on top of* ordinary
  text. In Afterimage the glyphs themselves participate: the raster is
  clipped into the characters, the bloom and afterimage belong to the
  glyph, and the heading plate and its lettering read as one display
  object. This is the substantive creative change.
- **Redaction motifs are replaced.** Bureau's censor-bar link chips and
  file stamps become phosphor traces and cool display labels.
- **Invented terminology is not reintroduced.** Real application concepts
  keep their real names: Properties, Backlinks, Calendar, File Explorer.

## Licence

Bureau is MIT-licensed and that licence permits this derivative. Bureau's
`LICENSE` file and Sonophage's copyright notice are preserved verbatim, and
Afterimage's own copyright is added alongside rather than replacing it. See
[`LICENSE`](LICENSE) and [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
