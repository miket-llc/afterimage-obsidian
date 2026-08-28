# Chrome design references

This directory records the design model behind Afterimage's one-tube chrome,
the rendered references used to implement it, and the checks that keep its
phosphor rules mechanical.

| File | Role |
|---|---|
| `DESIGN-MODEL.md` | Governing model, laws, forbidden moves, reversal log, and acceptance checklist. |
| `CHROME-REFERENCE.html` | Self-contained visual reference for the implemented one-tube design. |
| `lint-phosphor.mjs` | Palette and chrome-typeface rules imported by `scripts/lint.mjs`. |
| `REVIEW-BACKLOG.md` | Adversarial review findings and their verification state. |
| `CHROME-SPEC.md` / `.html` | Superseded first-round module specification, retained because the reversal log refers to it. |
| `afterimage-fonts.css` / `support.js` | Embedded-font and runtime support for the HTML design artifacts. |

When implementation and historical material disagree, `DESIGN-MODEL.md` and
the current theme behavior take precedence over the superseded specification.
