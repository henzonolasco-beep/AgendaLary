# Agenda Escolar 6º C

Agenda web responsiva para consultar atividades, conteúdos e avisos da turma 6º C.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Set `ADMIN_SIGNUP_CODE` as a server-side secret (minimum 16 characters) to enable administrator registration.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for school API contracts.
- `lib/db/src/schema/` — persistent accounts, activities, and announcements.
- `artifacts/api-server/src/routes/school.ts` — authenticated school API and admin-only content mutations.
- `artifacts/agenda-escolar-6c/` — student and administrator web app.

## Architecture decisions

- The app owns username/password registration and opaque database-backed sessions; passwords are hashed with scrypt.
- The optional administrator signup code is checked only on the server; clients cannot submit or change a role.
- Clerk accounts are not transferred; existing school publications and user rows are preserved.
- Calendar-day due dates are kept as `YYYY-MM-DD` and interpreted in the America/Fortaleza timezone.

## Product

Students can review upcoming and past activities and class announcements. Administrators can publish, edit, and remove those records.

## User preferences

Interface language is Brazilian Portuguese, with responsive navigation for mobile and desktop.

## Gotchas

- Keep `ADMIN_SIGNUP_CODE` in Replit Secrets and Production app secrets only; never expose it to the web client or logs.
- Names and usernames are required at signup; usernames are normalized to lowercase for login.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
