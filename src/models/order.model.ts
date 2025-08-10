import z from "zod";

export const Order = z.object({
  id: z.uuid().optional(),
  cust_id: z.number(),
  status: z.string().optional(),
  payment_status: z.string().optional(),
  notes: z.string().optional(),
});

export const OrderUpdate = z.object({
  id: z.uuid().optional(),
  cust_id: z.number().optional(),
  status: z.string().optional(),
  payment_status: z.string().optional(),
  notes: z.string().optional(),
  updated_at: z.coerce.date().nullable().optional(),
});
