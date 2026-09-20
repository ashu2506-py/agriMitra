import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/:id/pdf', authenticate, InvoiceController.downloadInvoicePDF);

export default router;
