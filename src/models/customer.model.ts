import { z } from "zod";
export const Customer = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.email().optional(),
  phone: z.string(),
  address: z
    .object({
      city: z.string(),
      street: z.string(),
      building: z.string(),
      country: z.string(),
    })
    .optional(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});
