import { z } from "zod";
import { TableSchema } from "../type/table.type";

export const CreateTableDTO = TableSchema.pick({
  tableName: true,
  tableCapacity: true,
});

export type CreateTableDTO = z.infer<typeof CreateTableDTO>;

export const EditTableDTO = TableSchema.pick({
  tableName: true,
  tableCapacity: true,
}).partial();

export type EditTableDTO = z.infer<typeof EditTableDTO>;
