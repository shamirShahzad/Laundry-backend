import { z } from "zod";
export const loginRequestTup = z.object({
  email: z.string(),
  password: z.string(),
});
