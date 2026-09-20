import { z } from 'zod';

export const CreateOrderSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  district: z.string().min(2, 'District is required'),
  state: z.string().default('Uttar Pradesh'),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
