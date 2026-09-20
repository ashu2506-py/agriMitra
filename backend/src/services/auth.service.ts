import { prisma } from '../config/db.js';
import { RegisterInput, LoginInput } from '../validators/auth.validator.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/jwt.js';

export class AuthService {
  static async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingUser) {
      throw {
        statusCode: 400,
        message: 'User with this email already exists',
        code: 'USER_EXISTS',
      };
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          role: input.role,
          name: input.name,
          phone: input.phone,
          isVerified: false,
        },
      });

      switch (input.role) {
        case 'FARMER':
          await tx.farmerProfile.create({
            data: {
              userId: newUser.id,
              farmSizeAcres: input.farmSizeAcres,
              district: input.district,
              state: input.state,
              pincode: input.pincode,
              address: input.address,
              cropsGrown: JSON.stringify(input.cropsGrown),
            },
          });
          break;

        case 'BUYER':
          await tx.buyerProfile.create({
            data: {
              userId: newUser.id,
              companyName: input.companyName,
              buyerType: input.buyerType,
              gstNumber: input.gstNumber,
              district: input.district,
              state: input.state,
              pincode: input.pincode,
              address: input.address,
            },
          });
          break;

        case 'FPO':
          await tx.fPO.create({
            data: {
              userId: newUser.id,
              orgName: input.orgName,
              regNumber: input.regNumber,
              district: input.district,
              state: input.state,
              pincode: input.pincode,
            },
          });
          break;

        case 'DRIVER':
          await tx.driverProfile.create({
            data: {
              userId: newUser.id,
              licenseNumber: input.licenseNumber,
              vehicleType: input.vehicleType,
              vehicleNumber: input.vehicleNumber,
              capacityKg: input.capacityKg,
            },
          });
          break;
      }

      return newUser;
    });

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      throw {
        statusCode: 401,
        message: 'Invalid email or password credentials',
        code: 'INVALID_CREDENTIALS',
      };
    }

    const isPasswordValid = await comparePassword(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw {
        statusCode: 401,
        message: 'Invalid email or password credentials',
        code: 'INVALID_CREDENTIALS',
      };
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  static async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        farmerProfile: true,
        buyerProfile: true,
        fpoProfile: true,
        driverProfile: true,
      },
    });

    if (!user) {
      throw {
        statusCode: 404,
        message: 'User profile not found',
        code: 'USER_NOT_FOUND',
      };
    }

    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}