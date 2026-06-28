import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { authors } from './authors';

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: uuid('author_id')
    .references(() => authors.id, { onDelete: 'cascade' })
    .notNull(),
  ojsSubmissionId: varchar('ojs_submission_id', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  journalTitle: varchar('journal_title', { length: 500 }),
  status: varchar('status', { length: 50 }).notNull(),
  submittedAt: timestamp('submitted_at').notNull(),
  lastStatusUpdate: timestamp('last_status_update'),
  ojsUrl: varchar('ojs_url', { length: 1000 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});
