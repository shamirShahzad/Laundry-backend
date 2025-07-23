import { z } from "zod";
export const Service = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});
