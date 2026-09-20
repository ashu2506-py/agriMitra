import { Router } from 'express';
import { ListingController } from '../controllers/listing.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = Router();

// Public: get all active listings
router.get(
  '/',
  ListingController.getListings
);

// Authenticated farmer: get my listings
// MUST be before /:id
router.get(
  '/my',
  authenticate,
  authorize(['FARMER']),
  ListingController.getMyListings
);

// Public: get listing by ID
router.get(
  '/:id',
  ListingController.getListingById
);

// Authenticated farmer/FPO: create listing
router.post(
  '/',
  authenticate,
  authorize(['FARMER', 'FPO']),
  ListingController.createListing
);

// Authenticated farmer/FPO: update listing status
router.patch(
  '/:id/status',
  authenticate,
  authorize(['FARMER', 'FPO']),
  ListingController.updateStatus
);

export default router;