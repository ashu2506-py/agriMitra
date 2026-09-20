import { Response, NextFunction } from 'express';
import { InvoiceService } from '../services/invoice.service.js';
import { sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class InvoiceController {
  static async downloadInvoicePDF(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Unauthenticated', 'UNAUTHORIZED', 401);
      const { id } = req.params;

      const pdfDoc = await InvoiceService.generateInvoicePDF(id, req.user.userId, req.user.role);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Invoice-${id}.pdf`);

      pdfDoc.pipe(res);
    } catch (error) {
      next(error);
    }
  }
}
