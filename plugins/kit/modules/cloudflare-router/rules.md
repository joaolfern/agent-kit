## Router Worker

- `services/router` answers `{{domain}}/r/*` through **zone routes**, which run before the SPA's custom domain on the same host. It's public, reads data only through `ItemsRpc` (never its own D1 binding), and answers with redirects.
- Redirects carry `cache-control: no-store` and `x-robots-tag: noindex`; side effects (click counts) go through `ctx.waitUntil(...)` and never fail the redirect.
- Dependencies are injected (`createApp(deps)`), so tests run without bindings.
- The SPA must never answer these paths: they're in the service worker's navigation denylist (when the app is a PWA), and the SPA's router sends `/r/*` home only if the router is bypassed.
- Local: `pnpm dev:router` runs it with the items Worker on port 8788.
