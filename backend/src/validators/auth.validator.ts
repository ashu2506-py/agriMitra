import { z } from 'zod';

const CommonRegisterFields = {
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  confirmPassword: z.string().min(1, 'Please confirm your password'),

  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number'),

  state: z
    .string()
    .trim()
    .min(2, 'State is required'),

  district: z
    .string()
    .trim()
    .min(2, 'District is required'),

  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Pincode must be 6 digits'),

  address: z
    .string()
    .trim()
    .min(5, 'Address must be at least 5 characters'),
};

const FarmerRegisterSchema = z.object({
  ...CommonRegisterFields,

  role: z.literal('FARMER'),

  farmSizeAcres: z
    .number()
    .nonnegative('Farm size cannot be negative'),

  cropsGrown: z
    .array(z.string().trim().min(1))
    .min(1, 'Select at least one crop'),
});

const BuyerRegisterSchema = z.object({
  ...CommonRegisterFields,

  role: z.literal('BUYER'),

  companyName: z
    .string()
    .trim()
    .min(2, 'Company name is required')
    .max(150, 'Company name is too long'),

  buyerType: z.enum(
    ['RETAILER', 'WHOLESALER', 'RESTAURANT', 'PROCESSOR'],
    {
      message: 'Invalid buyer type',
    }
  ),

  gstNumber: z
    .string()
    .trim()
    .optional(),
});

const FPORegisterSchema = z.object({
  ...CommonRegisterFields,

  role: z.literal('FPO'),

  orgName: z
    .string()
    .trim()
    .min(2, 'FPO organization name is required')
    .max(200, 'Organization name is too long'),

  regNumber: z
    .string()
    .trim()
    .min(2, 'FPO registration number is required'),
});

const DriverRegisterSchema = z.object({
  ...CommonRegisterFields,

  role: z.literal('DRIVER'),

  licenseNumber: z
    .string()
    .trim()
    .min(3, 'Driving license number is required'),

  vehicleType: z.enum(
    ['Mini-Truck', 'Pickup', 'Heavy Truck'],
    {
      message: 'Invalid vehicle type',
    }
  ),

  vehicleNumber: z
    .string()
    .trim()
    .min(4, 'Vehicle registration number is required'),

  capacityKg: z
    .number()
    .positive('Vehicle capacity must be greater than 0'),
});

export const RegisterSchema = z
  .discriminatedUnion('role', [
    FarmerRegisterSchema,
    BuyerRegisterSchema,
    FPORegisterSchema,
    DriverRegisterSchema,
  ])
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;