import z from "zod";

export const OrderItems = z.object({
  item_id: z.uuid(),
  quantity: z.number(),
  service_ids: z.array(z.uuid()),
  amount: z.number("Amount is required"),
});

export const Order = z.object({
  id: z.uuid().optional(),
  cust_id: z.number(),
  status: z.string().optional(),
  payment_status: z.string().optional(),
  items: z.array(OrderItems),
  total: z.number(),
  paid_amount: z.number(),
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
