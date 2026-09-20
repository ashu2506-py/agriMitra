import { prisma } from '../config/db.js';

export class RatingService {
  static async submitRating(reviewerId: string, orderId: string, targetUserId: string, stars: number, review?: string) {
    if (reviewerId === targetUserId) {
      throw { statusCode: 400, message: 'Self-rating is strictly prohibited', code: 'SELF_RATING_PROHIBITED' };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw { statusCode: 404, message: 'Order reference not found', code: 'ORDER_NOT_FOUND' };
    }

    if (order.status !== 'DELIVERED') {
      throw { statusCode: 400, message: 'Ratings can only be submitted after order delivery is completed', code: 'ORDER_NOT_DELIVERED' };
    }

    const existing = await prisma.rating.findFirst({
      where: { orderId, reviewerId },
    });

    if (existing) {
      throw { statusCode: 400, message: 'You have already submitted a rating for this order', code: 'RATING_EXISTS' };
    }

    return prisma.rating.create({
      data: {
        orderId,
        reviewerId,
        targetUserId,
        stars,
        review,
      },
    });
  }

  static async getUserReputation(userId: string) {
    const ratings = await prisma.rating.findMany({
      where: { targetUserId: userId },
    });

    if (ratings.length === 0) {
      return { averageStars: 5.0, totalRatings: 0, reviews: [] };
    }

    const totalStars = ratings.reduce((sum, r) => sum + r.stars, 0);
    return {
      averageStars: parseFloat((totalStars / ratings.length).toFixed(1)),
      totalRatings: ratings.length,
      reviews: ratings,
    };
  }
}
