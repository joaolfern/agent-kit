## React profiling (for agents without the react-profiling skill)

Start a separate dev server with `REACT_DEVTOOLS_MCP=true pnpm exec vite --port 5175 --strictPort`; Chrome DevTools MCP then exposes React DevTools tools (`react_start_profiling`, `react_get_trace_overview`…) through `list_3p_developer_tools` / `execute_3p_developer_tool`. Trust per-commit `renderDuration` and the commit count; don't rank by `selfDuration` or `componentsChanged` (they include skipped fibers with stale durations).
