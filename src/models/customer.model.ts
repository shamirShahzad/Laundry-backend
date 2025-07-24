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

export const CustomerUpdate = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  address: z
    .object({
      city: z.string(),
      street: z.string(),
      building: z.string(),
      country: z.string(),
    })
    .optional(),
  created_at: z.date().optional(),
  updated_at: z.date().nullable().optional(),
});
