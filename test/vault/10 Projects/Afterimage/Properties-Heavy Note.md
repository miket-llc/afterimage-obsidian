---
title: Properties — Every Field Type At Once
aliases: [Property Rig, Frontmatter Test]
type: specification
status: in-review
priority: 2
clearance: 4
progress: 0.65
verified: true
archived: false
created: 2026-08-26
reviewed: 2026-08-26T09:30:00
due: 2026-09-15
owner: "[[Mike Thompson]]"
related:
  - "[[Component Matrix]]"
  - "[[Long-Form Note — Phosphor and Persistence]]"
  - "[[A Note With An Unusually Long Title That Should Ellipsize Rather Than Wrap Forever]]"
operators:
  - Operator A
  - Operator B
  - Operator C
repository: https://github.com/Sonophage/Bureau
reference: https://int10h.org/oldschool-pc-fonts/
empty_text:
empty_list: []
cover: attachments/raster-test-pattern.svg
tags:
  - afterimage
  - qa
  - properties
  - a-deliberately-long-tag-name-for-overflow-testing
---

# Properties — Every Field Type At Once

The block above is the actual test. It exercises every property type Obsidian
renders, so the panel can be judged as a designed object rather than as a
form:

- **Text** — `title`, `type`, `status`
- **Number** — `priority`, `clearance`, `progress`
- **Checkbox** — `verified` (true), `archived` (false)
- **Date** — `created`, `due`
- **Date & time** — `reviewed`
- **List** — `operators`, `related`, `aliases`
- **Internal link** — `owner`, and every entry in `related`
- **External URL** — `repository`, `reference`
- **Empty values** — `empty_text`, `empty_list`
- **Tags** — including one long enough to force overflow handling

## What to look for

1. The container reads as **one panel**, not as loose rows.
2. Key labels are clearly a *different material* from the value fields — you
   should never be in doubt about which side is editable.
3. Clicking a value gives an obvious focused state, and the accent appears
   **only** on focus, not on every resting field.
4. Empty values still hold their row; the rhythm does not collapse.
5. The long tag and the long related-link ellipsize; they do not blow out the
   panel width or wrap into a ragged stack.
6. Editing a value is comfortable — this is the check that matters most, and
   the one a purely visual review will miss.

## Editing checklist

- [ ] Click into `title`, type, press Escape — text commits, no layout jump
- [ ] Toggle `verified` — checkbox animates once, does not replay
- [ ] Add a value to `empty_list` — the row grows cleanly
- [ ] Add a new property via **Add property** — the new row matches the others
- [ ] Open the *All properties* sidebar pane — same treatment, narrower
- [ ] Collapse and expand the properties block
