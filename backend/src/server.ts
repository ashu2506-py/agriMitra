import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import 'dotenv/config';

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  logger.info({ socketId: socket.id }, 'Socket.IO Client Connected');

  socket.on('join-shipment', (shipmentId: string) => {
    socket.join(`shipment:${shipmentId}`);
    logger.info({ socketId: socket.id, shipmentId }, 'Joined shipment tracking room');
  });

  socket.on('driver-location-update', (data: { shipmentId: string; latitude: number; longitude: number }) => {
    io.to(`shipment:${data.shipmentId}`).emit('shipment-location-updated', {
      shipmentId: data.shipmentId,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('disconnect', () => {
    logger.info({ socketId: socket.id }, 'Socket.IO Client Disconnected');
  });
});

const PORT = parseInt(env.PORT, 10);

server.listen(PORT, () => {
  logger.info(`🌾 AGRI MITRA Backend running on port ${PORT} [${env.NODE_ENV}]`);
});
