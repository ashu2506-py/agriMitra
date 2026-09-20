import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import listingsRoutes from './routes/listings.routes.js';
import matchingRoutes from './routes/matching.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import paymentsRoutes from './routes/payments.routes.js';
import invoicesRoutes from './routes/invoices.routes.js';
import logisticsRoutes from './routes/logistics.routes.js';
import aiRoutes from './routes/ai.routes.js';
import fpoRoutes from './routes/fpo.routes.js';
import ratingsRoutes from './routes/ratings.routes.js';
import adminRoutes from './routes/admin.routes.js';
import uploadRoutes from './routes/upload.routes.js';


export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Routes
  app.use('/', healthRoutes);
  app.use('/api', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/listings', listingsRoutes);
  app.use('/api/uploads', uploadRoutes);
  app.use('/api/matching', matchingRoutes);
  app.use('/api/buyer-requirements', matchingRoutes);
  app.use('/api/orders', ordersRoutes);
  app.use('/api/payments', paymentsRoutes);
  app.use('/api/invoices', invoicesRoutes);
  app.use('/api/logistics', logisticsRoutes);
  app.use('/api/fpo', fpoRoutes);
  app.use('/api/ratings', ratingsRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', aiRoutes);
  app.use('/api/ai', aiRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
