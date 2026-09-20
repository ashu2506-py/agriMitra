import { z } from 'zod';

export const CreateListingSchema = z.object({
  cropName: z
    .string()
    .trim()
    .min(2, 'Crop name is required')
    .max(100, 'Crop name is too long'),

  variety: z
    .string()
    .trim()
    .max(100, 'Variety is too long')
    .optional(),

  quantity: z
    .number()
    .positive('Quantity must be greater than 0'),

  unit: z.enum(['kg', 'quintal', 'ton'], {
    message: 'Unit must be kg, quintal, or ton',
  }),

  grade: z
    .string()
    .trim()
    .min(1, 'Grade is required'),

  expectedPrice: z
    .number()
    .positive('Expected price must be positive'),

  minPrice: z
    .number()
    .positive('Minimum price must be positive'),

  harvestDate: z
    .string()
    .datetime('Invalid harvest date'),

  availabilityEnd: z
    .string()
    .datetime('Invalid availability end date'),

  description: z
    .string()
    .trim()
    .max(1000, 'Description is too long')
    .optional(),

  images: z
    .array(z.string().url('Invalid image URL'))
    .optional(),
});

export const FilterListingSchema = z.object({
  cropName: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  grade: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export type CreateListingInput = z.infer<typeof CreateListingSchema>;
export type FilterListingInput = z.infer<typeof FilterListingSchema>;
