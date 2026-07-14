# Architecture

This document describes the system architecture for the ScienceDirect-inspired MVP research publishing and discovery platform.

## Architecture Overview

```mermaid
graph TD
    subgraph Client ["Client Tier (Browser)"]
        FE[Next.js App Router]
        PDF[PDF Viewer UI]
    end

    subgraph Service ["Service Tier (Monolithic Backend)"]
        API[Express API Gateway & Routing]
        AuthSvc[Auth Service]
        SearchSvc[Search Service]
        SubmissionSvc[Submission Service]
        EditorialSvc[Editorial Service]
        
        API --> AuthSvc
        API --> SearchSvc
        API --> SubmissionSvc
        API --> EditorialSvc
    end

    subgraph Storage ["Storage & Database Tier"]
        DB[(PostgreSQL - Supabase)]
        Firebase[(Firebase Storage)]
    end

    %% Client flows
    FE -->|HTTP / HTTPS| API
    PDF -->|Stream / Read| Firebase
    
    %% Backend database flows
    AuthSvc --> DB
    SearchSvc --> DB
    SubmissionSvc --> DB
    EditorialSvc --> DB
    
    %% Upload flows
    SubmissionSvc -->|Upload PDFs| Firebase
```

## Core Principles

- **Monolithic Backend:** Express.js + TypeScript, simple to scale vertically and deploy.
- **Separate Frontend & Backend:** Next.js App Router for frontend UI, communicating with the monolithic Express backend via API.
- **Repository + Service Pattern:** Clean separation of concerns with Controllers, Services, and Repositories.
- **Internal Publishing Workflow:** The platform handles end-to-end publishing, from author submission to admin approval and publication.

## System Boundaries and Interfaces

### 1. Monolithic Backend (Express.js)
The backend is organized using a feature-based structure (`src/features/...`).
- **Auth Service:** Issues and validates JWT access and refresh tokens. Authenticated sessions are stored in HTTP-only cookies.
- **Submission Service:** Handles authors uploading PDF manuscripts and submitting articles for review.
- **Editorial Service:** Handles admins reviewing submissions, requesting revisions, and publishing articles to volumes.
- **Search Service:** Implements PostgreSQL Full-Text Search (FTS) using weighted fields (title, abstract, keywords) and a GIN index.

### 2. Frontend Application (Next.js)
- **Server-Side Rendering (SSR):** Renders articles, search pages, and journal homepages for SEO optimization.
- **Client Components:** Renders dashboards, interactive search controls, and reading history options.
- **Authentication:** Sessions are propagated via cookie headers forwarded from Next.js server actions / SSR fetches to the Express backend.

### 3. Database (Supabase PostgreSQL)
- **Source of Truth:** PostgreSQL holds all indexed articles, journals, volumes, users, bookmarks, and submission statuses.
- **Soft Deletes:** Standard `deleted_at` timestamps on all tables.
- **UUID Keys:** Standard UUIDs (`gen_random_uuid()`) for primary keys.

### 4. Storage (Firebase Storage)
- PDF galleys uploaded by authors are stored in Firebase Storage.
- Signed URLs or public read-only paths are supplied to the frontend PDF reader.