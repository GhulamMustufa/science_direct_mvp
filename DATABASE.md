# Database Design

This document defines the PostgreSQL schema and relationship design for the ScienceDirect-inspired MVP, using Drizzle ORM.

## Schema Configuration Rules

- **UUID Primary Keys:** Use `gen_random_uuid()` for all primary keys to avoid ID predictability.
- **Audit Timestamps:** Every record must have `created_at` and `updated_at` timestamps.
- **Soft Deletes:** Use nullable `deleted_at` timestamp for soft-deleting objects.
- **Foreign Keys:** Enforce constraints and cascade settings where appropriate.

## Tables & Fields

### 1. `users`
Tracks reader, author, editor, and admin users.
- `id`: `uuid` (Primary Key)
- `email`: `varchar(255)` (Unique, Indexed)
- `password_hash`: `varchar(255)`
- `role`: `user_role` (Enum: `reader`, `author`, `editor`, `admin`)
- `first_name`: `varchar(100)`
- `last_name`: `varchar(100)`
- `created_at`: `timestamp`
- `updated_at`: `timestamp`
- `deleted_at`: `timestamp` (Nullable)

### 2. `authors`
Author profiles, synced from OJS or created by users.
- `id`: `uuid` (Primary Key)
- `user_id`: `uuid` (Nullable Foreign Key to `users.id`)
- `first_name`: `varchar(100)`
- `last_name`: `varchar(100)`
- `email`: `varchar(255)` (Nullable)
- `institution`: `varchar(255)` (Nullable)
- `orcid`: `varchar(19)` (Nullable)
- `created_at`: `timestamp`
- `updated_at`: `timestamp`
- `deleted_at`: `timestamp` (Nullable)

### 3. `journals`
Journals sync authority from OJS.
- `id`: `uuid` (Primary Key)
- `ojs_journal_id`: `uuid` (Unique, Nullable - for linking sync data)
- `title`: `varchar(255)`
- `description`: `varchar(1000)` (Nullable)
- `issn`: `varchar(9)` (Nullable)
- `created_at`: `timestamp`
- `updated_at`: `timestamp`
- `deleted_at`: `timestamp` (Nullable)

### 4. `volumes`
Volumes grouping issues under journals.
- `id`: `uuid` (Primary Key)
- `journal_id`: `uuid` (Foreign Key to `journals.id`)
- `volume_number`: `varchar(50)`
- `year`: `varchar(4)`
- `created_at`: `timestamp`
- `updated_at`: `timestamp`
- `deleted_at`: `timestamp` (Nullable)

### 5. `issues`
Issues grouping articles under volumes.
- `id`: `uuid` (Primary Key)
- `volume_id`: `uuid` (Foreign Key to `volumes.id`)
- `issue_number`: `varchar(50)`
- `title`: `varchar(255)` (Nullable)
- `year`: `varchar(4)`
- `created_at`: `timestamp`
- `updated_at`: `timestamp`
- `deleted_at`: `timestamp` (Nullable)

### 6. `articles`
Core published articles with PDF references and Full-Text Search.
- `id`: `uuid` (Primary Key)
- `issue_id`: `uuid` (Foreign Key to `issues.id`)
- `ojs_article_id`: `uuid` (Unique, Nullable)
- `title`: `varchar(500)`
- `abstract`: `varchar(4000)`
- `pdf_url`: `varchar(2048)` (Nullable, points to Firebase Storage)
- `doi`: `varchar(255)` (Unique, Nullable)
- `published_at`: `timestamp`
- `search_vector`: `tsvector` (PostgreSQL generated column index for title/abstract/keywords search)
- `created_at`: `timestamp`
- `updated_at`: `timestamp`
- `deleted_at`: `timestamp` (Nullable)

### 7. `categories` & 8. `keywords`
Taxonomy tags for discoverability.
- `id`: `uuid` (Primary Key)
- `name`: `varchar(100)` (Unique)
- `created_at`: `timestamp`
- `updated_at`: `timestamp`
- `deleted_at`: `timestamp` (Nullable)

### 9. `bookmarks` & 10. `reading_lists`
User curation features.
- `bookmarks`:
  - `id`: `uuid` (Primary Key)
  - `user_id`: `uuid` (Foreign Key to `users.id`)
  - `article_id`: `uuid` (Foreign Key to `articles.id`)
- `reading_lists`:
  - `id`: `uuid` (Primary Key)
  - `user_id`: `uuid` (Foreign Key to `users.id`)
  - `name`: `varchar(100)`
  - `description`: `varchar(500)` (Nullable)

### 11. `notifications`
Alerts triggered for users.
- `id`: `uuid` (Primary Key)
- `user_id`: `uuid` (Foreign Key to `users.id`)
- `title`: `varchar(255)`
- `message`: `varchar(1000)`
- `read_at`: `timestamp` (Nullable)

---

## Junction Tables (Many-to-Many)

1. `article_authors`
   - `article_id`: `uuid` (Foreign Key to `articles.id`)
   - `author_id`: `uuid` (Foreign Key to `authors.id`)
   - `author_order`: `integer` (Determines the ordering of display)
2. `article_categories`
   - `article_id`: `uuid` (Foreign Key to `articles.id`)
   - `category_id`: `uuid` (Foreign Key to `categories.id`)
3. `article_keywords`
   - `article_id`: `uuid` (Foreign Key to `articles.id`)
   - `keyword_id`: `uuid` (Foreign Key to `keywords.id`)
4. `reading_list_articles`
   - `reading_list_id`: `uuid` (Foreign Key to `reading_lists.id`)
   - `article_id`: `uuid` (Foreign Key to `articles.id`)