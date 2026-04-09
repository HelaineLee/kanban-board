# 🧠 Shared Kanban Board — Architecture Overview

## 📌 Project Overview

> This project was created using Vibe coding with [Codex](https://openai.com/codex/)

This project is a **real-time collaborative Kanban board** built with **Next.js 16 (App Router)**.
It demonstrates modern full-stack architecture using **Server Components, Server Actions, and client-side state management**.

The goal is not just functionality, but to showcase:

* Scalable architecture decisions
* Real-time synchronization patterns
* Clean separation of concerns

---

## 🏗️ Architecture Summary

```
Client (React + Zustand)
        ↓
Server Components (Next.js)
        ↓
Server Actions / Route Handlers
        ↓
Database (PostgreSQL via Prisma)
        ↓
Realtime Layer (Pusher / WebSocket)
```

---

## ⚙️ Tech Stack

| Layer      | Technology              | Reason                        |
| ---------- | ----------------------- | ----------------------------- |
| Framework  | Next.js 16 (App Router) | Modern SSR + RSC architecture |
| Language   | TypeScript              | Type safety                   |
| Database   | PostgreSQL              | Relational + scalable         |
| ORM        | Prisma                  | Developer productivity        |
| State      | Zustand                 | Lightweight client state      |
| Styling    | Tailwind CSS            | Rapid UI development          |
| Realtime   | Pusher / WebSocket      | Live collaboration            |
| Validation | Zod                     | Runtime validation            |

---

## 🧩 Key Design Decisions

### 1. Server Components First

**Why:**

* Reduce client bundle size
* Move data fetching to the server
* Improve performance

**Pattern:**

* Fetch data in Server Components
* Pass data to Client Components as props

```tsx
const board = await getBoard(boardId);
return <Board initialData={board} />;
```

---

### 2. Server Actions for Mutations

**Why:**

* Eliminate boilerplate API layers
* Keep logic close to UI
* Better DX than REST for internal actions

**Used for:**

* Creating tasks
* Moving tasks
* Updating board state

---

### 3. Client State with Zustand

**Why not React Query?**

* This app is interaction-heavy (drag & drop)
* Needs fast, local state updates

**Used for:**

* Drag state
* Optimistic UI updates
* Temporary UI state

---

### 4. Optimistic UI

**Problem:**
Waiting for server response slows UX.

**Solution:**

* Update UI immediately
* Sync with server in background
* Rollback if failure

---

### 5. Realtime Synchronization

**Flow:**

1. User updates task (drag)
2. Optimistic UI updates instantly
3. Server Action updates DB
4. Event emitted via realtime provider
5. Other clients receive update
6. UI syncs across all users

---

### 6. Feature-Based Structure

Instead of grouping by type (`components`, `services`), we group by **feature**:

```
/features
  /board
  /task
```

**Why:**

* Better scalability
* Easier to maintain
* Clear ownership of logic

---

## 📁 Folder Structure Philosophy

This project keeps routing inside `app/` and moves reusable logic into top-level feature, server, and utility folders.
That split makes it easier to grow the app without mixing route files, domain logic, and shared UI concerns together.

```text
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
```

---

## 🔄 Data Flow

### Read Flow

```
Request → Server Component → Prisma → DB → UI
```

### Write Flow

```
User Action → Client → Server Action → DB
                               ↓
                         Realtime Event
                               ↓
                        Other Clients Update
```

---

## ⚡ Performance Considerations

### 1. Server-Side Data Fetching

* Reduces client-side API calls
* Improves initial load time

### 2. Minimal Client State

* Only interactive state lives in client
* Everything else is server-driven

### 3. Incremental Rendering

* Loading states (`loading.tsx`)
* Error boundaries (`error.tsx`)

---

## 🔐 Security Considerations

* Server Actions validate all inputs
* Database access only happens server-side
* (Optional) Auth layer restricts board access

---

## 📈 Scalability Considerations

### Current (Simple)

* Single DB instance
* Direct Prisma queries

### Future Improvements

* Introduce caching layer (Redis)
* Event queue (Kafka / SQS)
* Board-level sharding
* Rate limiting

---

## 🧪 Trade-offs

| Decision                    | Trade-off                       |
| --------------------------- | ------------------------------- |
| Zustand over React Query    | Less built-in caching           |
| Server Actions over REST    | Less external API flexibility   |
| Simple ordering (timestamp) | Not perfect for complex sorting |

---

## 🚀 Future Enhancements

* ✅ Drag & drop (@dnd-kit)
* ✅ Realtime presence (who’s online)
* ⏳ Undo / redo (event sourcing lite)
* ⏳ Role-based permissions
* ⏳ Offline support

---

## 🧠 What This Project Demonstrates

* Modern Next.js architecture (App Router)
* Real-time system design basics
* Clean separation of concerns
* Production-oriented thinking

---

## 🏁 Conclusion

This project focuses on **clarity over complexity**.

Instead of over-engineering, it demonstrates:

* Correct use of modern tools
* Thoughtful architectural decisions
* Real-world collaboration patterns

---

## 📎 How to Run

```bash
npm install
npx prisma migrate dev
npm run dev
```

---

## 📬 Feedback

If you have suggestions or improvements, feel free to open an issue or PR.
[Korean version](./README.ko.md)
