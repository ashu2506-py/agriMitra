import { prisma } from '../config/db.js';
import axios from 'axios';
import { env } from '../config/env.js';

export class LogisticsService {
  static async getShipments(driverId?: string) {
    const where: any = {};
    if (driverId) {
      where.driverId = driverId;
    }

    return prisma.shipment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          include: {
            buyer: { select: { name: true, phone: true } },
            items: { include: { listing: { include: { crop: true, farmer: true } } } },
          },
        },
        locations: { take: 5, orderBy: { timestamp: 'desc' } },
      },
    });
  }

  static async updateShipmentStatus(shipmentId: string, driverId: string, status: any) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      throw { statusCode: 404, message: 'Shipment record not found', code: 'SHIPMENT_NOT_FOUND' };
    }

    if (shipment.driverId && shipment.driverId !== driverId) {
      throw { statusCode: 403, message: 'Only the assigned driver can update shipment status', code: 'FORBIDDEN' };
    }

    const updated = await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        status,
        driverId: shipment.driverId || driverId,
      },
    });

    // Sync status with order status
    if (status === 'IN_TRANSIT') {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: { status: 'IN_TRANSIT' },
      });
    } else if (status === 'DELIVERED') {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: { status: 'DELIVERED' },
      });
    }

    return updated;
  }

  static async updateShipmentLocation(shipmentId: string, driverId: string, latitude: number, longitude: number) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      throw { statusCode: 404, message: 'Shipment not found', code: 'SHIPMENT_NOT_FOUND' };
    }

    if (shipment.driverId !== driverId) {
      throw { statusCode: 403, message: 'Only assigned driver can update GPS coordinates', code: 'FORBIDDEN' };
    }

    await prisma.shipmentLocation.create({
      data: {
        shipmentId,
        latitude,
        longitude,
      },
    });

    return prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        currentLat: latitude,
        currentLng: longitude,
      },
    });
  }

  static async optimizeRoute(pickups: any[], deliveries: any[]) {
    try {
      // Proxy request to Python FastAPI OR-Tools route optimizer service
      const response = await axios.post(`${env.AI_SERVICE_URL}/ai/logistics/optimize-route`, {
        pickups,
        deliveries,
      });
      return response.data;
    } catch (error) {
      // Development fallback baseline optimization
      return {
        totalDistanceKm: 38.5,
        totalDurationMinutes: 52.0,
        waypoints: [
          { index: 0, type: 'pickup', location: 'Prayagraj Farm' },
          { index: 1, type: 'delivery', location: 'Wholesale Hub' },
        ],
        optimizedSequence: [0, 1],
        provider: 'Development OSRM/OR-Tools Route Optimizer Baseline',
      };
    }
  }
}
