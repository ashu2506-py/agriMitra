export type UserRole = 'FARMER' | 'BUYER' | 'FPO' | 'DRIVER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isVerified: boolean;

  farmerProfile?: FarmerProfile | null;
  buyerProfile?: BuyerProfile | null;
  driverProfile?: DriverProfile | null;
  fpoProfile?: FPOProfile | null;
}

export interface FPOProfile {
  id: string;
  userId: string;
  orgName: string;
  regNumber: string;
  district: string;
  state: string;
  pincode: string;
  totalFarmers: number;
}
export type ListingStatus = 'DRAFT' | 'ACTIVE' | 'RESERVED' | 'SOLD' | 'EXPIRED' | 'CANCELLED';

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName?: string;
  farmerRating?: number;
  cropName: string;
  variety?: string;
  quantity: number;
  availableQty: number;
  unit: string;
  grade: string;
  expectedPrice: number;
  minPrice: number;
  harvestDate: string;
  availabilityEnd: string;
  location: string;
  district: string;
  state: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  status: ListingStatus;
  images: string[];
  qualityScore?: number;
  createdAt: string;
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  cropName: string;
  variety?: string;
  quantity: number;
  unit: string;
  grade?: string;
  maxPrice: number;
  district: string;
  radiusKm: number;
  deliveryDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface BuyerMatch {
  id: string;
  requirementId: string;
  listingId: string;
  listing: CropListing;
  matchScore: number;
  explanations: string[];
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'DISPUTED';

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  totalAmount: number;
  cropValue: number;
  logisticsFee: number;
  platformFee: number;
  taxAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  district: string;
  state: string;
  createdAt: string;
  cropName?: string;
  quantity?: number;
}

export interface Shipment {
  id: string;
  shipmentCode: string;
  orderId: string;
  driverId?: string;
  driverName?: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  estimatedKm: number;
  estimatedMinutes: number;
  currentLat?: number;
  currentLng?: number;
  createdAt: string;
}
