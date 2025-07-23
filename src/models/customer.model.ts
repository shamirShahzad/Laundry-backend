import { z } from "zod";
export const Customer = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.string().optional(),
  phone: z.string(),
  address: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});
