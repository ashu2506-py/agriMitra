import { prisma } from '../config/db.js';
import { CreateOrderInput } from '../validators/order.validator.js';

export class OrderService {
  static async createOrder(buyerId: string, input: CreateOrderInput) {
    // Execute inside DB transaction for strict inventory locking
    return prisma.$transaction(async (tx) => {
      const listing = await tx.cropListing.findUnique({
        where: { id: input.listingId },
      });

      if (!listing) {
        throw { statusCode: 404, message: 'Crop listing not found', code: 'LISTING_NOT_FOUND' };
      }

      if (listing.status !== 'ACTIVE') {
        throw { statusCode: 400, message: 'Listing is no longer active for orders', code: 'LISTING_INACTIVE' };
      }

      if (listing.availableQty < input.quantity) {
        throw {
          statusCode: 400,
          message: `Insufficient stock available. Requested: ${input.quantity} ${listing.unit}, Available: ${listing.availableQty} ${listing.unit}`,
          code: 'INSUFFICIENT_QUANTITY',
        };
      }

      const cropValue = listing.expectedPrice * input.quantity;
      const logisticsFee = Math.round(cropValue * 0.05); // 5% estimated freight
      const platformFee = Math.round(cropValue * 0.02);  // 2% platform fee
      const totalAmount = cropValue + logisticsFee + platformFee;

      const orderNumber = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

      const order = await tx.order.create({
        data: {
          orderNumber,
          buyerId,
          cropValue,
          logisticsFee,
          platformFee,
          taxAmount: 0,
          totalAmount,
          status: 'PENDING',
          deliveryAddress: input.deliveryAddress,
          district: input.district,
          state: input.state,
          items: {
            create: [
              {
                listingId: listing.id,
                quantity: input.quantity,
                unitPrice: listing.expectedPrice,
                totalPrice: cropValue,
              },
            ],
          },
        },
        include: {
          items: true,
        },
      });

      // Deduct inventory
      const newAvailableQty = listing.availableQty - input.quantity;
      await tx.cropListing.update({
        where: { id: listing.id },
        data: {
          availableQty: newAvailableQty,
          status: newAvailableQty === 0 ? 'RESERVED' : 'ACTIVE',
        },
      });

      return order;
    });
  }

  static async getOrders(userId: string, role: string) {
    if (role === 'BUYER') {
      return prisma.order.findMany({
        where: { buyerId: userId },
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { listing: { include: { crop: true } } },
          },
          payment: true,
          shipment: true,
        },
      });
    } else {
      // Farmer/Driver orders
      return prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { listing: { include: { crop: true } } },
          },
          payment: true,
          shipment: true,
        },
      });
    }
  }

  static async getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: { select: { id: true, name: true, email: true, phone: true } },
        items: {
          include: {
            listing: {
              include: {
                crop: true,
                farmer: { select: { id: true, name: true, phone: true, email: true } },
              },
            },
          },
        },
        payment: true,
        invoice: true,
        shipment: true,
      },
    });

    if (!order) {
      throw { statusCode: 404, message: 'Order not found', code: 'ORDER_NOT_FOUND' };
    }

    return order;
  }
}
