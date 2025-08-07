import z from "zod";

export const Order = z.object({
  id: z.uuid().optional(),
  cust_id: z.number(),
  status: z.string().optional(),
  payment_status: z.string().optional(),
  notes: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().nullable().optional(),
});

export const OrderUpdate = z.object({
  id: z.uuid().optional(),
  cust_id: z.number().optional(),
  status: z.string().optional(),
  payment_status: z.string().optional(),
  notes: z.string().optional(),
  updated_at: z.coerce.date().nullable().optional(),
});
