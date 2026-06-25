import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { journals } from './journals';

export const volumes = pgTable('volumes', {
  id: uuid('id').primaryKey().defaultRandom(),
  journalId: uuid('journal_id').references(() => journals.id, { onDelete: 'cascade' }).notNull(),
  volumeNumber: varchar('volume_number', { length: 50 }).notNull(),
  year: varchar('year', { length: 4 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});
