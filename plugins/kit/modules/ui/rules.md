## UI

### Browser first

- Use the **Chrome DevTools MCP** to navigate, inspect the DOM, read computed styles and take screenshots in a live browser instead of guessing UI state. Prefer connecting to the already-running dev server; headless unless the user asks to watch.
- **Visual work needs screenshots.** For anything that "looks wrong", a redesign, CSS/flexbox/grid debugging or layout shift (CLS), capture the real rendered UI in every theme, at desktop and 375px width. JSDOM is blind to aesthetics.
- Ignore console noise unrelated to the change (network warnings, font preload races, third-party scripts, unrelated hydration warnings). Don't investigate it.

### Tokens and themes

- Components consume tokens; never hardcode hex or pixel values. Use the semantic colour roles (page `{{tokens.page}}`, surface `{{tokens.surface}}`, raised `{{tokens.raised}}`, border `{{tokens.border}}`, text `--color-text-base|muted|subtle`) over raw scales, so a theme can remap them.
- Light mode is flat (page, cards and inputs share one colour; borders separate). Dark mode separates by luminance (page < surface < raised) with low-contrast borders. Every theme is its own set of values; adding a colour means adding it to every theme.
- Shadows only on floating layers (dropdowns, popovers, toasts, dialogs). Floating layers are opaque.

### Composition

- Check the generic components before building a new control.
- **No nested cards.** Inside a surface, group with space, a divider or a step to `raised`; at most page → surface → raised.
- **No AI-template stat cards:** don't stack an uppercase letter-spaced label over a big number over a muted subtitle. One number (or visual) and one short description.
- **Few type styles per component:** one or two font sizes/weights. Don't add a size, weight, letter-spacing or uppercase just to label something; rewrite the text instead.
- **Forms:** never add `gap`/`row-gap` or vertical margins to the form or input wrapper containers; spacing comes from the field component.
- Neutral over alarming: red is for destructive or failed, not for low-key actions. One primary action per view.

### Stability

- Nothing moves after it appears: reserve space for counts (two digits), variable text (fixed lines), images (aspect ratio), messages under fields, and the header logo.
- Hide numbers until they load; never flash `0`.
- Skeletons mirror the loaded UI: what the client already knows (labels, headings, buttons) renders for real; only data-dependent parts become bones, built from the real component's styles. The swap must cause zero shift.
