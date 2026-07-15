# Scientific Publishing Platform (MVP)

A modern, scalable academic publishing platform built to handle end-to-end manuscript submissions, editorial workflows, and published article distribution. It provides an intuitive interface for authors, rigorous peer-review management for editors, and open-access reading for researchers.

---

## 🏗️ Architecture & Tech Stack

This project is built using a modern decoupled architecture, ensuring scalability, performance, and strong type safety across the stack.

### Frontend
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + ShadCN UI
- **State & Data Fetching:** React Query (or native fetch)

### Backend
- **Framework:** Express.js (Node.js)
- **Language:** TypeScript
- **Architecture:** Feature-based modular architecture (Controllers, Services, Repositories)
- **Validation:** Zod schemas
- **Storage:** Cloudinary (for manuscript PDFs and images) / Firebase Storage

### Database & ORM
- **Database:** PostgreSQL (Supabase)
- **ORM:** Drizzle ORM
- **Search:** PostgreSQL Full Text Search natively integrated.

---

## 🔄 End-to-End Flow

### 1. Registration & Roles
* Users register on the platform. By default, they are assigned the **Reader** role.
* The system supports robust role-based access control (RBAC) with `Reader`, `Author`, `Editor`, and `Admin` roles.

### 2. Manuscript Submission (Author Flow)
* Authors upload their manuscripts (PDF/Word).
* The backend parses the document using automated extraction tools to pre-fill metadata (Title, Abstract, Keywords, etc.).
* Strict structural validation runs against the file (checking word counts, headings, etc.) before the submission is accepted as a **Draft**.
* Authors can add Co-Authors and finalize the submission.

### 3. Editorial Workflow (Editor Flow)
* Editors review incoming submissions on their dashboard.
* If a manuscript needs changes, they mark it as `REVISIONS_REQUIRED`.
* Authors upload revised documents, which go through a subset of the structural validation rules again.
* Once approved, the Editor marks the manuscript as `PUBLISHED`.

### 4. Reading & Discovery (Reader Flow)
* Published articles immediately appear on the platform's homepage and search indexes.
* Readers can search articles using Full Text Search, filter by journal/category, and download the published PDFs.

---

## 🚨 File Upload Validation Rules

To ensure high-quality academic submissions, the platform enforces automated validation on uploaded manuscripts. This helps reduce the manual workload on editors.

### 🛑 Blocking Rules (Errors - Will reject upload)
If any of these conditions are met, the submission will be rejected, and the author must fix the file:
* **File Type:** Must be a PDF (`application/pdf`) or Word Document (`.docx`, `.doc`).
* **File Size:** Cannot exceed **10MB**.
* **Word Count:** Must be between **100** and **10,000** words.
* **Figure Limits:** The document cannot contain more than **15** figures.
* **Required Sections:** The document *must* contain the following standard academic headings:
  1. Introduction
  2. Methods / Methodology
  3. Results
  4. Discussion
  5. Conclusion(s)

### ⚠️ Warnings (Will allow upload, but flags for review)
These conditions will display a warning to the author and flag the submission for editors, but will *not* block the upload:
* **Short Document:** Word count is under **1,000** words (flagged as potentially lacking depth).
* **No Figures:** Zero figures detected in the document. (Authors are asked to ensure this is correct).

### ✅ Success
If the file meets all blocking criteria, it is securely uploaded to Cloud Storage, the metadata is extracted and saved to PostgreSQL, and the submission enters the `DRAFT` or `SUBMITTED` state.

---

## 🚀 Future Scope

While the current MVP handles the core submission and publication loop, the architecture is designed to support the following expansions:

1. **Peer Review Portal:**
   * Allow editors to invite external reviewers via email.
   * Reviewers can submit structured feedback forms and scores.
2. **Author Dashboard & Account Linking:**
   * When co-authors are added to a paper via email, automatically send them an invite link.
   * Allow authors to claim their profiles and view all their published articles on a unified public researcher profile (similar to Google Scholar).
3. **Monetization & Paywalls:**
   * Introduce a subscription tier for Readers using Stripe integration.
   * Allow authors to pay Article Processing Charges (APCs) for Open Access.
4. **DOI Integration:**
   * Automated integration with Crossref to mint unique DOIs for every published article.
5. **Advanced Analytics:**
   * Track citation counts, PDF downloads, and abstract views, displaying them visually on the author dashboard.
