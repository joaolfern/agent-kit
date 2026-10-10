---
name: workers-backend
description: Use when changing a Cloudflare Workers backend built as a pnpm monorepo (Hono gateway, private services owning D1 behind WorkerEntrypoint RPC, a shared zod contract package) — adding a Worker, an endpoint, a D1 migration, an RPC method, a cron or queue, changing the contract, setting secrets, deploying, or publishing the contract.
---

# Workers backend

The project's CLAUDE.md/AGENTS.md has the conventions (layout, error envelope, status codes, pagination). This skill is the procedures.

## Add an endpoint

1. **Contract first** (`packages/contract/src/`): request schema (`z.object`, `.trim()` strings, bounded lengths, `z.coerce` for query numbers), response schema, and export both from `index.ts`. New error situations reuse a code from `API_ERROR_CODES`; add a code only when the client must react differently.
2. **DB function** in the owning service's `src/db/`: raw SQL, `D1Database` first argument, snake_case → camelCase mapping in one `toX(row)` function. Use `?` bindings, never string interpolation.
3. **Route** in `src/routes/`: `Schema.safeParse(...)`, `apiError(c, 422, 'invalid', message)` on failure, a named cache constant on reads.
4. **Gateway:** `app.all('/v1/*')` already forwards to the main service. Only add a route when the path belongs to another service (put it *before* the catch-all) or the gateway combines several answers.
5. **Tests** next to the service (`test/*.test.ts`), through `exports.default.fetch(...)`; run only that package: `pnpm --filter <pkg> exec vitest run <file>`.
6. **Client:** rebuild the contract (`pnpm --filter <contract> build`), then add the MSW handler and query hook in the web app.

## Add a D1 migration

- New file `services/<owner>/migrations/NNNN_short_name.sql` with the next number; first line a `--` comment saying why.
- Never edit a migration that has run anywhere. To change a column, add a migration.
- Epoch-ms `INTEGER` timestamps, `CHECK (... IN (...))` for enums, indexes named `table_by_x` matching the `WHERE` + `ORDER BY` of the query they serve.
- Local: `pnpm --filter <owner> run migrate:local`. Tests apply migrations automatically (`TEST_MIGRATIONS`).
- Remote happens in `deploy:production` (`wrangler d1 migrations apply DB --remote --env production` before `wrangler deploy`).

## Add a Worker

1. Copy the shape of an existing service: `package.json` (`@<project>/<name>`), `tsconfig.json`, `vitest.config.ts`, `wrangler.jsonc` (`<project>-<name>`, `workers_dev: false`, an `env.production` block with `-production` names), `src/{index,app,env}.ts`.
2. If it needs another service's data, bind to that service's RPC: `"services": [{ "binding": "ITEMS", "service": "<project>-items", "entrypoint": "ItemsRpc" }]` (and the `-production` name under `env.production`). Never bind the same D1 database to two Workers.
3. If the gateway exposes it, add a service binding in the gateway's `wrangler.jsonc` (both envs) and a route before the catch-all.
4. Add it to the root `dev` script (`-c ../<name>/wrangler.jsonc`) and to CI's deploy steps **after** every Worker it binds to and **before** every Worker that binds to it.
5. Tests: fake bindings with `miniflare.serviceBindings` (fetch) or by injecting deps (`createApp(deps)`).

## Add an RPC method

- A public method on the owner's `WorkerEntrypoint` class, one line delegating to a `db/` function. Side effects that shouldn't delay the caller go through `this.ctx.waitUntil(...)`.
- Helpers that must not be callable remotely stay outside the class (every method is callable over the binding).
- Callers type the binding as `Service<ItemsRpc>` (import the type from the owner's package or declare an interface).

## Crons, queues, limits

- `"triggers": { "crons": [...] }` per Worker; the Free plan allows 5 cron triggers per account. Write remaining capacity next to the cron.
- A scheduled handler does bounded work per run (a named constant like `RECHECKS_PER_RUN`) to stay under subrequest and CPU limits.
- Queues: producer binding in the sender, consumer + dead-letter queue in the receiver.

## Secrets and config

- Local: add to `.dev.vars.example` (with a safe placeholder or Cloudflare's test keys) and `.dev.vars`.
- Remote: `pnpm --filter <pkg> exec wrangler secret put NAME --env production`; add an owner to-do if the owner has to do it.
- Non-secret config goes in `vars`. Anything personal (an email recipient) is a secret, even if not sensitive, to keep it out of a public repo.

## Contract releases

- Bump `packages/contract/package.json` `version` (semver: removing or renaming a field is major, or minor before 1.0).
- Tag `contract-v<version>` and push; the workflow publishes with npm Trusted Publishing. Then bump the web app's dependency.
- During development the web app can use `link:` to the local package instead of a published version.

## Debugging

- `pnpm dev` and curl `http://localhost:8787/v1/...`; logs show every Worker in one terminal.
- Remote logs: `pnpm --filter <pkg> exec wrangler tail --env production`.
- Local D1: `pnpm --filter <owner> exec wrangler d1 execute DB --local --persist-to .wrangler/state --command "SELECT ..."`.
