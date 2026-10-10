## JS/TS tooling

- **Package manager:** `pnpm` only (there is a `pnpm-lock.yaml`); never `npm` or `yarn` to install. Dependencies with build scripts must be allowed in `pnpm-workspace.yaml` (`allowBuilds`).
- **Lint:** `pnpm lint` (oxlint, `.oxlintrc.json`, with `--fix` and `--deny-warnings`). It flags inline comments and warning-style comments (`todo`, `fix`, `add`…), and commented-out code, so they fail the lint.
- **Format:** Prettier (`.prettierrc`): no semicolons, single quotes (JSX too), trailing commas `es5`, 80 columns.
- **Hooks:** husky runs `lint-staged` (oxlint + Prettier) on commit and the test suite on push.
- **Naming:** `camelCase` for variables, functions and properties; `PascalCase` for components, classes and types.
