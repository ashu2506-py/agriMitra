import { Router } from 'express';
import { MatchingController } from '../controllers/matching.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = Router();

router.get('/requirements', authenticate, authorize(['BUYER']), MatchingController.getRequirements);
router.post('/requirements', authenticate, authorize(['BUYER']), MatchingController.createRequirement);
router.get('/matches/:requirementId', authenticate, MatchingController.getMatches);

export default router;
