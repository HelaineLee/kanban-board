# 📋 Kanban Bloom
<p align="center">
  <img src="./public/logo-kanban-bloom-white.svg" alt="Kanban Bloom"/>
</p>

Next.js 16, Prisma, NextAuth, Zustand, PostgreSQL로 구현한 팀 기반 칸반 보드입니다.

- [배포 링크](https://kanban-board-virid-ten.vercel.app/)
- 핵심 역량: 풀스택 구조 설계, 인증, 권한 관리, 낙관적 UI
- 주요 기능: 보드 생성, 컬럼/태스크 관리, 팀 역할 관리, 계정 탈퇴
- 테스트: Vitest 기반 서비스/유틸 테스트
- 현재 상태: Pusher 연동 및 멀티 클라이언트 반영을 통한 실시간 동기화
- 계획: 태스크 담당자 지정 기능 추가 예정
- [English version](./README.md)

## 📌 프로젝트 개요

이 프로젝트는 **Next.js 16 (App Router)** 로 구축한 **실시간 협업 칸반 보드**입니다.
**Server Components, Server Actions, 그리고 클라이언트 상태 관리**를 활용한 현대적인 풀스택 아키텍처를 보여주는 예제입니다.

목표는 단순히 기능 구현에 그치지 않고, 다음을 함께 보여주는 데 있습니다.

* 확장 가능한 아키텍처 결정
* 실시간 동기화 패턴
* 관심사의 명확한 분리

---

## 🔖 아키텍처 요약

```
Client (React + Zustand)
        ↓
Server Components (Next.js)
        ↓
Server Actions / Route Handlers
        ↓
Database (PostgreSQL via Prisma)
        ↓
Realtime Layer (Pusher Channels)
```

---

## 🛠️ 기술 스택

## 아키텍처 스타일

이 프로젝트는 **Next.js App Router**를 기반으로 구축된 **기능 기반 수직 슬라이스 아키텍처**로, 각 슬라이스 내부에 **관심사 분리가 계층적**으로 이루어져 있습니다.

실제로 다음과 같은 구조를 가지고 있습니다.

* `app/`: 라우팅 및 페이지 구성 처리
* `components/`: 재사용 가능한 프레젠테이션/UI 요소
* `features/`: 비즈니스 기능별로 보드/작업 로직 그룹화
* `server/`: 서버 액션 및 서버 측 애플리케이션 로직
* `lib/` 및 `prisma/`: 인증, 데이터베이스, 유효성 검사, 실시간 연결과 같은 인프라 관련 기능 제공

이는 고전적인 MVC 구조도 **아니고**, 모든 곳에 명시적인 포트/어댑터를 사용하는 엄격한 교과서적인 클린 아키텍처도 **아닙니다**. **수직 슬라이스**와 **깔끔한 계층화**를 결합한 실용적이고 모듈화된 Next.js 아키텍처에 더 가깝습니다.

---

| Layer      | Technology              | Reason                        |
| ---------- | ----------------------- | ----------------------------- |
| Framework  | Next.js 16 (App Router) | 현대적인 SSR + RSC 아키텍처   |
| Language   | TypeScript              | 타입 안정성                   |
| Database   | PostgreSQL              | 관계형 + 확장성               |
| ORM        | Prisma                  | 높은 개발 생산성              |
| State      | Zustand                 | 가벼운 클라이언트 상태 관리   |
| Styling    | Tailwind CSS            | 빠른 UI 개발                  |
| Realtime   | Pusher Channels         | Vercel 호환 실시간 협업        |
| Validation | Zod                     | 런타임 검증                   |

---

## 🧩 핵심 설계 결정

### 1. Server Components 우선

**이유:**

* 클라이언트 번들 크기 감소
* 데이터 페칭을 서버로 이동
* 성능 개선

**패턴:**

* Server Component에서 데이터를 가져옴
* Client Component에 props로 전달

```tsx
const board = await getBoard(boardId);
return <Board initialData={board} />;
```

---

### 2. 변경 작업은 Server Actions 사용

**이유:**

* 불필요한 API 보일러플레이트 제거
* 로직을 UI 가까이에 유지
* 내부 액션 처리에서는 REST보다 더 나은 개발 경험 제공

**사용 예시:**

* 작업 생성
* 작업 이동
* 보드 상태 업데이트

---

### 3. Zustand로 클라이언트 상태 관리

**왜 React Query가 아닌가?**

* 이 앱은 드래그 앤 드롭처럼 상호작용 비중이 큼
* 빠른 로컬 상태 업데이트가 필요함

**사용 범위:**

* 드래그 상태
* Optimistic UI 업데이트
* 임시 UI 상태

---

### 4. Optimistic UI

**문제:**
서버 응답을 기다리면 UX가 느려집니다.

**해결책:**

* UI를 즉시 업데이트
* 백그라운드에서 서버와 동기화
* 실패 시 롤백

---

### 5. 실시간 동기화

**흐름:**

1. 사용자가 작업을 업데이트함(드래그)
2. Optimistic UI가 즉시 반영됨
3. Server Action이 DB를 업데이트함
4. 실시간 제공자를 통해 이벤트 발행
5. 다른 클라이언트가 업데이트를 수신
6. 모든 사용자 화면의 UI가 동기화됨

---

### 6. 기능 단위 구조

타입별(`components`, `services`)로 묶는 대신, **기능(feature)** 기준으로 그룹화합니다.

```
/features
  /board
  /task
```

**이유:**

* 더 나은 확장성
* 유지보수 용이성
* 로직 소유 범위가 명확함

---

## 📁 폴더 구조 철학

이 프로젝트는 라우팅을 `app/` 안에 유지하고, 재사용 가능한 로직은 최상위 feature, server, utility 폴더로 분리합니다.
이런 구조는 앱이 커져도 라우트 파일, 도메인 로직, 공용 UI 관심사가 뒤섞이지 않도록 도와줍니다.

```text
/
├─ app/
│  ├─ (auth)/
│  │  ├─ login/page.tsx
│  │  └─ register/page.tsx
│  ├─ (dashboard)/
│  │  ├─ account/page.tsx
│  │  └─ boards/
│  │     ├─ page.tsx                  # 보드 목록 페이지
│  │     └─ [boardId]/
│  │        ├─ page.tsx               # 메인 칸반 보드 페이지
│  │        ├─ loading.tsx
│  │        └─ error.tsx
│  ├─ api/
│  │  ├─ auth/[...nextauth]/route.ts
│  │  ├─ boards/route.ts
│  │  ├─ columns/route.ts
│  │  ├─ realtime/auth/route.ts       # 비공개 채널 인증
│  │  ├─ realtime/route.ts            # 실시간 웹훅 / 이벤트
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
└─ proxy.ts                           # Next.js 16에서 middleware.ts를 대체
```

---

## 🔄 데이터 흐름

### 읽기 흐름

```
Request → Server Component → Prisma → DB → UI
```

### 쓰기 흐름

```
User Action → Client → Server Action → DB
                               ↓
                         Realtime Event
                               ↓
                        Other Clients Update
```

---

## ⚡ 성능 고려 사항

### 1. 서버 측 데이터 페칭

* 클라이언트 측 API 호출 감소
* 초기 로딩 시간 개선

### 2. 최소한의 클라이언트 상태

* 상호작용 상태만 클라이언트에 유지
* 나머지는 서버 주도 방식으로 관리

### 3. 점진적 렌더링

* 로딩 상태 (`loading.tsx`)
* 에러 바운더리 (`error.tsx`)

---

## 🔐 보안 고려 사항

* Server Actions에서 모든 입력값 검증
* 데이터베이스 접근은 서버 측에서만 수행
* (선택 사항) 인증 계층으로 보드 접근 제한

---

## 📈 확장성 고려 사항

### 현재(단순한 구조)

* 단일 DB 인스턴스
* Prisma 직접 쿼리

### 향후 개선점

* 캐싱 레이어 도입(Redis)
* 이벤트 큐(Kafka / SQS)
* 보드 단위 샤딩
* Rate limiting

---

## ↔️ 트레이드오프

| Decision                    | Trade-off                          |
| --------------------------- | ---------------------------------- |
| Zustand instead of React Query | 내장 캐싱 기능은 더 적음         |
| Server Actions instead of REST | 외부 API 유연성은 더 낮음       |
| Simple ordering (timestamp) | 복잡한 정렬에는 완벽하지 않음     |

---

## 🚀 향후 개선 기능

* ✅ 실시간 프레즌스(누가 온라인인지 표시)
* ⏳ 실행 취소 / 다시 실행 (가벼운 event sourcing)

---

## ✒️ 이 프로젝트가 보여주는 것

* 현대적인 Next.js 아키텍처(App Router)
* 실시간 시스템 설계의 기초
* 관심사의 명확한 분리
* 프로덕션 지향적 사고방식

---

## 📑 결론

이 프로젝트는 **복잡성보다 명확성**에 초점을 맞춥니다.

과도한 설계 대신, 다음을 보여줍니다.

* 최신 도구의 올바른 활용
* 신중한 아키텍처 결정
* 실제 협업에 가까운 패턴

---

## ▶️ 실행 방법

```bash
npm install
npx prisma migrate dev
npm run dev
```

Vercel 호환 협업을 위한 실시간 설정:

```bash
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=...
NEXT_PUBLIC_PUSHER_KEY=...
NEXT_PUBLIC_PUSHER_CLUSTER=...
```

`NEXT_PUBLIC_PUSHER_KEY`는 `PUSHER_KEY`와 일치해야 하며, `NEXT_PUBLIC_PUSHER_CLUSTER`는 `PUSHER_CLUSTER`와 일치해야 합니다.

---

## 🧪 테스트

자동화된 테스트를 실행하려면 다음 명령을 사용하십시오:

```bash
npm test
```

이 프로젝트는 **Vitest**를 사용하며, 테스트는 `tests/` 아래에 정리되어 있습니다. 이는 `tests/features/*` 및 `tests/lib/*`와 같은 주요 애플리케이션 영역을 반영합니다.

기능이 추가되거나 동작이 변경될 경우, 관련 테스트 코드도 동일한 변경 사항에 포함되거나 업데이트되어야 문서화된 아키텍처와 구현이 일관성을 유지할 수 있습니다.

---

## 📬 피드백

제안이나 개선 아이디어가 있다면 언제든 이슈나 PR을 열어 주세요.

---

## 📝 개발자 노트

이 프로젝트는 [코덱스](https://openai.com/codex/)를 활용하여 바이브 코딩으로 제작되었습니다.
