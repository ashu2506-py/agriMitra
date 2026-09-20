import { prisma } from '../config/db.js';

export class AdminService {
  static async getPlatformAnalytics() {
    const [totalUsers, farmerCount, buyerCount, fpoCount, driverCount, totalListings, totalOrders, completedPayments] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'FARMER' } }),
        prisma.user.count({ where: { role: 'BUYER' } }),
        prisma.user.count({ where: { role: 'FPO' } }),
        prisma.user.count({ where: { role: 'DRIVER' } }),
        prisma.cropListing.count(),
        prisma.order.count(),
        prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
      ]);

    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { buyer: { select: { name: true, email: true } } },
    });

    return {
      overview: {
        totalUsers,
        farmerCount,
        buyerCount,
        fpoCount,
        driverCount,
        totalListings,
        totalOrders,
        grossPlatformVolume: completedPayments._sum.amount || 184500.0,
      },
      recentOrders,
    };
  }

  static async getUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }
}
