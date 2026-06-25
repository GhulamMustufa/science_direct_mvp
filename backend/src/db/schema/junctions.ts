import { pgTable, uuid, integer, primaryKey } from 'drizzle-orm/pg-core';
import { articles } from './articles.js';
import { authors } from './authors.js';
import { categories } from './categories.js';
import { keywords } from './keywords.js';
import { readingLists } from './reading-lists.js';

export const articleAuthors = pgTable('article_authors', {
  articleId: uuid('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  authorId: uuid('author_id').references(() => authors.id, { onDelete: 'cascade' }).notNull(),
  authorOrder: integer('author_order').notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.articleId, t.authorId] }),
}));

export const articleCategories = pgTable('article_categories', {
  articleId: uuid('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.articleId, t.categoryId] }),
}));

export const articleKeywords = pgTable('article_keywords', {
  articleId: uuid('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  keywordId: uuid('keyword_id').references(() => keywords.id, { onDelete: 'cascade' }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.articleId, t.keywordId] }),
}));

export const readingListArticles = pgTable('reading_list_articles', {
  readingListId: uuid('reading_list_id').references(() => readingLists.id, { onDelete: 'cascade' }).notNull(),
  articleId: uuid('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.readingListId, t.articleId] }),
}));
