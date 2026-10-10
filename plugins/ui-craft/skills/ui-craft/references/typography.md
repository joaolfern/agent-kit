# Typography

- **One family** is usually enough; a variable font covers every weight in one file. Serve it as a subset WOFF2 and preload it, so text doesn't reflow when it arrives.
- **Titles:** `text-wrap: balance` so a two-line title doesn't leave one word alone. Negative letter-spacing that tightens as size grows (−0.01em small → −0.04em display). Line-height 1.05–1.3, tighter for bigger sizes. Step titles up at the tablet breakpoint rather than scaling fluidly forever.
- **Body:** line-height ≈1.5; paragraph width ≤ ~70ch.
- **Explicit line-heights** wherever a box's height matters (cards in a grid, skeleton targets, buttons). Otherwise the height follows the fallback font's metrics and shifts when the web font loads.
- **Hierarchy through size and weight, not decoration.** Three text colours (base, muted, subtle) and two weights cover nearly everything. See `anti-ai-patterns.md` for the one-or-two-styles-per-component rule.
- **Clamp, don't overflow:** long user-provided text gets a line clamp with the full value available (title attribute, details page).
- **Numbers that change** (counters, prices, timers) use `font-variant-numeric: tabular-nums` so digits don't shimmy.
