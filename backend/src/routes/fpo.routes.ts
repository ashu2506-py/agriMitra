import { Router } from 'express';
import {
  getFPOMembers,
  addFPOMember,
  getAvailableFPOFarmers,
} from '../controllers/fpo.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = Router();

router.get(
  '/members',
  authenticate,
  authorize(['FPO']),
  getFPOMembers,
);

router.get(
  '/farmers',
  authenticate,
  authorize(['FPO']),
  getAvailableFPOFarmers,
);

router.post(
  '/members',
  authenticate,
  authorize(['FPO']),
  addFPOMember,
);

export default router;