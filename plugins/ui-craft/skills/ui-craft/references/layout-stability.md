# Layout stability (zero CLS)

Nothing should move after it first appears. Every shift is a design decision someone forgot to make.

## Reserve space for what will arrive

- **Counts:** room for at least two digits, so 9 → 10 doesn't widen the button.
- **Variable text:** a fixed number of lines (e.g. always two lines tall), so every card in a grid is the same height regardless of content.
- **Columns:** fixed column widths in tables and link rows, so a long name doesn't move the links.
- **Messages:** reserve the help/error line under a field, so fields below never jump.
- **Images and logos:** explicit width/height or `aspect-ratio`, including the header logo, so the title next to it doesn't shift.
- **Fonts:** subset + preload the web font and set explicit line-heights where height matters.

## Don't show wrong values while loading

- Hide counts and votes until they load. Never flash `0` and then the real number: it reads as a bug and shifts the layout.
- A value the client already knows (labels, headings, button text, the user's own last vote) renders immediately; only data-dependent parts wait.

## Scrolling

- `scrollbar-gutter: stable` on the root, so pages with and without a scrollbar have the same width.
- The window is the only scroll container for pages, so the router can restore scroll position on back/forward. Nested scroll areas only for genuinely independent panes.
- A page that never scrolls (full-height landing) turns the gutter off, or it shows as an empty strip.
- Use `100dvh`, not `100vh`, on mobile.

## Loading

- Route-level code splitting with a per-page skeleton as the Suspense fallback, so a lazy page never flashes blank.
- Placeholders must match the real thing: use the `loading-skeletons` skill.
- Data the first screen always needs and rarely changes can be baked into the build (a snapshot JSON refreshed at deploy) so the first paint never waits on a request; prefer whichever is newer, the snapshot or the cache.
- If a lazy chunk fails to load after a deploy, reload once instead of showing an error.

## Verify

Record a performance trace (Chrome DevTools MCP `performance_start_trace`/`stop_trace`) across load and check CLS ≈ 0, or compare `getBoundingClientRect()` of the region before and after data arrives.
