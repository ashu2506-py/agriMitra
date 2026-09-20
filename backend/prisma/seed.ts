import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌾 Seeding AGRI MITRA Development Database...');

  // Clean existing data safely
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipmentLocation.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.negotiation.deleteMany();
  await prisma.buyerMatch.deleteMany();
  await prisma.buyerRequirement.deleteMany();
  await prisma.fPOAggregation.deleteMany();
  await prisma.qualityAssessment.deleteMany();
  await prisma.cropHealthAnalysis.deleteMany();
  await prisma.cropImage.deleteMany();
  await prisma.cropListing.deleteMany();
  await prisma.crop.deleteMany();
  await prisma.marketPrice.deleteMany();
  await prisma.market.deleteMany();
  await prisma.fPOMember.deleteMany();
  await prisma.fPO.deleteMany();
  await prisma.driverProfile.deleteMany();
  await prisma.buyerProfile.deleteMany();
  await prisma.farmerProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@agrimitra.org',
      name: 'System Admin',
      passwordHash,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  // 2. Farmers
  const farmer1 = await prisma.user.create({
    data: {
      email: 'farmer.ramesh@agrimitra.org',
      name: 'Ramesh Kumar [DEMO DATA]',
      passwordHash,
      role: 'FARMER',
      phone: '+91 98765 43210',
      isVerified: true,
      farmerProfile: {
        create: {
          farmSizeAcres: 12.5,
          district: 'Prayagraj',
          state: 'Uttar Pradesh',
          pincode: '211001',
          address: 'Village Naini, District Prayagraj',
          latitude: 25.4358,
          longitude: 81.8463,
          cropsGrown: JSON.stringify(['Wheat', 'Tomato', 'Potato']),
        },
      },
    },
  });

  const farmer2 = await prisma.user.create({
    data: {
      email: 'farmer.suresh@agrimitra.org',
      name: 'Suresh Patel [DEMO DATA]',
      passwordHash,
      role: 'FARMER',
      phone: '+91 98765 43211',
      isVerified: true,
      farmerProfile: {
        create: {
          farmSizeAcres: 8.0,
          district: 'Varanasi',
          state: 'Uttar Pradesh',
          pincode: '221001',
          address: 'Village Chandauli, District Varanasi',
          latitude: 25.3176,
          longitude: 82.9739,
          cropsGrown: JSON.stringify(['Basmati Rice', 'Red Onion']),
        },
      },
    },
  });

  // 3. Buyer
  const buyer1 = await prisma.user.create({
    data: {
      email: 'buyer.freshmart@agrimitra.org',
      name: 'FreshMart Sourcing Ltd [DEMO DATA]',
      passwordHash,
      role: 'BUYER',
      phone: '+91 91234 56789',
      isVerified: true,
      buyerProfile: {
        create: {
          companyName: 'FreshMart Retail India',
          buyerType: 'WHOLESALER',
          gstNumber: '09AAACF1234H1Z5',
          district: 'Lucknow',
          state: 'Uttar Pradesh',
          pincode: '226001',
          address: 'Transport Nagar, Lucknow',
          latitude: 26.8467,
          longitude: 80.9462,
        },
      },
    },
  });

  // 4. Driver
  const driver1 = await prisma.user.create({
    data: {
      email: 'driver.sunil@agrimitra.org',
      name: 'Sunil Yadav [DEMO DATA]',
      passwordHash,
      role: 'DRIVER',
      phone: '+91 99887 76655',
      isVerified: true,
      driverProfile: {
        create: {
          licenseNumber: 'DL-UP-2024-00912',
          vehicleType: 'Pickup Mini-Truck',
          vehicleNumber: 'UP-70-AG-4321',
          capacityKg: 3000,
          currentLat: 25.4358,
          currentLng: 81.8463,
          isAvailable: true,
        },
      },
    },
  });

  // 5. Crops
  const wheat = await prisma.crop.create({
    data: { name: 'Sharbati Wheat', variety: 'MP 306', category: 'Grain', shelfLifeDays: 365 },
  });
  const tomato = await prisma.crop.create({
    data: { name: 'Hybrid Tomato', variety: 'Heemsohna', category: 'Vegetable', shelfLifeDays: 14 },
  });

  // 6. Crop Listings
  const listing1 = await prisma.cropListing.create({
    data: {
      farmerId: farmer1.id,
      cropId: wheat.id,
      quantity: 50.0,
      availableQty: 50.0,
      unit: 'quintal',
      grade: 'Grade A+',
      expectedPrice: 2450.0,
      minPrice: 2350.0,
      harvestDate: new Date('2026-10-15'),
      availabilityStart: new Date(),
      availabilityEnd: new Date('2026-11-15'),
      location: 'Naini, Prayagraj',
      district: 'Prayagraj',
      state: 'Uttar Pradesh',
      latitude: 25.4358,
      longitude: 81.8463,
      description: 'Organically cultivated Sharbati MP 306 wheat with high protein content.',
      status: 'ACTIVE',
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
            isPrimary: true,
          },
        ],
      },
      healthAnalysis: {
        create: {
          diseaseDetected: 'Healthy (No pathogens detected)',
          severity: 'None',
          confidence: 0.96,
          recommendations: JSON.stringify(['Continue standard irrigation', 'Maintain storage below 12% moisture']),
        },
      },
      qualityAssessments: {
        create: {
          grade: 'Grade A+',
          score: 94,
          confidence: 0.92,
          factors: JSON.stringify({ appearance: 96, defects: 98, uniformity: 90 }),
        },
      },
    },
  });

  // 7. Mandi Markets
  const market1 = await prisma.market.create({
    data: {
      name: 'Prayagraj Wholesale Mandi',
      district: 'Prayagraj',
      state: 'Uttar Pradesh',
      latitude: 25.45,
      longitude: 81.85,
      marketPrices: {
        create: [
          { cropName: 'Sharbati Wheat', minPrice: 2350.0, maxPrice: 2550.0, modalPrice: 2450.0, unit: 'quintal' },
          { cropName: 'Hybrid Tomato', minPrice: 1600.0, maxPrice: 2100.0, modalPrice: 1850.0, unit: 'quintal' },
        ],
      },
    },
  });

  console.log('✅ AGRI MITRA Database Seeded Successfully!');
  console.log('Credentials: admin@agrimitra.org / Password123!');
  console.log('Credentials: farmer.ramesh@agrimitra.org / Password123!');
  console.log('Credentials: buyer.freshmart@agrimitra.org / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
