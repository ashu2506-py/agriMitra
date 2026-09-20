import { prisma } from '../config/db.js';

export class FPOService {
  static async aggregateCropQuantities(fpoUserId: string, data: { cropName: string; farmerContributions: { farmerUserId: string; quantity: number }[]; expectedPrice: number; minPrice: number }) {
    const fpo = await prisma.fPO.findUnique({
      where: { userId: fpoUserId },
    });

    if (!fpo) {
      throw { statusCode: 404, message: 'FPO organization record not found', code: 'FPO_NOT_FOUND' };
    }

    const totalQuantity = data.farmerContributions.reduce((sum, item) => sum + item.quantity, 0);

    // Find or create normalized Crop catalog item
    let crop = await prisma.crop.findUnique({ where: { name: data.cropName } });
    if (!crop) {
      crop = await prisma.crop.create({ data: { name: data.cropName, category: 'Grain' } });
    }

    // Execute in DB Transaction to create bulk listing and aggregation record
    return prisma.$transaction(async (tx) => {
      const listing = await tx.cropListing.create({
        data: {
          farmerId: fpoUserId,
          cropId: crop.id,
          quantity: totalQuantity,
          availableQty: totalQuantity,
          unit: 'quintal',
          grade: 'Grade A+ (FPO Aggregated)',
          expectedPrice: data.expectedPrice,
          minPrice: data.minPrice,
          harvestDate: new Date(),
          availabilityEnd: new Date(Date.now() + 30 * 86400000),
          location: `${fpo.orgName}, ${fpo.district}`,
          district: fpo.district,
          state: fpo.state,
          description: `Bulk FPO Aggregated Produce from ${data.farmerContributions.length} member farmers.`,
          status: 'ACTIVE',
        },
      });

      const aggregation = await tx.fPOAggregation.create({
        data: {
          fpoId: fpo.id,
          listingId: listing.id,
          totalQuantity,
          allocations: JSON.stringify(data.farmerContributions),
        },
      });

      return { listing, aggregation };
    });
  }

  static async getFPOMembers(fpoUserId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { userId: fpoUserId },
      include: {
        members: {
          include: {
            farmerUser: { select: { id: true, name: true, email: true, phone: true } },
          },
        },
      },
    });

    return fpo?.members || [];
  }
}
