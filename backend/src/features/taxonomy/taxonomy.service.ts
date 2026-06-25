import { TaxonomyRepository, DbCategory, DbKeyword } from './taxonomy.repository.js';

export class TaxonomyService {
  constructor(private taxonomyRepository: TaxonomyRepository) {}

  /**
   * Get all active categories.
   */
  async getCategories(): Promise<DbCategory[]> {
    return this.taxonomyRepository.findAllCategories();
  }

  /**
   * Get all active keywords.
   */
  async getKeywords(): Promise<DbKeyword[]> {
    return this.taxonomyRepository.findAllKeywords();
  }
}
