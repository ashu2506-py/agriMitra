import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const getFPOMembers = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const fpo = await prisma.fPO.findUnique({
      where: {
        userId,
      },
    });

    if (!fpo) {
      return res.status(404).json({
        success: false,
        message: 'FPO profile not found',
      });
    }

    const members = await prisma.fPOMember.findMany({
      where: {
        fpoId: fpo.id,
      },
      include: {
        farmerUser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isVerified: true,
            farmerProfile: {
              select: {
                farmSizeAcres: true,
                district: true,
                state: true,
                pincode: true,
                cropsGrown: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        fpo: {
          id: fpo.id,
          orgName: fpo.orgName,
          totalFarmers: fpo.totalFarmers,
        },
        members,
      },
    });
  } catch (error) {
    console.error('Get FPO members error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch FPO members',
    });
  }
};

export const getAvailableFPOFarmers = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const fpo = await prisma.fPO.findUnique({
      where: {
        userId,
      },
    });

    if (!fpo) {
      return res.status(404).json({
        success: false,
        message: 'FPO profile not found',
      });
    }

    const farmers = await prisma.user.findMany({
      where: {
        role: 'FARMER',
        fpoMembership: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isVerified: true,
        farmerProfile: {
          select: {
            farmSizeAcres: true,
            district: true,
            state: true,
            pincode: true,
            cropsGrown: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        farmers,
      },
    });
  } catch (error) {
    console.error('Get available FPO farmers error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch available farmers',
    });
  }
};

/**
 * Add an existing FARMER account to the logged-in FPO.
 */
export const addFPOMember = async (
  req: Request,
  res: Response,
) => {
  try {
    const fpoUserId = req.user?.userId;

    if (!fpoUserId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { farmerUserId, landSizeAcres } = req.body;

    if (!farmerUserId) {
      return res.status(400).json({
        success: false,
        message: 'farmerUserId is required',
      });
    }

    const parsedLandSize = Number(landSizeAcres ?? 0);

    if (
      Number.isNaN(parsedLandSize) ||
      parsedLandSize < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'landSizeAcres must be a valid non-negative number',
      });
    }

    // Find the FPO belonging to the logged-in user.
    const fpo = await prisma.fPO.findUnique({
      where: {
        userId: fpoUserId,
      },
    });

    if (!fpo) {
      return res.status(404).json({
        success: false,
        message: 'FPO profile not found',
      });
    }

    // Make sure the selected account actually exists.
    const farmer = await prisma.user.findUnique({
      where: {
        id: farmerUserId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer account not found',
      });
    }

    // Only FARMER accounts can become FPO members.
    if (farmer.role !== 'FARMER') {
      return res.status(400).json({
        success: false,
        message: 'Only FARMER accounts can be added to an FPO',
      });
    }

    // A farmer can belong to only one FPO because
    // FPOMember.farmerUserId is unique in the Prisma schema.
    const existingMembership = await prisma.fPOMember.findUnique({
      where: {
        farmerUserId,
      },
    });

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message: 'This farmer is already a member of an FPO',
      });
    }

    // Create membership and update the FPO farmer count
    // in one transaction.
    const membership = await prisma.$transaction(async (tx) => {
      const newMember = await tx.fPOMember.create({
        data: {
          fpoId: fpo.id,
          farmerUserId: farmer.id,
          landSizeAcres: parsedLandSize,
        },
        include: {
          farmerUser: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              isVerified: true,
              farmerProfile: {
                select: {
                  farmSizeAcres: true,
                  district: true,
                  state: true,
                  pincode: true,
                  cropsGrown: true,
                },
              },
            },
          },
        },
      });

      await tx.fPO.update({
        where: {
          id: fpo.id,
        },
        data: {
          totalFarmers: {
            increment: 1,
          },
        },
      });

      return newMember;
    });

    return res.status(201).json({
      success: true,
      message: 'Farmer added to FPO successfully',
      data: {
        member: membership,
      },
    });
  } catch (error) {
    console.error('Add FPO member error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to add farmer to FPO',
    });
  }
};