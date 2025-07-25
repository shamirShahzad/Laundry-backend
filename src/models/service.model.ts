import { z } from "zod";
export const Service = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const ServiceUpdate = z.object({
  id: z.uuid().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().nullable().optional(),
});
