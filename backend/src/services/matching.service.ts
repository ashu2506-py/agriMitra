import { prisma } from '../config/db.js';

export class MatchingService {
  static async matchBuyerRequirements(requirementId: string) {
    const requirement = await prisma.buyerRequirement.findUnique({
      where: { id: requirementId },
    });

    if (!requirement) {
      throw { statusCode: 404, message: 'Buyer requirement not found', code: 'REQUIREMENT_NOT_FOUND' };
    }

    // Fetch active crop listings
    const candidateListings = await prisma.cropListing.findMany({
      where: {
        status: 'ACTIVE',
        availableQty: { gt: 0 },
      },
      include: {
        crop: true,
        farmer: true,
        qualityAssessments: true,
      },
    });

    const matches = candidateListings.map((listing) => {
      let score = 0;
      const explanations: string[] = [];

      // 1. Crop Match (Max 30 pts)
      if (listing.crop.name.toLowerCase().includes(requirement.cropName.toLowerCase())) {
        score += 30;
        explanations.push(`Crop name matches target '${requirement.cropName}' (+30 pts)`);
      } else {
        explanations.push(`Crop '${listing.crop.name}' differs from target '${requirement.cropName}'`);
      }

      // 2. Quantity Match (Max 20 pts)
      const qtyRatio = Math.min(listing.availableQty / requirement.quantity, 1.0);
      const qtyPoints = Math.round(qtyRatio * 20);
      score += qtyPoints;
      explanations.push(`Available quantity is ${Math.round(qtyRatio * 100)}% of requested volume (+${qtyPoints} pts)`);

      // 3. Price Compatibility (Max 25 pts)
      if (listing.expectedPrice <= requirement.maxPrice) {
        score += 25;
        explanations.push(`Listing price ₹${listing.expectedPrice} is within maximum budget ₹${requirement.maxPrice} (+25 pts)`);
      } else {
        const overPct = Math.round(((listing.expectedPrice - requirement.maxPrice) / requirement.maxPrice) * 100);
        explanations.push(`Listing price ₹${listing.expectedPrice} is ${overPct}% over budget`);
      }

      // 4. Quality Grade (Max 15 pts)
      if (listing.grade === (requirement.grade || 'Grade A+')) {
        score += 15;
        explanations.push(`Grade requirement '${listing.grade}' satisfied (+15 pts)`);
      } else {
        score += 8;
        explanations.push(`Grade '${listing.grade}' partially satisfies requirement (+8 pts)`);
      }

      // 5. Regional Distance / Feasibility (Max 10 pts)
      if (listing.district.toLowerCase() === requirement.district.toLowerCase()) {
        score += 10;
        explanations.push(`Located in same district '${listing.district}' (+10 pts)`);
      } else {
        score += 5;
        explanations.push(`Located in neighboring district '${listing.district}' (+5 pts)`);
      }

      return {
        listing,
        matchScore: Math.min(score, 100),
        explanations,
      };
    });

    // Sort descending by matchScore
    matches.sort((a, b) => b.matchScore - a.matchScore);

    return {
      requirement,
      matches,
    };
  }

  static async createBuyerRequirement(buyerId: string, data: any) {
    return prisma.buyerRequirement.create({
      data: {
        buyerId,
        cropName: data.cropName,
        variety: data.variety,
        quantity: data.quantity,
        unit: data.unit || 'quintal',
        grade: data.grade,
        maxPrice: data.maxPrice,
        district: data.district,
        radiusKm: data.radiusKm || 100,
        deliveryDate: new Date(data.deliveryDate),
      },
    });
  }

  static async getBuyerRequirements(buyerId: string) {
    return prisma.buyerRequirement.findMany({
      where: { buyerId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
