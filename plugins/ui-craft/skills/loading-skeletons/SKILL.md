---
name: loading-skeletons
description: Use when adding or editing a loading skeleton or placeholder (a stand-in for real content while data or a lazy page loads) so it looks like the loaded UI and the swap causes zero layout shift. Covers what must not be a skeleton, building bones from the real component's own styles, and measuring real heights in a browser. Not for unrelated CLS work (see ui-craft layout-stability).
---

# Loading skeletons

A skeleton is the loaded UI with only the **unknown** parts blanked out. The swap to real content must be seamless: same boxes, same positions, no shift, no flicker.

## 1. Decide what is a bone and what is real

- **Never skeleton what the client already knows.** Headings, labels, button text, tab names, filters, static descriptions, icons, layout chrome: render them for real, in the skeleton, exactly as loaded. Only data-dependent parts become bones.
  - Why: a skeleton for a label the app defines itself is a fake loading state; it makes the page look slower than it is and the label "pops" in for no reason.
- A value the app has locally (the user's own vote, a cached draft, a snapshot baked at build) also renders for real.
- Counts and numbers that arrive later are hidden (keeping their reserved width), not shown as `0`.

## 2. Build bones from the real component's styles

- Reuse the real component's root and layout classes (or the same styled primitives), so padding, gaps, radius, borders and widths are identical by construction. Don't hand-write a parallel layout that only resembles it.
- **Text bones:** keep the real text element (same class, same font size and line-height) with `&nbsp;` content, one per expected line (`&nbsp;<br/>&nbsp;` for two lines), and paint a bar on each line box instead of setting a height:
  ```scss
  @mixin bone-text {
    color: transparent;
    background: linear-gradient(transparent 20%, var(--color-raised) 20% 80%, transparent 80%) 0 0 / 100% 1lh repeat-y;
    user-select: none;
  }
  ```
  The box is the real line box, so the height can't drift from the loaded text.
- **Block bones** (thumbnails, avatars, chips): the real element's class plus `background: var(--color-raised)` and its radius.
- Mark the skeleton `aria-hidden` and expose loading state once on the region (`aria-busy`), not per bone.
- Same bones in every theme: `raised` is defined per theme, so bones stay subtle in light and dark.
- Per-page skeletons double as the route's Suspense fallback, so lazy pages and their data use one placeholder.

## 3. Match structure and counts

- Copy the real markup's spacing structure exactly (container `gap` vs per-child margins); a spacing mismatch shifts even when every bone height is right.
- For a variable count (tags, list rows), render the count the real component shows most often or at most, driven by the **same shared constant** the real component uses (page size, tag limit), never a second magic number.
- Elements whose presence depends on data (an optional subtitle) are a judgement call: include them if most records have them.

## 4. Measure, don't guess

When there's any doubt about heights (custom fonts, line-heights, wrapping), measure in a real browser with Chrome DevTools MCP:

1. Start the dev server (with mocks, if the project uses them) in the background; use a port the user isn't on.
2. Load the real page and, with `evaluate_script`, read `getBoundingClientRect()` height (and width if relevant) of the real elements across **several records**: short, long, and missing optional fields.
3. Load the skeleton state (throttle the network, delay the mock handler, or render the skeleton route directly) and read the same boxes.
4. Fix mismatches at the source (line-heights, reserved lines), then re-measure. A performance trace over load should show CLS ≈ 0 for the region.
5. Stop the dev server and delete any screenshots/snapshots you saved inside the repo.

## 5. Accept and note residual gaps

A data-agnostic skeleton can't know that a record omits an optional field or wraps to an extra line. Prefer fixing that in the real component (reserve the lines, clamp the text). What remains, note in one line in the PR or the component, rather than over-engineering the skeleton.

## Done when

- Only data-dependent parts are bones; everything the client knows is real.
- Skeleton and loaded heights match across several records (measured).
- Screenshots of skeleton and loaded states, in every theme, look like the same layout.
- The project's lint and type-check pass.
