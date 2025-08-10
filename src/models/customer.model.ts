import { z } from "zod";
export const Customer = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.email().optional(),
  phone: z.string(),
  address: z
    .object({
      country: z.string(),
      state: z.string().nullable(),
      city: z.string().nullable(),
      street: z.string(),
      building: z.string(),
    })
    .optional(),
});

export const CustomerUpdate = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  address: z
    .object({
      country: z.string(),
      state: z.string().nullable(),
      city: z.string().nullable(),
      street: z.string(),
      building: z.string(),
    })
    .optional(),
  updated_at: z.coerce.date().nullable().optional(),
});
