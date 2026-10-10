# Nesting

## Avoid nested cards

- A card inside a card (border inside border, radius inside radius) is the most common AI-layout tell. It adds no information and eats padding twice.
- Inside a surface, group with **space, a divider, or a step to `raised`** — not another bordered box.
- At most one level: page → surface → raised. If a design seems to need a fourth level, the hierarchy is wrong; flatten it or split the screen.
- A raised element inside a surface may carry a hairline border and a smaller radius than its parent (inner radius ≈ outer radius − padding), so the corners stay concentric.

## Dividers

- For a grid of cells with hairlines between them (stats, settings rows), put `gap: 1px` on a grid whose background is the border colour, with each cell on the surface colour. You get perfect single-pixel dividers without double borders at the joins or special-casing the last child.
- A list inside a card uses row dividers, not per-row cards.

## Placeholders for missing media

- A missing image is a `raised` box with diagonal stripes of `raised` against `surface`, not a grey rectangle with an icon. It reads as "intentionally empty" and keeps the slot's size.

## Fewer boxes, more alignment

- Before adding a box, try aligning the content to the same edge as its neighbours. Alignment groups things almost as strongly as a border, with less noise.
- Pages of the same family share one max-width with the top bar, so their edges line up while navigating.
