import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post(
  '/image',
  authenticate,
  upload.single('image'),
  UploadController.uploadImage
);

export default router;