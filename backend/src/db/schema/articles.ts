import { pgTable, uuid, varchar, timestamp, customType, index, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { issues } from './issues';

// Custom type for PostgreSQL tsvector
const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  issueId: uuid('issue_id').references(() => issues.id, { onDelete: 'cascade' }).notNull(),
  ojsArticleId: uuid('ojs_article_id').unique(),
  title: varchar('title', { length: 500 }).notNull(),
  abstract: varchar('abstract', { length: 4000 }).notNull(),
  pdfUrl: varchar('pdf_url', { length: 2048 }),
  doi: varchar('doi', { length: 255 }).unique(),
  publishedAt: timestamp('published_at').notNull(),
  searchVector: tsvector('search_vector'),
  views: integer('views').default(0).notNull(),
  downloads: integer('downloads').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  searchVectorIdx: index('search_vector_idx').on(table.searchVector).using(sql`gin`),
}));
