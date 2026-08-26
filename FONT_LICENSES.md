# Font licences

Every typeface Afterimage bundles is listed here with its authoritative
source, the exact file and version shipped, its licence, and whether that
licence permits redistribution and modification. **A font whose licence
could not be determined is not bundled.**

All font files live under [`fonts/`](fonts/) as real, inspectable binaries
with their licence text alongside. The build (`npm run build`) embeds them
into `theme.css` as base64 `data:` URIs; nothing is fetched at runtime.

Run `npm run audit:fonts` to re-verify every claim on this page against the
files actually present — it reads each font's own internal name table rather
than trusting this document.

---

## 1. WebPlus IBM VGA 8x16 · WebPlus IBM VGA 9x16

The IBM-DOS voice. This is the same typeface cool-retro-term uses for its
IBM-DOS-derived preset (see [§ cool-retro-term](#relationship-to-cool-retro-term)).

| | |
|---|---|
| Family | **WebPlus IBM VGA 8x16** / **WebPlus IBM VGA 9x16** |
| Part of | The Ultimate Oldschool PC Font Pack |
| Version | **v2.2** (2020-11-21) |
| Author | **VileR** |
| Copyright | © 2016–2020 VileR |
| Authoritative source | <https://int10h.org/oldschool-pc-fonts/> |
| File downloaded | `oldschool_pc_font_pack_v2.2_web.zip` |
| Files shipped | `fonts/oldschool-pc-font-pack/WebPlus_IBM_VGA_8x16.woff`<br>`fonts/oldschool-pc-font-pack/WebPlus_IBM_VGA_9x16.woff` |
| Licence | **CC BY-SA 4.0** — [`fonts/oldschool-pc-font-pack/LICENSE.txt`](fonts/oldschool-pc-font-pack/LICENSE.txt) |
| Licence URL | <https://creativecommons.org/licenses/by-sa/4.0/> |
| Redistribution | **Permitted**, with attribution and licence notice (§3(a)). |
| Modification | Permitted, but any *Adapted Material* must be released under CC BY-SA 4.0 or a compatible licence (§3(b)). |
| **Modified by Afterimage?** | **No.** Shipped byte-for-byte as downloaded. |

### Why the `.woff` files are shipped unmodified

The pack's `_web` distribution already ships WOFF, so Afterimage needs no
conversion, no subsetting and no re-hinting. The files in `fonts/` are
byte-identical to the ones inside the official archive. Nothing Afterimage
does to this font produces *Adapted Material*, so CC BY-SA's ShareAlike
condition attaches to the font only — it does not reach `theme.css`, the
rest of which stays MIT. Base64-embedding an unmodified file is
redistribution, not adaptation.

Keeping the font unmodified is a deliberate constraint. Converting to WOFF2
would save roughly 7 KB and would still be permitted (CC BY-SA §2(a)(4)
treats format conversion as a technical modification rather than adaptation),
but 7 KB is not worth introducing an argument.

### Why "WebPlus" and not "Web437"

The pack ships two encodings of each font. **This distinction is not
cosmetic and choosing wrongly would have broken the theme:**

| | Web437 (code page 437) | WebPlus (extended Unicode) |
|---|---|---|
| Glyphs | 289 | 782 |
| Curly quotes `’ “ ”` | **absent** | present |
| Em dash `—`, en dash `–` | **absent** | present |
| Ellipsis `…` | **absent** | present |

Obsidian's smart-punctuation and ordinary prose produce all of these
constantly. Web437 would have rendered them as fallback-font glyphs in a
completely different typeface, mid-word. Verified with `fontTools` against
the actual files, not from a specimen image — `npm run audit:fonts` re-runs
that check.

### 8x16 or 9x16

Both are shipped and both are exposed in Style Settings. They differ only in
advance width:

- **8x16** — advance exactly `0.5em`. cool-retro-term's own choice. Denser.
- **9x16** — advance exactly `0.5625em`. The authentic VGA 80×25 text cell,
  which used a 9-pixel-wide box. Slightly airier and easier for long prose.

Afterimage defaults to **9x16** for body prose and **8x16** for display
lettering. Both have `unitsPerEm = 1600` over a 16-pixel cell, i.e. exactly
**100 font units per pixel row**, which is what makes the glyph raster line
up (see [`experiments/README.md`](experiments/README.md)).

---

## 2. 3270

The readable terminal voice, and Afterimage's UI/technical label face in
every preset.

| | |
|---|---|
| Family | **3270** |
| Project | 3270font — "a font for the nostalgic" |
| Version | **v3.0.1** (release `3270_fonts_d916271.zip`, 2022-07-29) |
| Authors | **Ricardo Banffy** and the 3270font Authors; derived from the x3270 font, itself from Georgia Tech's 3270tool, hand-copied from an IBM 3270 terminal |
| Copyright | © 2011–2022 Ricardo Banffy; © 1993–2011 Paul Mattes; © 2004–2005 Don Russell; © 2004 Dick Altenbern; © 1990 Jeff Sparkes; © 1989 Georgia Tech Research Corporation |
| Authoritative source | <https://github.com/rbanffy/3270font> |
| File shipped | `fonts/3270font/3270-Regular.woff2` |
| Source file | `fonts/3270font/3270-Regular.ttf` (as released upstream) |
| Licence | **BSD 3-Clause** — [`fonts/3270font/LICENSE.txt`](fonts/3270font/LICENSE.txt) |
| Redistribution | **Permitted**, retaining the copyright notice, conditions and disclaimer. |
| Modification | **Permitted**, on the same terms. |
| **Modified by Afterimage?** | **Yes — format only.** The released `.ttf` was transcoded to `.woff2` with `fontTools`. No glyph, metric, hinting or name-table change; the upstream copyright strings survive inside the file. The original `.ttf` is shipped alongside so the transcode can be verified. |

3270 is an **outline** font, not a bitmap one, so unlike the IBM VGA faces it
stays crisp at the small, non-integer sizes UI labels need (10.5–12 px).
That is why it, and not the pixel font, carries the technical labels.

The BSD licence's third clause forbids using the authors' names to endorse
or promote derived products. Afterimage names them only as attribution here
and in `THIRD_PARTY_NOTICES.md`, which that clause permits.

**Note on the cool-retro-term copy:** cool-retro-term bundles a *Nerd
Fonts–patched* build (`3270NerdFontMono-Regular.ttf`, 2.5 MB). Afterimage
deliberately uses the **unpatched upstream release** instead — 40× smaller,
and it avoids inheriting the patched glyphs' separate licensing.

---

## 3. Courier Prime

Inherited from Bureau and retained for the *Typewriter* preset, in
acknowledgement of the theme Afterimage derives from.

| | |
|---|---|
| Family | **Courier Prime** |
| Version | **3.018** |
| Author | The Courier Prime Project Authors (Quote-Unquote Apps) |
| Copyright | © 2015 The Courier Prime Project Authors |
| Authoritative source | <https://github.com/quoteunquoteapps/CourierPrime> |
| Files shipped | `fonts/courier-prime/CourierPrime-{Regular,Bold,Italic}.{latin,ext}.woff2` (6 faces) |
| Licence | **SIL OFL 1.1** — [`fonts/courier-prime/OFL.txt`](fonts/courier-prime/OFL.txt) |
| Redistribution | **Permitted**, including bundling, with the copyright and licence notice retained. |
| Modification | Permitted; a modified font may not use the reserved family name. |
| **Modified by Afterimage?** | **No.** These are the exact WOFF2 subsets Bureau shipped, extracted unchanged from Bureau's `theme.css` into files. Subsetting was done upstream (Google Fonts latin / latin-ext split), not by Afterimage. |

Version and copyright were read from each file's own OpenType `name` table
rather than taken on trust from Bureau's source comment; the comment proved
accurate.

Courier Prime ships **no bold-italic face** — Bureau shipped six faces, not
eight. Bold-italic is therefore synthesised by the browser. Afterimage keeps
that behaviour and styles bold-italic as a graphical stamp, where the
synthesis is not visible as a defect.

---

## Removed: Urbanist

Bureau embedded **Urbanist** v1.303 (© 2021 The Urbanist Project Authors,
SIL OFL 1.1, <https://github.com/coreyhu/Urbanist>) as its UI label face, in
eight faces totalling ~173 KB.

Afterimage **removes it entirely**. Urbanist is a geometric humanist sans —
the correct choice for Bureau's identity and the wrong one for a terminal.
Its role passes to 3270, which is cohesive with the rest of the type system
and 111 KB smaller. No Urbanist data remains in the repository or in
`theme.css`; `npm run audit:fonts` fails the build if any reappears.

---

## Relationship to cool-retro-term

cool-retro-term was used as a **visual and behavioural reference only**.

Afterimage's IBM-DOS preset is grounded in cool-retro-term's actual profile
definition rather than in the profile's name. Read from
`app/qml/ApplicationSettings.qml` at its current `main`, the preset shown as
*IBM DOS* in cool-retro-term's README is defined as:

```json
{ "fontName": "IBM_VGA_8x16", "rasterization": 1, "bloom": 0.2,
  "burnIn": 0.1, "rgbShift": 0.1, "flickering": 0.1, "chromaColor": 0.5,
  "fontColor": "#c0c0c0", "backgroundColor": "#000000", "lineSpacing": 0.1,
  "screenCurvature": 0.3, "contrast": 1.0, "brightness": 0.6 }
```

where `rasterization: 1` is `scanline_rasterization` in that file's own enum.
`fontName: "IBM_VGA_8x16"` resolves through `app/qml/resources.qrc` to
`fonts/oldschool-pc-fonts/PxPlus_IBM_VGA_8x16.ttf` — the same VileR font
family Afterimage bundles, taken from VileR's own distribution rather than
from cool-retro-term's copy.

Those numbers set Afterimage's default effect strengths: modest bloom, a
slight burn-in afterimage, a slight RGB registration error, and — the
important one — **scanline rasterisation applied to the glyphs**, not laid
over them.

**No cool-retro-term code is present in Afterimage.** Its QML, C++ and GLSL
are GPL-licensed and none of it was copied, translated or adapted. The CSS
techniques in `experiments/` and `theme.css` were written from scratch;
CSS cannot express a fragment shader in any case. Fonts bundled *by*
cool-retro-term were each evaluated under their own licence, as this
document records — none was assumed to share the application's licence.

---

## Summary

| Font | Licence | Redistribute | Modify | Modified here | Shipped |
|---|---|---|---|---|---|
| WebPlus IBM VGA 8x16 / 9x16 | CC BY-SA 4.0 | Yes, with attribution | Yes, ShareAlike | **No** | 2 × 22 KB WOFF |
| 3270 | BSD 3-Clause | Yes | Yes | Format only | 62 KB WOFF2 |
| Courier Prime | SIL OFL 1.1 | Yes | Yes (not the name) | **No** | 6 × ~16 KB WOFF2 |
