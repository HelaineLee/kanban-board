/
├─ app/
│  ├─ (auth)/
│  │  ├─ login/
│  │  │  └─ page.tsx
│  │  └─ register/
│  │     └─ page.tsx
│  ├─ (dashboard)/
│  │  └─ boards/
│  │     ├─ page.tsx                  # board list page
│  │     └─ [boardId]/
│  │        ├─ page.tsx               # main kanban board page
│  │        ├─ loading.tsx
│  │        └─ error.tsx
│  ├─ api/
│  │  ├─ boards/
│  │  │  └─ route.ts
│  │  ├─ columns/
│  │  │  └─ route.ts
│  │  ├─ tasks/
│  │  │  └─ route.ts
│  │  └─ realtime/
│  │     └─ route.ts                  # realtime webhook / event endpoint
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ ui/                             # shared UI primitives
│  ├─ board/
│  │  ├─ Board.tsx
│  │  ├─ Column.tsx
│  │  ├─ TaskCard.tsx
│  │  └─ AddTaskModal.tsx
│  └─ common/
│     ├─ Navbar.tsx
│     └─ Sidebar.tsx
├─ features/
│  ├─ board/
│  │  ├─ board.service.ts             # server/domain logic
│  │  ├─ board.hooks.ts               # client hooks
│  │  ├─ board.store.ts               # local board state
│  │  └─ board.types.ts
│  └─ task/
│     ├─ task.service.ts
│     ├─ task.hooks.ts
│     └─ task.types.ts
├─ lib/
│  ├─ prisma.ts
│  ├─ auth.ts
│  ├─ pusher.ts                       # or websocket config
│  ├─ utils.ts
│  └─ validations.ts
├─ server/
│  ├─ actions/
│  │  ├─ board.actions.ts             # Server Actions
│  │  └─ task.actions.ts
│  └─ db/
│     └─ queries.ts
├─ hooks/
│  ├─ useRealtime.ts
│  └─ useDebounce.ts
├─ styles/
│  └─ globals.css
├─ prisma/
│  └─ schema.prisma
├─ types/
│  └─ index.ts
├─ env.mjs
└─ proxy.ts                           # Next.js 16 replacement for middleware.ts