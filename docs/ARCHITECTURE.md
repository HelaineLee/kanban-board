# Architecture

This project is a Next.js 16 App Router application for a kanban board with authentication, Prisma-based persistence, and realtime board updates.

## Folder Structure

```text
/
├─ app/
│  ├─ (auth)/
│  │  ├─ login/page.tsx
│  │  └─ register/page.tsx
│  ├─ (dashboard)/
│  │  ├─ account/page.tsx
│  │  └─ boards/
│  │     ├─ page.tsx                  # board list page
│  │     └─ [boardId]/
│  │        ├─ page.tsx               # main kanban board page
│  │        ├─ loading.tsx
│  │        └─ error.tsx
│  ├─ api/
│  │  ├─ auth/[...nextauth]/route.ts
│  │  ├─ boards/route.ts
│  │  ├─ boards/[boardId]/route.ts    # single board fetch for realtime sync
│  │  ├─ columns/route.ts
│  │  ├─ realtime/auth/route.ts       # private channel authorization
│  │  ├─ realtime/route.ts            # realtime webhook / event
│  │  └─ tasks/route.ts
│  ├─ generated/prisma/
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ auth/
│  ├─ board/
│  └─ common/
├─ features/
│  ├─ board/
│  └─ task/
├─ hooks/
├─ lib/
│  └─ i18n/
├─ server/
│  ├─ actions/                        # Server Actions
│  └─ db/
├─ prisma/
│  ├─ migrations/
│  └─ schema.prisma
├─ public/
├─ styles/
├─ tests/
│  ├─ features/
│  ├─ lib/
│  └─ mocks/
├─ types/
├─ env.mjs
└─ proxy.ts                           # Next.js 16 replacement for middleware.ts
```

## Layer Responsibilities

### `app/`
- Owns route structure, layouts, route groups, and HTTP endpoints.
- `app/(auth)` contains authentication pages.
- `app/(dashboard)` contains authenticated product pages such as board views and account settings.
- `app/api` exposes route handlers for auth, boards, columns, tasks, and realtime events.
- `app/api/boards/[boardId]` returns a fully hydrated board snapshot used by clients after realtime events.
- `app/api/realtime/auth` authorizes private board channels for the managed realtime provider.
- `app/generated/prisma` contains generated Prisma client files and should be treated as generated output, not hand-maintained architecture code.

### `components/`
- Contains presentational and interaction-focused UI.
- `components/auth` holds auth forms and account actions.
- `components/board` holds kanban board UI such as board, column, task card, and create/add dialogs.
- `components/team` holds board team membership and role management UI.
- `components/common` holds shared app chrome and providers such as navigation, theme, and language helpers.

### `features/`
- Groups feature-specific client and domain logic by business area.
- `board`, `team` and `task` each keep their own hooks, service logic, local store, and feature types close together.
- This is the main place to add new feature modules when behavior grows beyond simple UI-only changes.

### `hooks/`
- Stores reusable cross-feature React hooks.
- Current examples include debounce and realtime subscription helpers such as board channel subscriptions.

### `lib/`
- Stores shared infrastructure and framework integration code.
- Includes Prisma client setup, NextAuth configuration, Pusher Channels wiring, validation helpers, utilities, and i18n helpers.
- Code here should stay generic enough to be reused by multiple features.

### `server/`
- Holds server-only application logic.
- `server/actions` contains Server Actions for auth, boards, and tasks.
- `server/db` contains shared database query helpers.

### `prisma/`
- Owns the database schema and migrations.
- `schema.prisma` defines the data model.
- `migrations/` tracks schema history and deployment changes.

### `tests/`
- Mirrors runtime code with automated coverage for features and shared modules.
- `tests/features` covers feature services and related logic.
- `tests/lib` covers shared helpers such as auth, utilities, and validations.
- `tests/mocks` stores test-only helpers and placeholders.

### `types/`
- Stores shared TypeScript declarations that extend framework or app-level types.
- Current use includes NextAuth typing.

### `public/`, `styles/`, `env.mjs`, `proxy.ts`
- `public/` stores static assets such as logos.
- `styles/` stores shared global styling assets.
- `env.mjs` centralizes environment variable loading and validation.
- `proxy.ts` contains request interception logic used in place of legacy middleware naming.

## Dependency Direction

Keep dependencies flowing inward toward shared and server-side logic:

1. `app/` composes routes with `components/`, `features/`, `lib/`, and `server/`.
2. `components/` may use `features/`, `hooks/`, and generic helpers from `lib/`.
3. `features/` may use `lib/`, `hooks/`, and server-facing APIs or actions, but should not depend on route files in `app/`.
4. `server/` may use `lib/` and `prisma/`, but should remain independent from client UI modules.
5. `lib/`, `types/`, and `prisma/` should remain reusable foundations and should not import from feature UI code.

## Feature Placement Guidelines

- Add new pages or route handlers under `app/`.
- Add reusable UI under `components/`.
- Add feature-specific business logic under `features/<feature-name>/`.
- Add server mutations or server-only workflows under `server/actions/` or `server/db/`.
- Add cross-feature utilities or integrations under `lib/`.
- Add schema changes under `prisma/schema.prisma` with a matching migration.
- Add or update automated coverage under `tests/` in the same change.

## Rules For Updating This Document

When a new feature is added, update `docs/ARCHITECTURE.md` in the same change if any of the following happen:

- A new top-level folder is introduced.
- A new feature module is added under `features/`.
- A new route group, major page area, or API surface is added under `app/`.
- A new shared infrastructure area is added under `lib/`, `server/`, `hooks/`, or `types/`.
- The dependency direction or ownership of a folder changes.

At minimum, each architecture update should:

- Reflect the new folder or module in the folder structure section.
- Add or revise the responsibility note for the affected layer.
- Mention any new dependency rule or boundary if the feature changes how modules interact.
- Stay aligned with the real repository structure rather than planned or temporary code.
