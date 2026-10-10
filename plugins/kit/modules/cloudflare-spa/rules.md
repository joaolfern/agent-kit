## Hosting: Cloudflare static assets

- The SPA is a static-assets Worker (`wrangler.jsonc`) on the custom domain `{{domain}}`, with `not_found_handling: single-page-application` so deep links load `index.html`.
- `pnpm deploy:web` builds with `.env.production` and runs `wrangler deploy`; `.github/workflows/deploy-web.yml` does the same on pushes to `main`. Everything in `.env.production` ends up in the public bundle: never put a secret there.
- Another Worker can own paths on the same domain with zone routes (`{{domain}}/r/*`); those run before the SPA's custom domain. Add such paths to the service worker's navigation denylist if the app is a PWA.
- Free-plan limits are real constraints (requests per day, subrequests, cron count): keep reads cacheable (`staleTime`, edge cache headers) and write the limit next to the constant that respects it.
