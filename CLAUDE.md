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

## Running

```bash
pnpm dev                           # API + web in parallel
pnpm --filter @ribbon/api dev      # http://localhost:3001/api
pnpm --filter @ribbon/web dev      # http://localhost:5174 (proxies /api → 3001)
pnpm build                         # pnpm -r build: shared → api + web
```

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
