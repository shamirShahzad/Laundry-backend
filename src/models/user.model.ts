import * as z from "zod";

export const User = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  password: z.string(),
  phone: z.string(),
  role: z.string(),
});
