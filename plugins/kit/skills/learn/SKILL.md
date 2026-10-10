---
name: learn
description: Use when the user corrects how the agent works or what it produced in a way that should apply to every future project (a UI taste call, a convention, a tool or debugging practice, a gotcha), or says "remember this for all projects", "add this to the kit", "the agent keeps doing X". Records the lesson in agent-kit as a rule with its reason, in the right module or skill.
---

# Record a lesson in agent-kit

The kit lives in a git repo: the path in `.claude/settings.json` → `extraKnownMarketplaces.agent-kit.source.path` (directory source), or a local clone of the GitHub repo it names (ask where it is if unknown; default `~/dev/joao/agent-kit`).

## 1. Is it kit material?

- **Yes:** true across projects of that kind (all UIs, all React apps, all Workers backends, all projects).
- **No, project-only:** a fact about this codebase (a path, a domain rule, a vendor quirk only here) → this project's CLAUDE.md/AGENTS.md `## Project` section, outside the kit blocks.
- If unsure, ask the user in one line.

## 2. Pick the home

| Lesson about | File in the kit |
|---|---|
| How to work (tests, git, comments, docs) | `plugins/kit/modules/core/rules.md` |
| JS/TS tooling | `plugins/kit/modules/js-tooling/rules.md` (+ `template/.oxlintrc.json` if a lint rule enforces it) |
| UI rule short enough for every session | `plugins/kit/modules/ui/rules.md` |
| UI knowledge with nuance (surfaces, nesting, type, motion, stability) | `plugins/ui-craft/skills/ui-craft/references/<topic>.md` |
| Skeletons / loading states | `plugins/ui-craft/skills/loading-skeletons/SKILL.md` |
| React / React Compiler | `plugins/kit/modules/react-spa/rules.md`, or `plugins/react/skills/react-profiling/SKILL.md` for profiling |
| Cloudflare hosting / Workers | `plugins/kit/modules/cloudflare-spa/rules.md`, `plugins/kit/modules/cloudflare-workers/rules.md`, or `plugins/cloudflare/skills/workers-backend/SKILL.md` for procedures |
| Scaffolded code itself | the module's `template/` (keep it building: see the kit README) |

Prefer extending an existing bullet over adding a new one. If a rule can be enforced by a tool (lint rule, test, type), do that too and mention it.

## 3. Write it

- One bullet: the rule, then a short reason (**why** it matters, often the bug or the look that prompted it). Concrete over abstract: name the property, the token, the pattern.
- Same voice as the file; no story of the session, no dates, no project names unless they're the example.
- Show the user the diff in the kit repo. Don't commit unless they ask.

## 4. Propagate

- Rules in `rules.md`/`claude.md`/`agents.md` reach existing projects when they refresh with the `adopt` skill (or run `compose.mjs … --context-only`); offer to refresh the current project.
- Skill and reference changes reach every project on the next plugin update (`/plugin marketplace update agent-kit`), with nothing to regenerate.
- Bump the plugin's `version` in its `.claude-plugin/plugin.json` when a skill changes, so updates are picked up.
