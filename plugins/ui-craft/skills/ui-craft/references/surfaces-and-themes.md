# Surfaces and themes

Four roles, defined once as semantic tokens and remapped per theme. Components only ever use the roles.

| Role | What it is | Example token |
|---|---|---|
| page | the canvas behind everything | `--color-page` |
| surface | a card, panel, input, sidebar sitting on the page | `--color-surface` |
| raised | something inside a surface: thumbnail frame, placeholder, code block, hover row | `--color-raised` |
| floating | dropdown, popover, modal, toast — above the flow | `--color-surface` + a shadow, or `--color-floating` |

Plus `--color-border` (hairline separation) and text in three steps: `--color-text-base`, `-muted`, `-subtle`.

## Light mode is flat; borders separate

- Page, surface and input share one colour (or are one barely-perceptible step apart). A **visible border** does the separating.
  - Why: in light mode a grey page with white cards reads as a dated admin template, and the grey cast dulls every colour on top. Flat + hairline borders reads calm and modern.
- `raised` is a small step darker than surface, used sparingly.
- Shadows are not how light-mode cards separate. A card with border + shadow + background contrast is three signals for one job.

## Dark mode separates by luminance; borders whisper

- Surfaces get **lighter as they rise**: page < surface < raised (e.g. `#0C0D10` < `#131317` < `#1b1b1f`). Light comes from above; closer things catch more of it.
- Borders are low contrast, only slightly lighter than the surface. A bright border in dark mode looks like a wireframe.
- Never pure black (`#000`) for the page, never pure white for text: off-black and a warm off-white (`#DDD7D4`) reduce glare and halation.
- Saturated brand colours need their own dark values (lighter, less saturated); status backgrounds become deep tints (`#123323`) with bright foregrounds (`#3ecf7a`). Don't reuse light-mode status pairs.
- Glass/blur needs more blur in dark (≈50px vs 20px) to stay legible.

## So: dark is not light inverted

Write each theme as its own set of values for the same roles. The shapes of the two themes differ (flat + borders vs. luminance steps), so a single "invert" never produces both.

## Verify the separation actually shows

- Check that a card's border colour differs visibly from the page **in that theme**. A real bug: a card mixin used a border token that matched the page background almost exactly, so cards looked "unboxed". The fix was the standard border token other cards already used.
- When a page's background differs from the default (a hero, a coloured section), re-check every card on it.

## Translucency

- A translucent surface (white at 7–10% over a coloured page) looks great in flow, but anything **floating** (dropdown, modal, menu) must be **opaque**: otherwise the content behind it bleeds through and the text is unreadable. Precompute the opaque equivalent colour.

## Shadows are for floating layers only

- Use a shadow for things that are above the flow (popover, dropdown, toast, dialog): one soft, offset, slightly negative-spread shadow (e.g. `0 12px 32px -8px rgb(0 0 0 / 35%)`).
- In-flow cards get no shadow. Coloured glows are an accent for a single primary CTA at most.

## Theme plumbing

- Apply the saved theme **before first paint** (inline script in `<head>` or SSR), including `<meta name="theme-color">` so the browser bar matches. A flash of the wrong theme on load is a bug.
- Follow `prefers-color-scheme` until the user picks; then remember the pick.
- Adding a colour means adding it to **every** theme file and the theme type, so no theme silently falls back.
- Prefer semantic tokens (`--color-text-muted`, `--color-surface`) over scale tokens (`--color-neutral-600`) in components, so a theme can remap without touching component code.
