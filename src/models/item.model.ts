import { z } from "zod";
import { Service } from "./service.model";
export const Item = z.object({
  id: z.uuid(),
  name: z.string(),
  price: z.array(Service).default([]),
  description: z.string(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});
