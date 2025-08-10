import { z } from "zod";
export const Service = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string().optional(),
});

export const ServiceUpdate = z.object({
  id: z.uuid().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  updated_at: z.coerce.date().nullable().optional(),
});
