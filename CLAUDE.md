# Ribbon LMS — working notes

Team-shared guidance for working in this repo. See `README.md` for the full
project overview, stack, and API surface.

## Environment

- **Requires Node 20+** and pnpm 9. If your shell defaults to an older Node
  (e.g. via nvm), run `nvm use 20` first — otherwise pnpm fails immediately
  with a corepack `SyntaxError: Unexpected token '?'`.

## First-time setup

```bash
nvm use 20
pnpm install
cp apps/api/.env.example apps/api/.env   # set DATABASE_URL + JWT_SECRET
pnpm db:generate                         # REQUIRED before building the API (see below)
pnpm db:migrate                          # create schema in your Postgres
pnpm db:seed                             # optional: demo accounts + sample course
```

## Building / type-checking the API

- **Run `pnpm db:generate` after install, before building or type-checking.**
  The NestJS API (`apps/api`) imports types from `@prisma/client` (`User`,
  `Course`, `Prisma.UserWhereInput`, …). On a fresh checkout the generated
  client doesn't exist yet, so the build fails with ~20 errors — starting with
  `Module '"@prisma/client"' has no exported member 'User'` and cascading into
  implicit-`any` errors in the service layer.

- **The API is built with the SWC builder, not plain `tsc`.** `nest-cli.json`
  sets `"builder": "swc"`, and `apps/api/.swcrc` holds the transform config
  (CommonJS output, es2021, `legacyDecorator` + `decoratorMetadata` for NestJS
  DI). SWC is also what rewrites the `@/*` path alias to relative paths in the
  emitted JS — see [Path aliases](#path-aliases). `"typeCheck": true` keeps
  `nest build` running a real `tsc` type-check pass alongside SWC, so build-time
  type errors are still surfaced.

## Running

```bash
pnpm dev                           # API + web in parallel
pnpm --filter @ribbon/api dev      # http://localhost:3001/api
pnpm --filter @ribbon/web dev      # http://localhost:5174 (proxies /api → 3001)
pnpm build                         # pnpm -r build: shared → api + web
```

## Path aliases

Both apps import intra-app modules via the `@/*` alias (→ each app's `src/*`)
instead of deep relative paths, e.g. `import { api } from '@/lib/api.js'`. The
`@ribbon/shared` workspace alias is separate and unrelated. Convention: use
`@/…` for anything that would otherwise traverse a parent dir (`../`); keep
same-directory imports relative (`./helpers.js`).

The alias is declared once per app as tsconfig `paths` (`baseUrl` + `"@/*"`),
then each resolver in that app's toolchain is taught the same mapping:

- **Web** — `apps/web/vite.config.ts` adds the `vite-tsconfig-paths` plugin,
  which reads the tsconfig `paths`. That single plugin covers the dev server,
  `vite build`, **and** Vitest (Vitest reads the Vite config).
- **API** — three contexts, all pointing back at the same `@/*`:
  - _Build + dev + runtime:_ SWC (`.swcrc` `jsc.baseUrl` + `jsc.paths`) rewrites
    `@/…` to relative paths at compile time, so `nest build`, `nest start
    --watch`, and `node dist/main.js` all work with no runtime resolver hook.
  - _Tests:_ `apps/api/vitest.config.ts` maps `@` with a plain Vite
    `resolve.alias` (**not** `vite-tsconfig-paths` — that package is ESM-only and
    can't be `require`d by the API's CommonJS-loaded config). The same config
    passes `swcrc: false` / `configFile: false` to the test-side SWC transform so
    it ignores `.swcrc` (whose CommonJS output would break Vitest's ESM
    pipeline).

When adding a new resolver/tool to either app, remember it won't know about
`@/*` unless you wire the alias into it — tsconfig `paths` alone only satisfies
the type-checker and editor, never the bundler or runtime.

## Linting & formatting

Tooling lives at the **workspace root** and is shared by all three projects
(`apps/api`, `apps/web`, `packages/shared`) for maximum consistency:

- **Prettier** (`.prettierrc.json`) — the formatter. Single quotes, semicolons,
  trailing commas, 100-col width. `.prettierignore` excludes build output,
  Prisma migrations, the lockfile, and `*.md`.
- **ESLint flat config** (`eslint.config.mjs`) — the linter. One shared base
  (`@eslint/js` + `typescript-eslint` recommended) with `eslint-config-prettier`
  last so it never fights the formatter. Per-project layers add the
  environment-specific bits: the web app gets React + browser globals, the API
  and shared package get Node globals. ESLint walks up to this root file, so the
  per-package `lint` scripts all use it.

```bash
pnpm lint            # eslint . across the whole repo
pnpm lint:fix        # eslint . --fix
pnpm format          # prettier --write .
pnpm format:check    # prettier --check . (CI-friendly, no writes)
pnpm --filter @ribbon/web lint   # or format / format:check — per project
```

### Pre-commit hook

Husky + lint-staged run on every `git commit` (`.husky/pre-commit` →
`pnpm lint-staged`). Staged `*.ts/tsx` files are run through `eslint --fix` then
`prettier --write`; other supported files just get Prettier. A commit is
**rejected** if a non-auto-fixable lint error remains; auto-fixable formatting is
applied and re-staged transparently.

- **The hook needs Node 20**, same as everything else. If your shell defaults to
  an older Node, the hook fails on the corepack `SyntaxError` before linting even
  runs — `nvm use 20` before committing.
- `husky` is installed via the root `prepare` script, so the hook is wired up
  automatically on `pnpm install`.

## Shared package (`packages/shared`)

- Single source of truth for Zod schemas, enums, and DTO types, consumed by
  both ends.
- It compiles to **CommonJS** (the NestJS API consumes the `dist` build via
  `require`). The **web app** instead aliases `@ribbon/shared` to the package's
  TypeScript **source** in `apps/web/vite.config.ts`, so Vite/esbuild compiles
  it to ESM directly. Don't point the web app at `dist` — loading the CJS build
  as a native ES module breaks named exports in the browser.
- Build order matters for `pnpm build`: `packages/shared` must build before the
  API. `pnpm -r` handles this via the workspace dependency graph.
