---
name: adopt
description: Use when an existing project should follow (or be refreshed from) the user's agent-kit — bringing an older repo's CLAUDE.md/AGENTS.md, plugins and MCP config in line with the kit, or regenerating the kit-managed blocks after the kit changed. Never rewrites code; only agent context files.
---

# Adopt or refresh a project

Regenerates only agent context: `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, `.mcp.json`, `.claude/kit.json`. Text outside `<!-- kit:<id> -->…<!-- /kit:<id> -->` blocks is never touched, and code is never scaffolded (`--context-only`).

## Refresh a project that already has `.claude/kit.json`

```bash
node <plugin root>/scripts/compose.mjs <side dir> <side dir>/.claude/kit.json --context-only --dry-run
node <plugin root>/scripts/compose.mjs <side dir> <side dir>/.claude/kit.json --context-only
git diff -- CLAUDE.md AGENTS.md .claude .mcp.json
```

Run it per side (`web/`, `api/`) when the project is split. Show the user the diff and summarise what changed.

## Adopt a project that has never used the kit

1. **Detect modules** from the repo: `vite.config.*` + `react` → `react-spa`; `vite-plugin-pwa` → `pwa`; `wrangler.jsonc` with `assets` → `cloudflare-spa`; a `Dockerfile` serving `dist` → `docker-spa`; Workers with `hono` + `d1_databases` → `cloudflare-workers`; anything else → `other-stack` (+ `ui` if it has a UI). Confirm with the user in one question.
2. **Read the existing CLAUDE.md/AGENTS.md fully.** Sort its content into:
   - rules the kit already has (they'll come back as kit blocks: drop the duplicate),
   - project-specific facts (keep, under `## Project` outside the blocks),
   - rules that are general but missing from the kit (candidates for `/kit:learn`; list them for the user, don't silently drop them),
   - stale content (wrong paths, tools the project doesn't use): point it out.
3. Write `.claude/kit.json` (same shape as `kit.config.json` in the `new-project` skill, with this side's `modules`). A project that predates the kit names things differently, so map them, or the kit blocks will cite files and tokens that don't exist:
   - `examples`: `{ "feature": "src/pages/Feed/", "queryHook": "…", "skeleton": "…" }` (defaults point at the template's `Items` feature);
   - `tokens`: `{ "page": "--color-background-100", "surface": "…", "raised": "…", "border": "…" }` (defaults are the template's `--color-page`, `--color-surface`, `--color-raised`, `--color-border`).
   Then grep the generated blocks for paths and names and check each one exists. Run the refresh commands above. The first run appends kit blocks to the existing files; rearrange so `## Project` comes first and duplicates are gone.
4. **Local skills:** if `.claude/skills/` holds copies of kit skills (`loading-skeletons`, `react-profiling`, `release-notes`), diff each against the plugin version. Project-specific details belong in CLAUDE.md's Project section, general improvements in the kit (`/kit:learn`). Then ask before deleting the local copy so the plugin version loads.
5. Run the project's lint to make sure nothing else changed, and report: blocks added, content moved, candidates for the kit, local skills replaced.
