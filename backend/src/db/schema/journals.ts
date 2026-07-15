import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const journals = pgTable('journals', {
  id: uuid('id').primaryKey().defaultRandom(),
  ojsJournalId: varchar('ojs_journal_id', { length: 255 }).unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }),
  issn: varchar('issn', { length: 9 }),
  coverImageUrl: varchar('cover_image_url', { length: 1000 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});
