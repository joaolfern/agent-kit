## Working rules

### Code clarity over comments

Prefer clean code over comments: intent goes into well-named variables, functions and components, small extracted helpers, and early returns. Code a beginner can read in a few lines beats a paragraph explaining it, and every comment costs tokens for agents too.

- Don't narrate what the code does, restate the obvious, or tell the story of a bug.
- Keep a comment only for a non-obvious *why* the code can't express (a browser or library quirk, a platform limit, a workaround), in one short line.
- Write code that reads like the surrounding code: match its naming, idiom and comment density.

### Testing discipline

- **Targeted tests only.** Never run the entire suite locally; run the tests for the files you changed. Leave full suites, E2E and visual regression to CI.
- **Fail fast.** If a test command hangs for more than 15 seconds, kill it and treat it as failed. Don't let runners idle.
- **No pre-builds** before testing; test runners compile on the fly.
- Prefer fast unit/DOM tests for logic and interactions. Tests live next to the code they test.
- **No orphaned processes.** Stop every dev server, browser or watcher you started; don't chain kill commands to clean up ports.

### Git safety

- Never run `git commit` or `git push` (or tag, rebase, or rewrite history) unless the user asks in this conversation. Save and format files and leave committing to the user.
- Commit messages, when asked for, follow Conventional Commits (`feat:`, `fix:`, `perf:`, `refactor:`, `docs:`, `test:`, `chore:`) with a short imperative subject.

### Docs

- `docs/architecture/decisions/` holds numbered ADRs for decisions with lasting consequences (use the `adr` skill or follow the existing format).
- `docs/plans/` holds plans for multi-session work. A plan in progress keeps a "Current status and next steps" section current, so a new session can pick it up.
- `docs/owner-todo.md` lists steps only the owner can do (accounts, DNS, secrets, publishing, commits). Add a task when work needs an owner step; tick it when the owner says it's done.
