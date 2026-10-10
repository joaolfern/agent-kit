## Dimmed theme

- A third mode (`src/themes/dimmed.ts`) built on dark: a deep tinted page with cards in a faint white over it. The toggle cycles light → dark → dimmed.
- Translucent values only for in-flow surfaces; anything floating (`--color-surface`, used by dropdowns and modals) is the precomputed **opaque** equivalent, or content behind it bleeds through.
- Every new colour goes into all three theme files, and `index.html`'s pre-React script lists all three page colours.
