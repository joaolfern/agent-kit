---
name: new-project
description: Use when the user wants to start a new project, app, site or repo with their agent-kit setup — interviews them (stack, hosting, backend, PWA, brand, agents), then composes CLAUDE.md/AGENTS.md from kit modules and scaffolds the chosen stack (e.g. Vite + React SPA on Cloudflare with a Workers + D1 backend). Also when they ask "set this up like nos-cl/nos-sr".
---

# New project

Composes a project from the modules in `modules/` next to this plugin's `scripts/compose.mjs` (the plugin root is two directories above this file; this skill's base directory is printed when it loads). Every module has `module.json`, `rules.md` (shared with every agent), optional `claude.md`/`agents.md`, and an optional `template/`.

## 1. Interview

Use AskUserQuestion, at most 4 questions per call, two calls at most. Recommend the defaults below; skip what the user already said.

1. **Name** (kebab-case, used for packages and Workers), **title**, one-line **description**, **domain**. Ask in plain text if not given.
2. **Frontend:** `react-spa` (recommended: Vite + React 19 + React Compiler + react-router + TanStack Query + SCSS modules + MSW) · `other-stack` (anything else; no scaffold) · none.
3. **Hosting** (with react-spa): `cloudflare-spa` (recommended) · `docker-spa` · decide later.
4. **Backend:** `cloudflare-workers` (Hono gateway + D1 service + zod contract) · other/none. With other, describe it in the Project section afterwards.
5. **Extras** (multi-select): `pwa` (installable, offline API cache, update prompt), `theme-dimmed` (a third, deep tinted theme), `cloudflare-router` (with cloudflare-workers: a Worker answering `<domain>/r/*` short links before the SPA). Default none.
6. **UI language** (BCP 47, e.g. `pt-BR`), **brand colours** (primary; optional secondary). If the user has no brand yet, keep the defaults and plan a `frontend-design` pass.
7. **AGENTS.md** for other agents (default yes: CLAUDE.md then imports it).

For `other-stack`, also collect: stack name, a one-paragraph summary, the commands (dev, test one file, lint, type-check), the folder layout, and the pre-delivery checks. If the project has a UI, add the `ui` module explicitly.

## 2. Write the config

Write `<target>/kit.config.json` (it can be deleted after; `.claude/kit.json` keeps a copy per side):

```json
{
  "name": "acme",
  "title": "Acme",
  "description": "A tidy place for your things.",
  "domain": "acme.dev",
  "uiLanguage": "en",
  "modules": ["react-spa", "pwa", "cloudflare-spa", "cloudflare-workers"],
  "brand": { "primary": "#d15c6a", "primaryHover": "#e07a87", "primarySoft": "#d15c6a30", "secondary": "#cf95e9", "secondarySoft": "#cf95e97c" },
  "agentsMd": true,
  "marketplace": { "source": "directory", "path": "/home/joaolfern/dev/joao/agent-kit" },
  "otherStack": { "name": "", "summary": "", "commands": "", "layout": "", "checks": "" }
}
```

- `core` is always added; `js-tooling` and `ui` follow from the stack. Defaults: `siteUrl` `https://<domain>`, `apiUrl` `https://api.<domain>`, `contractPackage` `@<name>/contract`.
- `marketplace` is what the project's `.claude/settings.json` registers so teammates' Claude Code loads the same plugins: a `directory` path on this machine, or `{ "source": "github", "repo": "<owner>/agent-kit" }` once the kit is pushed.
- Omit `otherStack` unless that module is chosen.

## 3. Compose

```bash
node <plugin root>/scripts/compose.mjs <target> <target>/kit.config.json --dry-run
node <plugin root>/scripts/compose.mjs <target> <target>/kit.config.json
```

- Read the dry run's JSON: modules, sides, files. With both a frontend and a backend, the project splits into `<target>/web` and `<target>/api`, each its own package with its own CLAUDE.md/AGENTS.md; the web app links the contract from `../api/packages/contract`.
- `unknownPlaceholders` must be empty; if it isn't, a config value is missing.
- Existing files are skipped (listed in `skipped`); never pass `--force` into a non-empty directory without asking.

## 4. Verify

For each side that has a `package.json` (backend first when both exist, since the web app links its contract):

- `pnpm install`
- react-spa: `pnpm lint && pnpm build && pnpm exec vitest run Items`
- cloudflare-workers: `pnpm lint && pnpm typecheck && pnpm --filter @<name>/items exec vitest run`

Then run the `ui-review` skill once on `/items` (both themes, desktop and 375px) to confirm the scaffold renders.

## 5. Hand off

- Point the user to `docs/owner-todo.md` (domains, secrets, D1 ids, icons) and remind them nothing was committed (`git init` is fine; committing is theirs).
- The sample `Items` feature (and `items` service) is there to copy; once the first real feature exists, delete it: `src/pages/Items`, its route, MSW handler and data, `IItem`; `services/items` (or rename it).
- If the brand is undecided, offer a `frontend-design` pass to set `src/themes/*.ts`, the font and the logo, applying `ui-craft`.
- Fill the **Project** section at the top of AGENTS.md/CLAUDE.md with what only this project knows (domain vocabulary, users, constraints).
