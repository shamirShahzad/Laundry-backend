import { z } from "zod";
const PriceSchema = z.object({
  serviceId: z.uuid("Service id is required"),
  serviceName: z.string().min(1, "Service name is required"),
  price: z.number().min(0, "Price must be greater than 0"),
});

export const Item = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  prices: z.array(PriceSchema).min(1, "Price is required"),
  description: z.string(),
  image: z.string().optional(),
});

export const ItemUpdate = z.object({
  id: z.uuid().optional(),
  name: z.string().optional(),
  prices: z.array(PriceSchema).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  updated_at: z.coerce.date().nullable().optional(),
});
