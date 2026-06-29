# MVP Implementation Prompts

Sequential prompts to implement the full MVP. Each prompt = one focused scope = one meaningful git commit.

---

## Phase 1 — Backend Foundation

### P1 — Scaffold Backend Project
```
Scaffold the backend Express.js + TypeScript project.
Set up the folder structure as per ARCHITECTURE.md and FRONTEND.md conventions:
- src/features/ (empty)
- src/middleware/
- src/lib/ (db connection placeholder)
- src/app.ts (Express app entry)
- src/server.ts (HTTP server entry)
Include: tsconfig.json, package.json with all base dependencies
(express, typescript, drizzle-orm, pg, zod, jsonwebtoken, cookie-parser, cors, dotenv).
No feature code yet. Commit as: chore: scaffold backend project
```

### P2 — Database Setup
```
Set up Drizzle ORM with Supabase PostgreSQL for the backend.
- Create src/lib/db.ts (Drizzle + pg pool connection using .env variables)
- Create all schema files in src/db/schema/ based on DATABASE.md:
  users, authors, journals, volumes, issues, articles,
  categories, keywords, bookmarks, reading_lists, notifications,
  and all junction tables (article_authors, article_categories, article_keywords, reading_list_articles).
- Add drizzle.config.ts
- Add .env.example with required variables.
No migrations yet, just schema definitions.
Commit as: feat(db): define drizzle schema for all tables
```

### P3 — Run Migrations
```
Generate and run the initial Drizzle ORM migration for the database.
- Generate migration files from the existing schema
- Add the search_vector tsvector column and GIN index for articles table
- Add a migration script to package.json
- Add a seed script placeholder in src/db/seed.ts
Commit as: feat(db): run initial database migration
```

---

## Phase 2 — Backend Auth Feature

### P4 — Auth Feature (Register, Login, Logout)
```
Implement the authentication feature on the backend following the repository + service + controller pattern.
Routes: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout
- Use bcrypt for password hashing
- Issue JWT accessToken (15m) and refreshToken (7d) as HTTP-only secure cookies
- Validate all request bodies with Zod schemas
- Files: auth.repository.ts, auth.service.ts, auth.controller.ts, auth.routes.ts, auth.schema.ts
Commit as: feat(auth): implement register, login, logout
```

### P5 — Auth Middleware + Refresh + Me
```
Implement JWT authentication middleware and remaining auth endpoints.
- src/middleware/authenticate.ts (validates accessToken cookie, attaches user to req)
- src/middleware/authorize.ts (role-based guard: accepts allowed roles array)
- POST /api/auth/refresh (validates refreshToken cookie, re-issues accessToken)
- GET /api/auth/me (returns user profile from token)
Commit as: feat(auth): add JWT middleware, refresh token, and /me endpoint
```

---

## Phase 3 — Backend Core Domain Features

### P6 — Journals Feature
```
Implement the journals feature on the backend.
Routes:
- GET /api/journals (paginated list)
- GET /api/journals/:id (journal detail with volumes)
- GET /api/journals/:id/issues (paginated issues list)
- GET /api/issues/:id (issue detail with article table of contents)
Follow controller → service → repository pattern.
All list endpoints must support limit and offset query params.
Commit as: feat(journals): implement journal, volume, and issue endpoints
```

### P7 — Articles Feature
```
Implement the articles feature on the backend.
Routes:
- GET /api/articles (list with FTS using search_vector column, filter by journalId, categoryId, keyword)
- GET /api/articles/:id (full article detail with authors, categories, keywords)
- GET /api/articles/:id/download (redirect to Firebase Storage PDF URL, log download metric)
- POST /api/articles/:id/view (log abstract view metric)
Implement PostgreSQL FTS query using ts_rank and plainto_tsquery.
Commit as: feat(articles): implement article endpoints with full-text search
```

### P8 — Categories & Keywords
```
Implement the categories and keywords endpoints on the backend.
Routes:
- GET /api/categories
- GET /api/keywords
Simple list endpoints, no pagination required.
Commit as: feat(taxonomy): add categories and keywords endpoints
```

---

## Phase 4 — Backend User Features

### P9 — Bookmarks Feature
```
Implement the bookmarks feature on the backend (authenticated).
Routes:
- GET /api/bookmarks (paginated user bookmarks)
- POST /api/bookmarks (bookmark an article)
- DELETE /api/bookmarks/:articleId (remove bookmark)
Use authenticate middleware to protect all routes.
Commit as: feat(bookmarks): implement bookmark endpoints
```

### P10 — Reading Lists Feature
```
Implement the reading lists feature on the backend (authenticated).
Routes:
- GET /api/reading-lists
- POST /api/reading-lists
- GET /api/reading-lists/:id
- PUT /api/reading-lists/:id
- DELETE /api/reading-lists/:id
- POST /api/reading-lists/:id/articles
- DELETE /api/reading-lists/:id/articles/:articleId
Commit as: feat(reading-lists): implement reading list endpoints
```

### P11 — Notifications Feature
```
Implement the notifications feature on the backend (authenticated).
Routes:
- GET /api/notifications (with optional ?unreadOnly=true)
- PUT /api/notifications/:id/read
- PUT /api/notifications/read-all
Commit as: feat(notifications): implement notification endpoints
```

### P12 — User Profile Feature
```
Implement the user profile endpoints on the backend (authenticated).
Routes:
- GET /api/profile
- PUT /api/profile (update firstName, lastName, institution, orcid)
Commit as: feat(profile): implement user profile endpoints
```

---

## Phase 5 — Backend Admin + OJS Sync

### P13 — Author Dashboard
```
Implement the author dashboard endpoint on the backend.
Route: GET /api/author/dashboard
Returns: user's publications (articles where user is author), total views, total downloads.
Protect with authorize(['author', 'editor', 'admin']) middleware.
Commit as: feat(author): implement author dashboard endpoint
```

### P14 — Admin User Management
```
Implement admin user management endpoints on the backend.
Routes:
- GET /api/admin/users (paginated list)
- PUT /api/admin/users/:id/role (change role)
Protect with authorize(['admin']) middleware.
Commit as: feat(admin): implement user management endpoints
```

### P15 — OJS Sync Service
```
Implement the OJS Sync Service inside the backend.
- src/features/sync/ojs.client.ts (HTTP client wrapper to call the OJS REST API)
- src/features/sync/sync.service.ts (orchestrates pull: journals → volumes → issues → articles → authors)
- src/features/sync/sync.repository.ts (upsert logic using ojs_journal_id and ojs_article_id)
- Cron scheduler using node-cron (configurable interval via .env)
- POST /api/admin/sync/trigger (manual trigger, returns jobId)
- GET /api/admin/sync/status/:jobId (check sync job status)
Do not rebuild the editorial workflow — only sync already-published content.
Commit as: feat(sync): implement OJS sync service and admin trigger endpoints
```

---

## Phase 6 — Frontend Foundation

### P16 — Scaffold Frontend Project
```
Scaffold the Next.js 15 App Router frontend project with TypeScript, Tailwind CSS, and ShadCN UI.
Set up the folder structure as per FRONTEND.md:
- src/app/ (with layout.tsx and page.tsx shells)
- src/components/ui/ (ShadCN components)
- src/components/common/ (Header, Footer placeholders)
- src/features/ (empty feature folders: auth, articles, journals, search, admin)
- src/lib/ (API client setup using fetch with base URL from .env)
- src/types/ (global type stubs)
No feature code yet.
Commit as: chore: scaffold frontend project
```

### P17 — Root Layout + Shared Components
```
Implement the root layout and shared components for the frontend.
- src/app/layout.tsx (HTML shell, font, metadata, providers)
- src/components/common/Header.tsx (site name, nav links: Home, Journals, Search, Login)
- src/components/common/Footer.tsx (copyright, links)
- src/components/common/Navbar.tsx (client-side nav state: auth-aware links)
Commit as: feat(layout): implement root layout and shared header/footer
```

---

## Phase 7 — Frontend Public Pages

### P18 — Home Page
```
Implement the homepage at src/app/page.tsx (Server Component).
- Hero section with a centered search bar (large, prominent)
- Recent journals section (fetch from /api/journals)
- Recent articles section (fetch from /api/articles with no query)
Commit as: feat(home): implement home page with search hero and recent content
```

### P19 — Search Page
```
Implement the search page at src/app/search/page.tsx.
- SearchBar.tsx (Client Component with debounced input, updates URL query params)
- SearchFilters.tsx (Client Component: journal filter, category filter)
- Results list: ArticleCard.tsx (title, authors, journal, abstract snippet, DOI link)
- Pagination controls
- Uses useSearch hook with /api/articles?query=...
Commit as: feat(search): implement search page with filters and article cards
```

### P20 — Journals Page
```
Implement the journals listing and detail pages.
- src/app/journals/page.tsx (Server Component, list of all journals)
- src/app/journals/[id]/page.tsx (Server Component, journal detail: volumes + issues TOC)
- src/app/journals/[id]/issues/[issueId]/page.tsx (issue TOC: article list)
- JournalCard.tsx, IssueList.tsx components
Commit as: feat(journals): implement journal listing and detail pages
```

### P21 — Article Detail Page
```
Implement the article detail page at src/app/articles/[id]/page.tsx (Server Component).
- Title, authors (with ORCID links), journal/issue/DOI metadata
- Abstract section
- Keywords + Categories tags
- PDF download button (links to /api/articles/:id/download)
- Embedded PDFViewer.tsx (iframe or PDF.js wrapper)
- BookmarkButton.tsx (Client Component, auth-aware)
Commit as: feat(articles): implement article detail page with PDF viewer
```

---

## Phase 8 — Frontend Auth Pages

### P22 — Auth Pages
```
Implement the login and register pages.
- src/app/login/page.tsx (LoginForm.tsx Client Component with Zod validation)
- src/app/register/page.tsx (RegisterForm.tsx Client Component)
- useAuth.ts hook (login, logout, register mutations against /api/auth/*)
- Auth context or lightweight global state for user session
- Redirect to home on success; display field errors on failure
Commit as: feat(auth): implement login and register pages with auth hook
```

---

## Phase 9 — Frontend Authenticated Features

### P23 — Bookmarks & Reading Lists Pages
```
Implement the authenticated user features pages.
- src/app/bookmarks/page.tsx (list of bookmarked articles)
- src/app/reading-lists/page.tsx (list of reading lists)
- src/app/reading-lists/[id]/page.tsx (articles in a specific reading list)
- useBookmarks.ts and useReadingLists.ts hooks
Commit as: feat(user): implement bookmarks and reading list pages
```

### P24 — Author Dashboard
```
Implement the author dashboard at src/app/author/page.tsx.
- Protected route (redirect if role is not author/editor/admin)
- Lists publications (articles linked to the logged-in author)
- Shows view and download counts per article
Commit as: feat(author): implement author dashboard page
```

---

## Phase 10 — Frontend Admin Panel

### P25 — Admin Panel
```
Implement the admin panel at src/app/admin/ (protected, admin role only).
- src/app/admin/page.tsx (overview dashboard)
- src/app/admin/users/page.tsx (user list with role update modal)
- src/app/admin/sync/page.tsx (OJS sync trigger button, status display, sync logs)
- useAdmin.ts hook
Commit as: feat(admin): implement admin panel with user management and sync control
```

---

## Completion

After P25, the MVP is fully implemented. Run a final pass:

```
Review the entire codebase for:
- Unused imports or dead code
- Missing Zod validations
- Any console.log statements left in production code
- Missing error handling in API routes
- Ensure all list endpoints have pagination
Fix any issues found. Commit as: chore: final MVP cleanup and review
```
