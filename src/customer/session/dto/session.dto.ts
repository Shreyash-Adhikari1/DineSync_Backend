import { z } from "zod";

export const JoinSessionDTO = z.object({
  name: z.string().trim().min(1).max(50),
});

export type JoinSessionDTO = z.infer<typeof JoinSessionDTO>;
