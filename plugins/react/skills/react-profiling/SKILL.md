---
name: react-profiling
description: Use when investigating React render performance in a Vite + React project — slow typing or interactions, components re-rendering too often, React Compiler bailouts, or comparing render cost between the current branch and origin/main. Covers the react-devtools-cdt-mcp tools through Chrome DevTools MCP, a reliable "what re-rendered and which props changed" probe, and reading React Compiler output.
---

# React profiling

Scripts referenced below live in `scripts/` next to this file (the skill's base directory is printed when it loads).

## Setup (opt-in)

- `react-devtools-cdt-mcp` is a **browser library**, not an MCP server. The kit's react-spa template has a serve-only Vite plugin (`reactDevtoolsMcp` in `scripts/reactDevtoolsMcp.ts`) that prepends `import 'react-devtools-cdt-mcp/register'` to `src/main.tsx`. It must run before `react-dom` evaluates, so a `DEV`-guarded dynamic import does not work. It never reaches build output.
  - If the project lacks it: `pnpm add -D react-devtools-cdt-mcp` and add a plugin with `apply: 'serve'` whose `transform(code, id)` prepends the import when `id` ends with the entry file and `process.env.REACT_DEVTOOLS_MCP === 'true'`.
- The plugin only runs with `REACT_DEVTOOLS_MCP=true`. Its embedded backend conflicts with a standalone `react-devtools` app (port 8097). Never enable it on the user's own dev server; start your own on a free port: `REACT_DEVTOOLS_MCP=true pnpm exec vite --port 5175 --strictPort`, and check it with `curl -s localhost:5175/src/main.tsx | grep cdt-mcp`.
- MCP: `chrome-devtools` must run as `npx -y chrome-devtools-mcp@latest --headless=true --categoryExperimentalThirdParty=true` (the react plugin ships this `.mcp.json`). MCP tools load at session start, so after changing the config the user has to `/mcp` → reconnect.

## Calling the tools

- **chrome-devtools MCP:** `list_3p_developer_tools`, then `execute_3p_developer_tool({toolName, params})`. For a whole measurement in one call, use `evaluate_script` with `window.__dtmcp.executeTool(name, params)`: start profiling, drive the interaction in the page, stop, and return only the summed `renderDuration`. To type into a controlled field from the page, set the value with `Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set` (or `HTMLTextAreaElement`) and dispatch a bubbling `input` event per character.
- **Playwright MCP fallback:** the page answers a synthetic discovery event. Inside `browser_run_code_unsafe`:
  ```js
  const call = (name, args = {}) => page.evaluate(async ([n, a]) => {
    let group = null
    const ev = new Event('devtoolstooldiscovery')
    ev.respondWith = (g) => { group = g }
    window.dispatchEvent(ev)
    return await group.tools.find((t) => t.name === n).execute(a)
  }, [name, args])
  ```
  Delete any harness file you put in the repo when done; they trip the linter.

Tools: `react_start_profiling` / `react_stop_profiling` / `react_get_trace_overview` / `react_get_commit_report`, plus tree inspection (`react_find_components`, `react_get_component_by_uid` with `includeHooks`, `react_get_owner_stack`, `react_get_parent_stack`, `react_get_component_source`).

## Trust these numbers, not those

- **Trust:** `renderDuration` per commit from `react_get_trace_overview`, and the commit count. Sum them per interaction and compare runs.
- **Don't trust:** `componentsChanged` and the component list in `react_get_commit_report`. They include fibers React skipped, carrying **stale** durations from their last real render. Don't rank bottlenecks by summed `selfDuration`.
- **To learn what actually re-rendered and why**, inject `scripts/why-did-render.js` with `evaluate_script`. It wraps `__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot` and counts only fibers that really rendered, keyed by the **prop names whose identity changed**. Output like `Sidebar [onOpen,onDelete]: 5` over 5 keystrokes points straight at unstable callbacks. `window.__whyStart()` … interact … `window.__whyStop()`.

## Finding the cause of an unstable prop

1. Compile the file and read the memo cache guards: `node <skill dir>/scripts/compiler-check.cjs src/path/File.tsx` prints `CompileSuccess`/`CompileError` per function; `--code` prints the compiled code. `grep -nE '^\s+if \(\$'` on that output: every `$[n] !== x` is a dependency.
2. Typical culprits:
   - a dependency on a whole `useMutation`/`useQuery` result (a new object every render) — destructure `mutate`/`refetch` instead
   - a function declared after its first use, which is never memoized (no `$[...]` guard)
   - a compiler bailout (no `_c(` in that function), often `?.`, `??`, `&&` or a ternary inside `try`/`catch`
   - reading `ref.current` or external mutable state during render — use `useSyncExternalStore` with a snapshot that is the data

## Comparing against main

- Use a fresh `origin/main`, not local `main`: `git fetch origin main && git worktree add --detach ../<repo>-main origin/main`, `pnpm install`, copy `.env.local`, and run it on another port. Remove the worktree afterwards.
- Profile both in dev, warm each route once first (Vite compiles routes on first visit), and repeat each interaction at least 3 times. Single runs vary by 2× or more.
- If the backend rate-limits (`429`), data stops rendering and numbers look falsely cheap. Check the console and stop when that happens.
- The profiler can't see the initial mount (the tools register during it). Profile interactions and client-side navigations instead.
