import { prisma } from '../config/db.js';
import {
  CreateListingInput,
  FilterListingInput,
} from '../validators/listing.validator.js';

export class ListingService {
  /**
   * Create a new crop listing.
   *
   * Farmer identity comes from the authenticated JWT.
   * Location details come from the farmer's registered profile.
   */
  static async createListing(
    farmerId: string,
    input: CreateListingInput
  ) {
    const farmer = await prisma.user.findUnique({
      where: {
        id: farmerId,
      },
      include: {
        farmerProfile: true,
      },
    });

    if (!farmer) {
      throw {
        statusCode: 404,
        message: 'Farmer account not found',
        code: 'FARMER_NOT_FOUND',
      };
    }

    if (farmer.role !== 'FARMER') {
      throw {
        statusCode: 403,
        message: 'Only farmers can create crop listings',
        code: 'FARMER_ACCESS_REQUIRED',
      };
    }

    if (!farmer.farmerProfile) {
      throw {
        statusCode: 400,
        message: 'Farmer profile not found',
        code: 'FARMER_PROFILE_NOT_FOUND',
      };
    }

    // Find existing crop
    let crop = await prisma.crop.findUnique({
      where: {
        name: input.cropName,
      },
    });

    // Create crop if it doesn't exist
    if (!crop) {
      crop = await prisma.crop.create({
        data: {
          name: input.cropName,
          variety: input.variety,
          category: 'Grain',
        },
      });
    }

    const profile = farmer.farmerProfile;

    const listing = await prisma.cropListing.create({
      data: {
        farmerId: farmer.id,
        cropId: crop.id,

        quantity: input.quantity,
        availableQty: input.quantity,

        unit: input.unit,
        grade: input.grade,

        expectedPrice: input.expectedPrice,
        minPrice: input.minPrice,

        harvestDate: new Date(input.harvestDate),
        availabilityEnd: new Date(input.availabilityEnd),

        // Farmer profile location
        location: profile.address,
        district: profile.district,
        state: profile.state,

        latitude: profile.latitude,
        longitude: profile.longitude,

        description: input.description,

        status: 'ACTIVE',

        images: {
          create: (input.images || []).map((url, index) => ({
            imageUrl: url,
            isPrimary: index === 0,
          })),
        },
      },

      include: {
        crop: true,
        images: true,
        healthAnalysis: true,
        qualityAssessments: true,
      },
    });

    return listing;
  }

  /**
   * Get all active marketplace listings.
   */
  static async getListings(filter: FilterListingInput) {
    const {
      cropName,
      district,
      state,
      minPrice,
      maxPrice,
      grade,
      page = 1,
      limit = 10,
    } = filter;

    const skip = (page - 1) * limit;

    const where: any = {
      status: 'ACTIVE',
      availableQty: {
        gt: 0,
      },
    };

    if (cropName) {
      where.crop = {
        name: {
          contains: cropName,
        },
      };
    }

    if (district) {
      where.district = district;
    }

    if (state) {
      where.state = state;
    }

    if (grade) {
      where.grade = grade;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.expectedPrice = {};

      if (minPrice !== undefined) {
        where.expectedPrice.gte = minPrice;
      }

      if (maxPrice !== undefined) {
        where.expectedPrice.lte = maxPrice;
      }
    }

    const [listings, totalCount] = await Promise.all([
      prisma.cropListing.findMany({
        where,
        skip,
        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          crop: true,

          farmer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },

          images: true,
          qualityAssessments: true,
        },
      }),

      prisma.cropListing.count({
        where,
      }),
    ]);

    return {
      listings,

      pagination: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  /**
   * Get only the listings created by the authenticated farmer.
   */
  static async getMyListings(farmerId: string) {
    const listings = await prisma.cropListing.findMany({
      where: {
        farmerId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        crop: true,
        images: true,
        healthAnalysis: true,
        qualityAssessments: true,
      },
    });

    return listings;
  }

  /**
   * Get a single listing.
   */
  static async getListingById(id: string) {
    const listing = await prisma.cropListing.findUnique({
      where: {
        id,
      },

      include: {
        crop: true,

        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },

        images: true,
        healthAnalysis: true,
        qualityAssessments: true,
      },
    });

    if (!listing) {
      throw {
        statusCode: 404,
        message: 'Crop listing not found',
        code: 'LISTING_NOT_FOUND',
      };
    }

    return listing;
  }

  /**
   * Update listing status.
   */
  static async updateListingStatus(
    farmerId: string,
    listingId: string,
    status: any
  ) {
    const listing = await prisma.cropListing.findUnique({
      where: {
        id: listingId,
      },
    });

    if (!listing) {
      throw {
        statusCode: 404,
        message: 'Listing not found',
        code: 'LISTING_NOT_FOUND',
      };
    }

    if (listing.farmerId !== farmerId) {
      throw {
        statusCode: 403,
        message: 'Unauthorized to modify this listing',
        code: 'FORBIDDEN',
      };
    }

    const updatedListing = await prisma.cropListing.update({
      where: {
        id: listingId,
      },

      data: {
        status,
      },
    });

    return updatedListing;
  }
}