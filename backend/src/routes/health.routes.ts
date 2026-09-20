import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/response.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  return sendSuccess(res, {
    status: 'ok',
    service: 'AGRI MITRA Backend Modular Monolith',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

export default router;
