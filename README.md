# agent-kit

My agent setup as a Claude Code plugin marketplace: a project generator plus on-demand knowledge, distilled from building Nós no Cabo (`nos-cl` + `nos-sr`). Two goals:

- **Start right:** pick the stack, hosting and backend once, and get a scaffold that builds, lints and tests, with CLAUDE.md/AGENTS.md that already encode how I work.
- **Stay in sync:** rules and skills live here, versioned, instead of being copied into each repo and drifting.

## What's inside

| Plugin | What it gives a session |
|---|---|
| `kit` | `/kit:new-project` (interview → compose → scaffold), `/kit:adopt` (bring an existing repo in line, or refresh), `/kit:learn` (record a lesson back here). Holds the modules. |
| `core` | `adr` (architecture decision records), `release-notes` (semver bump, CHANGELOG, user-facing notes). |
| `ui-craft` | `ui-craft` (surfaces and themes, nesting, anti-AI patterns, typography, interaction, layout stability), `loading-skeletons` (zero-shift, no fake labels), `ui-review` (screenshots in every theme and at 375px). |
| `react` | `react-profiling` (React DevTools through Chrome DevTools MCP, why-did-render probe, React Compiler output). |
| `cloudflare` | `workers-backend` (endpoints, migrations, Workers, RPC, crons, secrets, deploy order, contract releases). |

### Modules (`plugins/kit/modules/`)

| Module | Side | Brings |
|---|---|---|
| `core` | both, always | working rules (comments, tests, git, docs), `docs/` skeleton with owner to-do |
| `js-tooling` | both, with any JS stack | pnpm, oxlint (comment bans), Prettier, husky + lint-staged |
| `ui` | web, with any UI | browser-first verification, tokens and themes, composition and stability rules, Chrome DevTools MCP in `.mcp.json` |
| `react-spa` | web | Vite 8 + React 19 + React Compiler + react-router 7 + TanStack Query + SCSS tokens + light/dark themes + MSW + Vitest, generic components, a sample `Items` feature with a zero-shift skeleton |
| `pwa` | web | injectManifest service worker, API GET cache, update prompt, icon generation |
| `theme-dimmed` | web | a third theme: deep tinted page, translucent cards made opaque for floating layers |
| `cloudflare-spa` | web | static-assets Worker on a custom domain, `.env.production`, deploy workflow |
| `docker-spa` | web | pnpm build + nginx with SPA fallback and immutable assets |
| `cloudflare-workers` | api | Hono gateway, a D1-owning `items` service with RPC, zod contract package, workerd tests, ordered deploy, contract publishing |
| `cloudflare-router` | api | a public Worker on the site's own domain (zone routes `/r/*`) reading over RPC, with the SPA and service worker kept off its paths |
| `other-stack` | web | no scaffold: the stack section comes from the interview, so core + ui still apply to Rails, Next, Expo… |

When a project has both a web and an api side, it is composed into `web/` and `api/`, each with its own context files; the web app links the contract from `../api/packages/contract` until it's published.

## Install

Register the marketplace once (user settings), then install the plugins:

```
/plugin marketplace add /home/joaolfern/dev/joao/agent-kit
/plugin install kit@agent-kit
```

Generated projects also register the marketplace and enable their plugins in their own `.claude/settings.json`, so anyone opening the repo in Claude Code gets the same setup. Once this repo is on GitHub, use `{ "source": "github", "repo": "<owner>/agent-kit" }` as `marketplace` in `kit.config.json`.

## Use

- New project: in an empty folder, run `/kit:new-project`.
- Existing project: `/kit:adopt`.
- The agent did something you had to correct, and it applies everywhere: `/kit:learn`.

Without Claude, the composer runs directly:

```bash
node plugins/kit/scripts/compose.mjs <target> kit.config.json [--dry-run] [--context-only] [--force] [--prune]
```

## How context files are built

Each module contributes:

- `rules.md`: shared rules, for every agent (AGENTS.md, or CLAUDE.md when AGENTS.md is off);
- `claude.md`: Claude-only notes (which skill to use);
- `agents.md`: for other agents, the essentials of a skill they can't load.

With AGENTS.md on, CLAUDE.md imports it (`@AGENTS.md`) and adds the Claude-only blocks, so the rules exist once. Each block sits between `<!-- kit:<id> -->` markers; refreshing replaces blocks in place and never touches text outside them (the `## Project` section is yours).

## Writing a module

`plugins/kit/modules/<id>/`:

- `module.json`: `id`, `title`, `side` (`web` | `api` | `both`), `order`, `requires`, `conflicts`, `always`, `whenAny` (auto-include when any listed module is active), `plugins` (enabled in the project), `mcp` (merged into `.mcp.json`), `packageWhen` (package.json merged when a condition holds), `ownerTodo` (appended to `docs/owner-todo.md`).
- `template/`: copied into the side's directory. `{{name}}`, `{{title}}`, `{{domain}}`, `{{siteUrl}}`, `{{apiUrl}}`, `{{scope}}`, `{{contractPackage}}`, `{{uiLanguage}}`, `{{brand.primary}}`… are replaced. Lines between `kit:if <ids>` and `kit:end` (in any comment syntax; `a|b`, `!a`) are kept only when the condition holds. `package.json` files are deep-merged, `_gitignore` files are concatenated into `.gitignore`, `_dot_x` is published as `.x`.

After changing a template, compose the three reference combinations into a scratch directory and check them:

| Config | Check |
|---|---|
| `react-spa` | `pnpm install && pnpm lint && pnpm build && pnpm exec vitest run` |
| `react-spa`, `pwa`, `cloudflare-spa`, `cloudflare-workers` | api: `pnpm install && pnpm lint && pnpm typecheck && pnpm test`; web: the same as above; `pnpm dev` in api and the web app with `VITE_ENABLE_MOCKS=false` shows the API's items |
| `other-stack` + `ui` | `unknownPlaceholders` is empty |

Then format the template with the generated project's Prettier (`prettier --write` over the template's sources) so generated files start clean.
