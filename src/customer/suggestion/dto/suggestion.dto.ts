import { z } from "zod";

export const CreateSuggestionDTO = z.object({
  memberId: z.string().min(1),
  menuItemId: z.string().min(1),
});

export const VoteSuggestionDTO = z.object({
  memberId: z.string().min(1),
  vote: z.boolean(),
});
