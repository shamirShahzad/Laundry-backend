import { z } from "zod";
const chartDataObject = z.object({
  date: z.string(),
  orders: z.number(),
});

export const chartData = z.array(chartDataObject);
