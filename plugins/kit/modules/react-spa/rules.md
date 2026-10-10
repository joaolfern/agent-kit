## Stack: Vite + React 19 SPA

Vite + React 19 (React Compiler) + react-router 7 + TanStack Query + SCSS modules, with MSW mocks.

### Commands

- **Dev:** `pnpm dev`. With `VITE_ENABLE_MOCKS` not set to `false`, MSW serves mock data (`src/__mocks__`), so pages work without a backend.
- **Type-check + build:** `pnpm build` (`tsc -b && vite build`, TypeScript 7 native compiler) is the type-check step; it also type-checks the tests. There is no separate `typecheck` script.
- **Tests:** Vitest + React Testing Library + `user-event` (config in `vite.config.ts`, setup in `vitest.setup.ts`). Run one file: `pnpm exec vitest run <name>`.
- **Before calling a change done:** `pnpm lint` and `pnpm build`.

### Architecture: feature-based colocation

Code that changes together lives together.

- `src/components/`, `src/hooks/`, `src/utils/`, `src/constants/`, `src/contexts/` are **global**: only pieces that are generic and agnostic of business rules (`<Button/>`, `useDebounce`). Never put feature logic there.
- `src/pages/<Feature>/` is a **self-contained domain** owning its `components/`, `hooks/` and `utils/`. Removing a feature should mean deleting one folder. Example: `{{examples.feature}}`.
- `src/layouts/` holds page shells. `src/providers/` holds app-wide providers; `src/providers/RouterProvider/` holds the routes.
- Every page is `lazy()` in `lazyPages.tsx` and has its own skeleton as the route's `Suspense` fallback.
- Use the `@/` alias (maps to `src/`) for imports outside the current feature.
- Shared domain and API shapes live in `src/interfaces/` with the `I` prefix (`IItem`).

### Styling

- SCSS modules (`Component.module.scss`) with tokens in `src/styles/tokens/` (spacing, border, typography, breakpoints, shadow, animations, mixins): `@use '@/styles/tokens/spacing.scss' as *;` then `$spacing-md`, `$radius-md`, `@include has-motion { … }`.
- Theme colours are CSS variables set by `ThemeProvider` from `src/themes/light.ts` and `dark.ts`, typed in `src/interfaces/ITheme.ts`. To add one, add it to `ITheme.ts` and to **every** theme file; keep `index.html`'s pre-React theme script in sync with `themeModes.ts`.
- Use `clsx` with the module's `styles.*` for conditional classes (see `src/components/Button/Button.tsx`).
- Skeleton bones use the `bone-text` / `bone-block` mixins on the real component's classes (see `{{examples.skeleton}}`).
- Wrap every transition/animation in `@include has-motion`.

### Data

- TanStack Query for all server state; query hooks live in the feature's `hooks/` (`{{examples.queryHook}}`).
- All requests go through the shared axios instance in `src/api/api.ts`; errors arrive as `IApiError` (`src/api/toApiError.ts`).
- Read env values through `src/config/env.ts`; never `import.meta.env` in feature code.
- Every new endpoint gets a matching MSW handler in `src/__mocks__/handlers.ts`, with data in `src/__mocks__/data/`, so the app keeps working with mocks.

### React Compiler

React Compiler (`babel-plugin-react-compiler`, via `reactCompilerPreset()` in `vite.config.ts`) is active, in Vitest too. Don't add `useMemo`/`useCallback` unless there's a verified need it can't handle.

- **Always destructure TanStack Query results**: `const { mutate: saveItem, isPending } = useSaveItem()`, never `const save = useSaveItem()` + `save.mutate()`. The result object is new every render (only `mutate`/`mutateAsync`/`refetch` are stable), so depending on it re-creates every function and child prop that uses it.
- **Declare helper functions before the code that uses them** (e.g. above a hook call whose inline callbacks call them). Functions used before their declaration are not memoized.
- **No `?.`, `??`, `&&` or ternaries inside a `try`/`catch`**: the compiler bails out of the whole component/hook. Move the expression into a small helper called from the `try`.
- **Don't read `ref.current` during render**, and don't return closures that read external mutable state (localStorage, module variables) without a reactive input: the compiler caches them. Expose such state through `useSyncExternalStore` with a snapshot that *is* the data.
- Wrap every `localStorage` access in `try`/`catch` (private mode and blocked storage throw).
