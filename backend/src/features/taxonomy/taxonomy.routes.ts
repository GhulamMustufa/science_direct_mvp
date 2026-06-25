import { Router } from 'express';
import { TaxonomyRepository } from './taxonomy.repository.js';
import { TaxonomyService } from './taxonomy.service.js';
import { TaxonomyController } from './taxonomy.controller.js';

const router = Router();

const taxonomyRepository = new TaxonomyRepository();
const taxonomyService = new TaxonomyService(taxonomyRepository);
const taxonomyController = new TaxonomyController(taxonomyService);

router.get('/categories', taxonomyController.getCategories);
router.get('/keywords', taxonomyController.getKeywords);

export default router;
