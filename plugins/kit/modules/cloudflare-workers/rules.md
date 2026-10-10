## Stack: Cloudflare Workers backend

A pnpm monorepo of Workers written with Hono, with D1 for storage and a zod contract package shared with the web client.

### Commands

- **Dev:** `pnpm dev` runs the gateway and every service in one `wrangler dev` (multiple `-c` configs, state in `services/items/.wrangler/state`), applying local D1 migrations first. The API is at `http://localhost:8787/v1`.
- **Check:** `pnpm lint`, `pnpm typecheck`, and tests per package: `pnpm --filter {{scope}}/items exec vitest run items`. Tests run inside workerd (`@cloudflare/vitest-pool-workers`).
- **Before calling a change done:** `pnpm lint` and `pnpm typecheck`, plus the tests of the packages you touched.

### Layout

- `packages/contract` (`{{contractPackage}}`): zod schemas and types for every request and response, built with tsup. Both Workers and the SPA import it; change it first, then the Workers, then the client.
- `services/gateway`: the **only public Worker** (`api.{{domain}}`). CORS from `ALLOWED_ORIGINS`, then forwards `/v1/*` to private Workers over service bindings. It may combine several services' answers into one response (calls between Workers don't count toward request limits).
- `services/<name>`: private Workers (`workers_dev: false`). Each one:
  - `src/index.ts` exports `fetch` (and `scheduled`/`queue`/`email` when used) `satisfies ExportedHandler<Env>`, and re-exports its RPC class;
  - `src/env.ts` defines `Env` (intersect per-module env types as it grows);
  - `src/app.ts` is the Hono app with `basePath('/v1')`; `src/routes/` holds sub-routers;
  - `src/db/` holds raw-SQL functions taking `D1Database` first;
  - `src/lib/` holds helpers; `src/rpc.ts` a `WorkerEntrypoint` that only delegates to `db/` (side effects via `this.ctx.waitUntil`).
- **One owner per D1 database.** Only the Worker that owns a database touches it; others call the owner's RPC (`services: [{ binding, service, entrypoint: '<Owner>Rpc' }]`).
- When a module needs time, randomness or outbound calls, inject them (`createApp(deps)`) so tests can pass fakes.

### API conventions

- Everything under `/v1`. JSON fields are camelCase; SQL columns snake_case, mapped by hand (`toItem(row)`). Timestamps are epoch ms in INTEGER columns and ISO strings in JSON. IDs are ULIDs.
- Errors always have the shape `{ error: { code, message, existingId? } }`, with `code` from the contract's closed enum, sent through `apiError(c, status, code, message)`. `app.notFound` and `app.onError` use it too.
- Status codes: 422 validation, 409 duplicate, 404 not found, 201 created, 202 accepted for async work, 204 no body.
- Validate with `Schema.safeParse(await c.req.json().catch(() => null))`.
- Lists are cursor-paginated: `{ items, nextCursor, total }` (`pageOf()` in the contract), with base64url JSON cursors over the sort keys.
- Cache headers are named constants (`PUBLIC_LIST_CACHE`, `NO_STORE`), never inline strings.
- User-facing error messages are written in the UI language ({{uiLanguage}}).

### Data

- Migrations are numbered SQL files in `services/<name>/migrations/` (`0002_add_x.sql`), each opening with a comment that explains why. Never edit an applied migration.
- Enums are `CHECK (column IN (...))` constraints; indexes are named `table_by_x`.
- Never store raw IPs or other personal data when a salted hash serves the purpose.

### Config and deploy

- `wrangler.jsonc` files are commented, use one `compatibility_date`, `observability.enabled`, `preview_urls: false`. The top level is local development; `env.production` binds real domains and databases.
- Secrets: `.dev.vars` locally (from `.dev.vars.example`), `wrangler secret put <NAME> --env production` remotely. Never in `vars`.
- CI (`.github/workflows/workers.yml`) deploys in dependency order: a Worker must exist before another binds to it. Add new services there in the right place.
- Free-plan limits (crons per account, subrequests per invocation, CPU time) are written as named constants next to the code that respects them.
