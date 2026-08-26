# Third-party notices

Afterimage incorporates or derives from the works listed below. Each retains
its own licence; nothing here is superseded by Afterimage's MIT licence.

---

## 1. Bureau — the work Afterimage derives from

**Afterimage is a modified derivative of Bureau.** Bureau's implementation is
the starting point of this theme's `theme.css`, and the majority of its
application coverage, layout architecture and settings engine remain
Sonophage's work.

| | |
|---|---|
| Project | **Bureau** |
| Author | **Sonophage** |
| Source | <https://github.com/Sonophage/Bureau> |
| Version used | **2.16.0**, commit `155a94966b29f84616ac866ef5b29677d40d0ae1` |
| Licence | **MIT** |

Bureau's MIT licence text and Sonophage's copyright notice are preserved
verbatim in [`LICENSE`](LICENSE), where Afterimage's copyright is added
alongside rather than in place of it. Full details of what was kept and what
was replaced are in [`UPSTREAM.md`](UPSTREAM.md).

```
MIT License

Copyright (c) 2026 Sonophage

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Bureau in turn credits **Border by Akifyss** for the concept behind its
new-tab icon-row treatment, which Afterimage inherits. See
<https://github.com/Akifyss/obsidian-border>.

---

## 2. Bundled fonts

Summarised here; the full record — sources, versions, exact files, and
whether Afterimage modified anything — is in
[`FONT_LICENSES.md`](FONT_LICENSES.md).

### WebPlus IBM VGA 8x16 / 9x16 — CC BY-SA 4.0

From **The Ultimate Oldschool PC Font Pack v2.2**, © 2016–2020 **VileR**,
<https://int10h.org/oldschool-pc-fonts/>.

Licensed under the Creative Commons Attribution-ShareAlike 4.0 International
License, <https://creativecommons.org/licenses/by-sa/4.0/>. Full text:
[`fonts/oldschool-pc-font-pack/LICENSE.txt`](fonts/oldschool-pc-font-pack/LICENSE.txt).

**Afterimage ships these files unmodified**, byte-for-byte as distributed by
VileR. As no Adapted Material is produced, the ShareAlike condition attaches
to the font files alone and does not extend to the rest of `theme.css`.

Provided "as-is", without warranties, as set out in §5 of that licence.

### 3270 — BSD 3-Clause

© 2011–2022 Ricardo Banffy; © 1993–2011 Paul Mattes; © 2004–2005 Don Russell;
© 2004 Dick Altenbern; © 1990 Jeff Sparkes; © 1989 Georgia Tech Research
Corporation (GTRC), Atlanta, GA 30332. All rights reserved.
<https://github.com/rbanffy/3270font>

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the conditions in
[`fonts/3270font/LICENSE.txt`](fonts/3270font/LICENSE.txt) are met — including
that neither the names of the copyright holders nor of their contributors may
be used to endorse or promote derived products without prior written
permission. Afterimage names them for attribution only.

Afterimage transcodes the released `.ttf` to `.woff2`; no other change.

### Courier Prime — SIL OFL 1.1

© 2015 The Courier Prime Project Authors,
<https://github.com/quoteunquoteapps/CourierPrime>. Full text:
[`fonts/courier-prime/OFL.txt`](fonts/courier-prime/OFL.txt).

Inherited unmodified from Bureau, which bundled it under the same licence.

---

## 3. cool-retro-term — reference only, no code used

**cool-retro-term** by Filippo Scognamiglio (Swordfish90),
<https://github.com/Swordfish90/cool-retro-term>, is licensed under the
**GNU General Public License v3**.

Afterimage used it strictly as a **visual and behavioural reference**, and to
read the factual definition of its IBM-DOS preset so that Afterimage's
default could be grounded in the real settings rather than guessed from the
preset's name.

**No cool-retro-term source — QML, C++, GLSL shaders, assets or
configuration — has been copied, translated, adapted or incorporated into
Afterimage.** Afterimage is CSS; its effects were written from scratch
against the browser's rendering model and share no implementation with
cool-retro-term's shader pipeline. Afterimage is therefore not a derivative
work of cool-retro-term and the GPL does not attach to it.

Fonts *bundled by* cool-retro-term were not assumed to share its licence.
Each was evaluated under its own terms, and the two Afterimage uses were
obtained from their own upstream projects rather than from cool-retro-term.

---

## 4. Obsidian

Afterimage is a theme for **Obsidian** (<https://obsidian.md>), by Dynalist
Inc. Afterimage is not affiliated with or endorsed by Dynalist Inc. It
targets Obsidian's public CSS variables and DOM, and bundles no Obsidian
code. "Obsidian" is used nominatively, to say what this theme is for.

Style Settings integration targets the **Style Settings** plugin by
mgmeyers, <https://github.com/mgmeyers/obsidian-style-settings> (MIT). The
plugin is not bundled; Afterimage only publishes a settings block it can read.
