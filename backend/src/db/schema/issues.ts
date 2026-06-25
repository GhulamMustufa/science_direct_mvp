import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { volumes } from './volumes';

export const issues = pgTable('issues', {
  id: uuid('id').primaryKey().defaultRandom(),
  volumeId: uuid('volume_id').references(() => volumes.id, { onDelete: 'cascade' }).notNull(),
  issueNumber: varchar('issue_number', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }),
  year: varchar('year', { length: 4 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});
