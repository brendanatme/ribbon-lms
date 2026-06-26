# Ribbon LMS

A modular, TypeScript full-stack Learning Management System vertical slice with three role-scoped dashboards.

- **Student** — browse the course catalog, enroll, take lessons, track progress.
- **Teacher** — create and manage courses, modules, and lessons; view per-course analytics.
- **Admin** — manage users and roles.

Signup is free; no payment is required.

## Stack

| Layer | Technology |
|---|---|
| Backend | NestJS, Prisma, PostgreSQL, JWT (Passport), argon2 |
| Frontend | React, Vite, TanStack Query, React Router, Tailwind, Recharts |
| Shared | Zod schemas + types consumed by both ends |
| Tooling | pnpm workspaces, Vitest, TypeScript (strict), ESLint, Prettier, Husky |

## Layout

```
apps/
  api/      NestJS backend (auth, users, courses, enrollments, analytics)
  web/      React frontend (auth, admin, teacher, student features)
packages/
  shared/   Zod schemas, enums, DTO types — single source of truth
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- A running PostgreSQL instance

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Configure the API environment
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env and set DATABASE_URL + a strong JWT_SECRET

# 3. Generate the Prisma client and run migrations
pnpm db:generate
pnpm db:migrate

# 4. Seed demo data (admin, teacher, students, a sample course)
pnpm db:seed
```

## Running

```bash
# Run API + web together
pnpm dev

# Or individually
pnpm --filter @ribbon/api dev    # http://localhost:3001/api
pnpm --filter @ribbon/web dev    # http://localhost:5174
```

The web dev server proxies `/api` to the backend, so no CORS setup is needed in development.

## Demo accounts

All seeded accounts use the password `Password123!`.

| Role | Email |
|---|---|
| Admin | admin@ribbon.dev |
| Teacher | teacher@ribbon.dev |
| Student | student@ribbon.dev |
| Student | student2@ribbon.dev |

## Testing

```bash
pnpm test
```

API integration tests require a reachable `DATABASE_URL` (point it at a disposable test database). Frontend tests run against jsdom.

## Linting & formatting

ESLint and Prettier are configured once at the workspace root and shared across
all three projects, so style is consistent end to end.

```bash
pnpm lint            # ESLint across the whole repo
pnpm lint:fix        # ESLint with --fix
pnpm format          # Prettier --write
pnpm format:check    # Prettier --check (no writes)

pnpm --filter @ribbon/web lint   # lint / format a single project
```

A Husky pre-commit hook runs `lint-staged` on every commit: staged files are
auto-fixed with ESLint and formatted with Prettier, and a commit is rejected if
an unfixable lint error remains. The hook is installed automatically by
`pnpm install`, but **requires Node 20** to run — activate it (`nvm use 20`)
before committing.

## Architecture notes

- **RBAC is enforced server-side.** A global JWT guard authenticates every request; routes opt out with `@Public()`. Role checks use a `RolesGuard` + `@Roles()` decorator. Ownership checks (a teacher only touches their own courses) live in the service layer, not just the guard. Client-side route guards mirror this for UX only — the server is authoritative.
- **Validation is shared.** Zod schemas in `packages/shared` validate requests on the backend (via a `ZodValidationPipe`) and are reused as types on the frontend, eliminating drift.
- **Errors have a consistent shape.** A global exception filter returns `{ statusCode, message, code, issues }`.
- **Progress** is computed from `LessonProgress` rows against the total lesson count per course.

## API surface

Auth: `POST /auth/signup`, `POST /auth/login`, `GET /auth/me`
Admin: `GET /users`, `PATCH /users/:id/role`, `PATCH /users/:id/status`
Teacher: `GET /teacher/courses`, `POST /courses`, `PATCH /courses/:id`, `DELETE /courses/:id`, `PATCH /courses/:id/publish`, `POST /courses/:id/modules`, `POST /modules/:id/lessons`, `GET /analytics/courses/:id`
Student: `GET /catalog`, `GET /catalog/:id`, `POST /enrollments`, `GET /enrollments`, `POST /lessons/:id/complete`

## Extension points

Quizzes & grading, video/file lesson assets, certificates, notifications, course reviews, admin audit logs, soft-delete, and multi-org tenancy.
