import { pgTable, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { articles } from './articles';

export const articleFiles = pgTable('article_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  version: integer('version').notNull().default(1),
  fileUrl: varchar('file_url', { length: 2048 }).notNull(),
  originalName: varchar('original_name', { length: 500 }),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});
