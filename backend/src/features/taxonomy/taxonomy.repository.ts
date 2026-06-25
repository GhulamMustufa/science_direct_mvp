import { isNull, asc } from 'drizzle-orm';
import { db } from '../../lib/db.js';
import { categories, keywords } from '../../db/schema/index.js';

export type DbCategory = typeof categories.$inferSelect;
export type DbKeyword = typeof keywords.$inferSelect;

export class TaxonomyRepository {
  /**
   * Find all active categories, sorted alphabetically by name.
   */
  async findAllCategories(): Promise<DbCategory[]> {
    return db
      .select()
      .from(categories)
      .where(isNull(categories.deletedAt))
      .orderBy(asc(categories.name));
  }

  /**
   * Find all active keywords, sorted alphabetically by name.
   */
  async findAllKeywords(): Promise<DbKeyword[]> {
    return db
      .select()
      .from(keywords)
      .where(isNull(keywords.deletedAt))
      .orderBy(asc(keywords.name));
  }
}
