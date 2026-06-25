# Frontend Structure

This document defines the Next.js 15 (App Router) frontend directory structure for the ScienceDirect-inspired MVP.

## Design Patterns

- **Server Components First:** All page routers in `src/app/` are Server Components by default to maximize SEO and initial page load speed.
- **Client Components for Interactivity:** Interactive fragments (forms, search input, charts, bookmark toggles) are extracted into Client Components with `'use client'` directive.
- **Hook-Driven API Integration:** No raw `fetch` or API integration code exists inside React components. All network request states are encapsulated in custom React hooks (inside each feature).
- **Separation of Types:** Inline type declarations are prohibited; all types must be exported from their respective `.types.ts` files.

---

## Directory Structure

```
science-direct-frontend/
├── public/                 # Static assets (logos, fallback images)
├── src/
│   ├── app/                # Next.js App Router (Routes & Layouts)
│   │   ├── admin/          # Admin layout and sub-dashboards
│   │   ├── articles/       # Article details and PDF viewing
│   │   ├── author/         # Author dashboard
│   │   ├── journals/       # Journal listing and journal details
│   │   ├── search/         # Search page with advanced filter sidebar
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   ├── layout.tsx      # Root layout (HTML shell, Theme/Auth Providers)
│   │   └── page.tsx        # Homepage (Search landing page)
│   │
│   ├── components/         # Shared global components
│   │   ├── ui/             # ShadCN UI components (buttons, dialogs, inputs)
│   │   └── common/         # Layout components (Header, Footer, Navbar)
│   │
│   ├── features/           # Feature-based domain structures
│   │   ├── auth/           # Login, registration, profile settings
│   │   ├── articles/       # Reading, bookmarks, PDF rendering
│   │   ├── journals/       # Journals list, volumes, issue TOC
│   │   ├── search/         # Advanced query, category filters
│   │   └── admin/          # Sync manager, user manager, system stats
│   │
│   ├── hooks/              # Reusable generic custom hooks (e.g. useDebounce)
│   ├── lib/                # Config files (API clients, utility wrappers)
│   └── types/              # Global shared typescript definitions
```

---

## Feature Folder Layout

Each folder in `src/features/` must be self-contained:
```
features/some-feature/
├── components/             # Feature-specific components
├── hooks/                  # Custom hooks for state/data fetch
├── services/               # HTTP client fetching methods
└── types/                  # Type interfaces and Zod validators
```

### 1. `features/auth`
- `components/LoginForm.tsx` & `RegisterForm.tsx` (Client interactive forms).
- `hooks/useAuth.ts` (Keeps track of login state, returns login/logout mutation helpers).
- `services/auth.service.ts` (Communicates with `/api/auth` routes).
- `types/auth.types.ts` (Login request/response models).

### 2. `features/articles`
- `components/ArticleCard.tsx` (Grid/list entry showing article title, authors, DOI, and abstract snippet).
- `components/PDFViewer.tsx` (Embedded reader iframe or canvas wrapper to render PDFs securely).
- `components/BookmarkButton.tsx` (Allows readers to bookmark articles; handles optimistic state updates).
- `hooks/useArticles.ts` (Fetches individual articles, downloads, and bookmark operations).
- `services/articles.service.ts` (Communicates with `/api/articles` and `/api/bookmarks`).

### 3. `features/journals`
- `components/JournalCard.tsx` (Displays journal title, description, ISSN, and issue counts).
- `components/IssueList.tsx` (Displays volume and issue groups for table of contents).
- `hooks/useJournals.ts` (Fetches journals index, volumes, and TOC lists).
- `services/journals.service.ts` (Communicates with `/api/journals`).

### 4. `features/search`
- `components/SearchBar.tsx` (Search text field with dynamic input).
- `components/SearchFilters.tsx` (Journal, date-range, category checkbox selections).
- `hooks/useSearch.ts` (Debounces search queries, manages filter state, fetches paginated list of matching articles).
- `services/search.service.ts` (Queries `/api/articles` with search parameters).

### 5. `features/admin`
- `components/SyncControl.tsx` (Trigger button for sync task, logs output display panel).
- `components/UserTable.tsx` (List of system users and role update modals).
- `hooks/useAdmin.ts` (Fires OJS sync commands, user management mutations, and analytics aggregation).
- `services/admin.service.ts` (Communicates with `/api/admin` endpoints).
