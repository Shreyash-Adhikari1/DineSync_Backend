import { z } from "zod";

const CommonAllergensSchema = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((val) => {
    if (!val) return [];
    const values = Array.isArray(val) ? val : val.split(",");
    return values.map((v) => v.trim()).filter(Boolean);
  });

export const MenuItemSchema = z.object({
  _id: z.string().optional(),
  ownerId: z.string().optional(),
  restaurantId: z.string().optional(),
  name: z.string(),
  description: z.string(),

  price: z.coerce.number().min(0),

  category: z.enum(["mains", "starters", "drinks"]),

  imageUrl: z.string(),

  isAvailable: z.boolean().default(true),
  isPopular: z.boolean().default(false),

  commonAllergens: CommonAllergensSchema,
});
