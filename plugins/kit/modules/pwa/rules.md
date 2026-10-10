## PWA and service worker

- `vite-plugin-pwa` (injectManifest) builds `src/sw/sw.ts` to `/sw.js`: precache, an API GET cache (NetworkFirst with a 4s timeout), a font cache, the `SKIP_WAITING` update handshake and Web Push handlers. It has its own `tsconfig.sw.json` (WebWorker lib).
- Cache only GETs that may be briefly stale: add them to `CACHED_API_PATH`. Never cache live endpoints (status polls, previews) or non-GET requests.
- Paths another Worker answers on this domain go in the `NavigationRoute` denylist, or the SPA shell hides them.
- The service worker registers only when `VITE_ENABLE_MOCKS=false` (MSW owns the scope otherwise), so test it with `pnpm build && pnpm start`.
- Icons come from `pnpm pwa:icons` (`pwa-assets.config.ts`, source `public/logos/logo.svg`); re-run it after changing the logo.
- A new version waits until the user presses "Update" in the prompt (`ServiceWorkerUpdatePrompt`).
