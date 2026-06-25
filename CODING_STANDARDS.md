# Code Optimization Rules (MVP)

This document defines practical coding and performance rules for the MVP research publishing platform built with:

- Next.js 15 (App Router)
- React
- TypeScript
- Express.js backend

Goal:
Keep code clean, fast, readable, and maintainable — not over-engineered.

---

# 1. Function Design

## 1.1 Keep functions small

- A function should do ONE thing only.
- If a function is longer than ~50 lines → split it.

## 1.2 Break large logic

Split into:

- utils/
- services/
- hooks/
- helpers/

Example:

❌ Bad:
- 200-line controller with business logic

✅ Good:
- controller → calls service → service uses repository

---

# 2. React / Next.js 15 Optimization Rules

## 2.1 Server Components First (Next.js 15 best practice)

- Use Server Components by default.
- Use Client Components only when needed:
  - useState
  - useEffect
  - event handlers

---

## 2.2 Avoid unnecessary re-renders

- Do NOT wrap everything in useState.
- Do NOT overuse useEffect.
- Keep state as local as possible.

---

## 2.3 Component splitting

Break UI into:

- page components
- layout components
- reusable components
- feature components

Example structure:

components/
  ui/
  common/
features/
  articles/
  journals/

---

## 2.4 Hooks separation

Custom hooks must be used for:

- API calls
- reusable logic
- complex state logic

Example:

- useArticles()
- useAuth()
- useSearch()

Do NOT put API logic inside components.

---

## 2.5 Avoid prop drilling

If props go deeper than 2–3 levels:

- use context OR
- move to feature-level hook

---

# 3. TypeScript Rules

## 3.1 Separate types

Always keep types separate:

types/
  article.types.ts
  user.types.ts
  journal.types.ts

Do NOT inline large types inside components.

---

## 3.2 Avoid any

- Never use `any`
- Use `unknown` if needed

---

## 3.3 Shared types between frontend and backend

If possible:

- reuse API response types
- keep consistent DTOs

---

# 4. Backend (Express.js) Rules

## 4.1 Layered architecture

Always follow:

Controller → Service → Repository

- Controller = request handling
- Service = business logic
- Repository = database queries

---

## 4.2 No business logic in controllers

Controllers should only:

- receive request
- call service
- return response

---

## 4.3 Keep APIs simple

- One endpoint = one purpose
- Avoid multi-purpose endpoints

---

# 5. Database Optimization Rules (PostgreSQL + Drizzle)

## 5.1 Avoid heavy joins

- Keep queries simple
- Denormalize only when needed

## 5.2 Use indexes properly

Index:

- article title
- journal id
- published_at

## 5.3 Avoid N+1 queries

- batch fetch where possible
- use joins carefully

---

# 6. State Management Rules (Frontend)

## 6.1 Keep state minimal

- Prefer local state
- Avoid global state unless needed

## 6.2 No unnecessary global stores

Do NOT add Redux/Zustand unless required.

---

# 7. API Optimization Rules

## 7.1 Pagination is mandatory

All list APIs must support:

- limit
- offset or cursor

---

## 7.2 Avoid overfetching

Return only required fields:

❌ Bad:
return full article + authors + metadata always

✅ Good:
return minimal fields for list view

---

# 8. Performance Rules (Next.js 15)

## 8.1 Use Server Actions / Server Components when possible

- reduce client-side JS
- improve initial load time

---

## 8.2 Avoid unnecessary client hydration

- only hydrate interactive parts
- keep static pages server-rendered

---

## 8.3 Optimize images

- use Next.js Image optimization
- lazy load images

---

# 9. File Structure Rules

Keep structure feature-based:

features/
  articles/
  journals/
  auth/
  search/

Each feature contains:

- components
- hooks
- services
- types

---

# 10. Code Quality Rules

- Keep code readable over clever
- Avoid deep nesting (max 3 levels)
- Use early returns
- Avoid duplicate logic
- Extract reusable utilities

---

# 11. What NOT to optimize in MVP

Do NOT do:

- memo everywhere
- useCallback everywhere
- premature caching layers
- microservices
- complex state management
- GraphQL

---

# 12. Golden Rule

If optimization makes code harder to read → do NOT do it.

MVP priority:
✔ correctness  
✔ simplicity  
✔ maintainability  
✔ speed of development  

# 13. Code Comments Rules (IMPORTANT)

## 13.1 When to add comments

Add comments ONLY when:

- The logic is not immediately obvious
- There is a business rule (important)
- There is a workaround or hack
- There is complex SQL or query logic
- There is a security-related decision

---

## 13.2 What to comment

Focus on WHY, not WHAT.

❌ Bad:
```ts
// increment counter
count++;