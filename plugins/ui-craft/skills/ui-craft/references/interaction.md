# Interaction states

- **Focus and selection:** an inset ring (`box-shadow: inset 0 0 0 2px var(--color-primary)`) on `:focus-visible` and on the selected item. It doesn't change the element's size (no shift) and works on any background. Remove the browser outline only where the ring replaces it; never leave an element with no visible focus.
- **Hover on a card:** change the border colour to the accent. Don't lift, scale or add a shadow; that moves neighbours visually and fights the flat model. If only part of the card is the link, use `:has(.link:hover)` on the card.
- **Pressed:** a subtle ripple or darken is enough; never move the element.
- **Touch:** targets ≥ 44px; hover-only affordances need a visible equivalent on touch.
- **Motion:**
  - Wrap every transition and animation in `@media (prefers-reduced-motion: no-preference)` (or the project's mixin). Offer an in-app "reduce animations" toggle if the app is animation-heavy.
  - Hover/focus transitions 150–200ms. Arrivals use an ease-out curve such as `cubic-bezier(0.22, 1, 0.36, 1)`, 200–400ms.
  - Animate `transform` and `opacity`, not layout properties. Batch DOM reads before writes to avoid forced reflows.
  - Disable the browser's default view-transition crossfade if you drive your own (e.g. a theme switch).
- **Status changes** (saved, published, failed) arrive with a short ring/pulse on the thing that changed, not a full-screen toast. Status tints mix a little of the status colour into the surface (`color-mix(in oklab, var(--color-success) 5%, var(--color-surface))`).
- **Leaving with unsaved changes** asks first. Optimistic actions show their pending state in place ("Updating…") right after the press.
