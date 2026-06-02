import { z } from "zod";

export const TableSchema = z.object({
  _id: z.string().optional(),
  ownerId: z.string().optional(),
  restaurandId: z.string().optional(),
  tableNumber: z.number(),

  qrToken: z.string(),
  qrCode: z.string(),

  tableName: z.string(),
  tableCapacity: z.number(),

  isActive: z.boolean(),
  isReserved: z.boolean(),
});

export type Table = z.infer<typeof TableSchema>;
