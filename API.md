# API Design

This document details the REST API specification for the monolithic Express.js backend.

## Design Conventions

- **Prefix:** All endpoints are prefixed with `/api`.
- **Response Format:** All JSON responses return standard payloads:
  - Success: `{ "success": true, "data": ... }`
  - Error: `{ "success": false, "error": { "message": "...", "code": "...", "details": [...] } }`
- **Authentication:** Supported via HttpOnly cookies (`accessToken` and `refreshToken`). If missing or expired, endpoints return `401 Unauthorized`.
- **Pagination:** Mandatory for all list endpoints. Requests must use query params: `limit` (default: 10, max: 100) and `offset` (default: 0). Responses include a `pagination` object:
  ```json
  {
    "success": true,
    "data": [],
    "pagination": {
      "total": 42,
      "limit": 10,
      "offset": 0
    }
  }
  ```

---

## Authentication & Profile Endpoints

### `POST /api/auth/register`
Creates a new reader account.
- **Request Body (Zod validated):**
  - `email` (string, required)
  - `password` (string, required, min 8 chars)
  - `firstName` (string, optional)
  - `lastName` (string, optional)

### `POST /api/auth/login`
Authenticates a user and sets HTTP-only secure cookies for `accessToken` and `refreshToken`.
- **Request Body (Zod validated):**
  - `email` (string, required)
  - `password` (string, required)

### `POST /api/auth/logout`
Clears session cookies on the client side.

### `POST /api/auth/refresh`
Re-issues `accessToken` if a valid `refreshToken` cookie is present.

### `GET /api/auth/me`
Retrieves currently logged-in user profile metadata.

### `GET /api/profile`
Gets the extended profile of the user, including linked author information (if role is author).

### `PUT /api/profile`
Updates the profile information of the user.
- **Request Body:**
  - `firstName` (string)
  - `lastName` (string)
  - `institution` (string, optional)
  - `orcid` (string, optional)

---

## Discovery & Reader Endpoints

### `GET /api/journals`
Lists journals.
- **Query Params:** `limit`, `offset`
- **Response Data:** Array of journal metadata (id, title, description, issn).

### `GET /api/journals/:id`
Retrieves journal details, including volumes and issues.

### `GET /api/journals/:id/issues`
Lists issues within a journal.
- **Query Params:** `limit`, `offset`

### `GET /api/issues/:id`
Retrieves specific issue details, including the table of contents (list of articles).

### `GET /api/articles`
Search and filter articles using PostgreSQL Full-Text Search.
- **Query Params:**
  - `query` (string, search query for FTS)
  - `journalId` (uuid, filter by journal)
  - `categoryId` (uuid, filter by category)
  - `keyword` (string, filter by keyword)
  - `limit`, `offset`

### `GET /api/articles/:id`
Gets complete article details (title, abstract, doi, publishedAt, categories, keywords, list of authors, and author order).

### `GET /api/articles/:id/download`
Serves the PDF galley redirect or stream link from Firebase Storage. Automatically increments the download analytic counter.

### `POST /api/articles/:id/view`
Tracks an article abstract view page request. Increments the view analytic counter.

---

## Bookmarks & Reading Lists (Authenticated)

### `GET /api/bookmarks`
Gets paginated list of user bookmarks.

### `POST /api/bookmarks`
Bookmarks an article.
- **Request Body:** `articleId` (uuid)

### `DELETE /api/bookmarks/:articleId`
Removes an article bookmark.

### `GET /api/reading-lists`
Lists user reading lists.

### `POST /api/reading-lists`
Creates a new custom reading list.
- **Request Body:** `name` (string), `description` (string, optional)

### `GET /api/reading-lists/:id`
Gets reading list details and the articles grouped inside.

### `PUT /api/reading-lists/:id`
Updates reading list details.

### `DELETE /api/reading-lists/:id`
Deletes a reading list.

### `POST /api/reading-lists/:id/articles`
Adds an article to the reading list.
- **Request Body:** `articleId` (uuid)

### `DELETE /api/reading-lists/:id/articles/:articleId`
Removes an article from a reading list.

---

## Categories & Keywords Endpoints

### `GET /api/categories`
Lists all taxonomy categories (e.g. Medicine, Engineering).

### `GET /api/keywords`
Lists trending/all keywords (useful for tags and autocomplete).

---

## Notifications (Authenticated)

### `GET /api/notifications`
Gets notifications for the user.
- **Query Params:** `unreadOnly` (boolean, optional)

### `PUT /api/notifications/:id/read`
Marks a specific notification as read.

### `PUT /api/notifications/read-all`
Marks all notifications for user as read.

---

## Author Endpoints (Role: `author`, `editor`, `admin`)

### `GET /api/author/dashboard`
Gets personal analytics (total reads, downloads) and own synced publications list.

---

## Admin Endpoints (Role: `admin`)

### `GET /api/admin/users`
Lists all platform users.

### `PUT /api/admin/users/:id/role`
Updates a user's access role.
- **Request Body:** `role` (enum: `reader`, `author`, `editor`, `admin`)

### `POST /api/admin/sync/trigger`
Triggers manual sync pull request from OJS. Runs asynchronously.
- **Response Data:** `{ "syncJobId": "...", "status": "pending" }`

### `GET /api/admin/sync/status/:jobId`
Checks the progress status of a running sync job.
