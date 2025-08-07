import { z } from "zod";
export const Item = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.record(z.string(), z.number()).default({}),
  description: z.string(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const ItemUpdate = z.object({
  id: z.uuid().optional(),
  name: z.string().optional(),
  price: z.record(z.string(), z.number()).default({}).optional(),
  description: z.string().optional(),
  updated_at: z.coerce.date().nullable().optional(),
});
