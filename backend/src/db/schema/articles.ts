import { pgTable, uuid, varchar, timestamp, customType, index, integer, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { issues } from './issues';
import { volumes } from './volumes';
import { journals } from './journals';
import { users } from './users';

export const articleStatusEnum = pgEnum('article_status', [
  'DRAFT',
  'SUBMITTED',
  'REVISIONS_REQUIRED',
  'ACCEPTED',
  'REJECTED',
  'PUBLISHED'
]);

// Custom type for PostgreSQL tsvector
const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  submitterId: uuid('submitter_id').references(() => users.id, { onDelete: 'set null' }),
  journalId: uuid('journal_id').references(() => journals.id, { onDelete: 'set null' }),
  issueId: uuid('issue_id').references(() => issues.id, { onDelete: 'set null' }),
  volumeId: uuid('volume_id').references(() => volumes.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 500 }).notNull(),
  abstract: varchar('abstract', { length: 4000 }).notNull(),
  additionalAuthors: varchar('additional_authors', { length: 1000 }),
  status: articleStatusEnum('status').default('DRAFT').notNull(),
  pdfUrl: varchar('pdf_url', { length: 2048 }),
  doi: varchar('doi', { length: 255 }).unique(),
  publishedAt: timestamp('published_at'),
  searchVector: tsvector('search_vector'),
  views: integer('views').default(0).notNull(),
  downloads: integer('downloads').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  searchVectorIdx: index('search_vector_idx').on(table.searchVector).using(sql`gin`),
}));
