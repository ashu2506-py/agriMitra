import { Router } from 'express';
import { RatingController } from '../controllers/rating.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, RatingController.submitRating);
router.get('/user/:userId', RatingController.getReputation);

export default router;
