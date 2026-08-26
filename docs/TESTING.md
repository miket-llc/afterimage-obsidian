# Testing record

What was actually tested, how, and — just as importantly — **what was not**.
Nothing on this page is claimed unless it was run.

---

## How Afterimage is tested

Obsidian has no headless mode, so the theme is exercised three ways:

1. **DOM harness** — [`test/harness/index.html`](../test/harness/index.html) and
   [`editor.html`](../test/harness/editor.html) reproduce Obsidian's real DOM
   using the class names the theme actually targets, plus
   [`reset.css`](../test/harness/reset.css), a stand-in for the parts of
   Obsidian's own `app.css` that *consume* theme variables. Without those, the
   harness renders unstyled text — it is Obsidian, not the theme, that applies
   `--text-normal` to `body`. The Live Preview harness uses CodeMirror 6's own
   base-theme values.
2. **Real Chromium**, driven by Playwright through the system Chrome — the same
   engine family as Obsidian's Electron. Deterministic viewport, device scale
   factor, colour scheme, reduced-motion and print media emulation.
3. **Real Obsidian**, by installing into a vault and looking at it.

> The harness is a faithful DOM reproduction, not Obsidian. Anything marked
> *harness only* below has not been seen inside the app.

---

## Automated

| Command | What it checks |
|---|---|
| `npm run build` | Embeds fonts and artwork; fails on manifest / package.json / versions.json disagreement or a stale `theme.css`. |
| `npm run lint` | Brace balance, unterminated comments, Style Settings YAML, duplicate ids, **inert controls**, remote and relative `url()`, data URIs broken by a literal `#`, `!important` budget, blanket animation rules, namespace residue. |
| `npm run audit` | Reads each bundled font's own OpenType `name` table (inflating WOFF) rather than trusting `FONT_LICENSES.md`; verifies every embedded family is declared, attribution files, version consistency, and that no QML/C++/GLSL is present. |
| `npm run test` | 18 behavioural checks in real Chromium (below). |
| `npm run check` | All of the above, plus fixture drift. |

All pass with **0 errors, 0 warnings**.

### Editing behaviour — `npm run test`

18 assertions, all passing:

- typing into a property value commits the characters
- property values have a visible caret colour and non-transparent text
- a focused row's key legend keeps a solid fill and an unclipped plate
- internal links, file-tree rows and tab headers all receive the pointer
  (no overlay sits on top of them)
- prose is selectable; a raster-rendered heading copies as real text
- editable lines in Live Preview are never transparent
- the editor raster exists on `.cm-editor::before`, uses a blend mode, and
  never takes pointer events
- **`.cm-content` keeps `position: static`**, so CodeMirror's caret and
  selection layers are not re-parented
- typing works in the Live Preview harness
- IME composition sits above the raster layer
- the active search match has a distinct background

### Refactor safety — `scripts/snapshot-styles.mjs`

Captures 21 computed properties across 40 selectors and their pseudo-elements,
in five modes (dark, light, Amber, 3270, Live Preview) — **249 element
snapshots**. Used to prove the namespace migration changed no rendering: before
and after were byte-identical.

---

## Verified in real Obsidian

Installed into a live vault (Obsidian 
on macOS, Style Settings installed, ~1,460 notes) and inspected directly.
Confirmed both before and after the namespace migration — Obsidian
hot-reloads `theme.css`, so the post-migration build was seen rendering in
the app too:

- ✅ Theme loads and applies; **Style Settings shows a single `AFTERIMAGE`
  panel**
- ✅ IBM DOS typography throughout — editor, file tree, tabs, status bar
- ✅ Inline title plate with raster through **plate and glyphs**, and the
  cobalt registration ghost
- ✅ **Reading View** — H1 plate and the H2 keyed band are visibly different
  silhouettes; level chips render
- ✅ **Live Preview** — heading plates with substrate raster, solid ink,
  caret visible
- ✅ Edge rails (`AFTERIMAGE` · `OBSIDIAN·MD` · `MARKDOWN`) and the right ruler
- ✅ File tree, selected-file state, tabs, breadcrumbs, tag pane, status bar
- ✅ Command palette
- ✅ Phosphor-trace links

---

## Verified in the harness only

Correct in real Chromium against a faithful DOM reproduction, but **not yet
seen inside Obsidian**:

- Light mode and split (inverted-editor) mode
- Amber, Ghost, Ultraviolet and Mono profiles
- 3270 and Typewriter presets
- H3–H6 treatments
- Callouts, tables, code blocks, blockquotes, footnotes, tasks
- Properties focus state and the empty-value row
- Print / PDF output
- Reduced motion (all three states)
- Backlinks pane and search results

## Not tested at all

Stated plainly rather than implied:

- **Canvas** — styled by inherited Bureau rules retuned to the new palette;
  never opened.
- **Graph view** — same.
- **Bases** — same.
- **Calendar / Dataview** — plugins not installed; their rules are inherited
  from Bureau and were only re-coloured.
- **Mobile layout.** The effect *gating* was verified programmatically (raster
  layers `display: none`, bloom 4px → 1.5px, ghost 0.28 → 0.12, title
  drop-shadow removed). The **layout** was not: Obsidian on a phone uses
  `.workspace-drawer` for sidebars, not the split panes the desktop harness
  renders, so squeezing the desktop harness to 390px is not representative.
- **Windows and Linux.** macOS only.
- **Actual printing.** Print *media emulation* was verified in Chromium; no
  page was sent to a printer or exported to PDF from Obsidian.
- **Stacked tab groups**, canvas cards, and the settings modal's horizontal nav.

---

## Known limitations

1. **Copying a heading yields upper-case text.** Reading-view headings carry
   `text-transform: uppercase` (inherited from Bureau), and Chromium's
   `Selection.toString()` returns transformed text. Copying from Live Preview
   or source mode gives the original case.
2. **The IBM DOS preset is only crisp at 16 px and its multiples.** It is a
   bitmap font on a 16-pixel cell. The size slider does not enforce this,
   because a user may legitimately want it anyway.
3. **The editor's raster is pane-anchored, not content-anchored**, so glyphs
   move through it while scrolling. This is deliberate — anchoring to
   `.cm-content` would require making it positioned, which can displace
   CodeMirror's caret and selection layers — and it is what a real tube does.
4. **The edge rail can collide with text in a narrow pane.** It is off by
   default.
5. **Bold-italic is browser-synthesised** in the Typewriter preset: Courier
   Prime ships Regular, Bold and Italic, but no Bold Italic. Bureau shipped six
   faces, not eight, and Afterimage inherits that.
6. **Style Settings config from Bureau does not carry over.** Keys moved from
   `bureau@@bu-*` to `afterimage@@after-*`. `release.py` still reads legacy
   keys so an old config can be imported deliberately.
