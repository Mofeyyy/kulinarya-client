import { z } from "zod";

// Helpers
const isFileOrUrl = z.union([z.string().url(), z.instanceof(File), z.literal("")]).nullable();

// ----------------------------------------------------------------------

const recipeShema = z.object({
  title: z.string().min(2, "Title is required"),

  originProvince: z.string().min(1, "Origin province is required"),

  foodCategory: z.enum(["dishes", "soup", "drinks", "desserts", "pastries"], {
    errorMap: () => ({
      message: "Food category is required",
    }),
  }),

  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .trim()
    .optional(),

  ingredients: z
    .array(
      z.object({
        quantity: z.string().min(1, "Quantity is required"),
        unit: z.enum(["g", "kg", "ml", "l", "cup", "tbsp", "tsp", "pcs"], {
          errorMap: () => ({
            message: "Ingredient unit is required",
          }),
        }),
        name: z.string().min(1, "Ingredient name is required"),
      }),
    )
    .min(1, "Ingredients are required")
    .max(50, "Maximum 50 ingredients allowed"),

  procedure: z
    .array(
      z.object({
        stepNumber: z.number().int().min(1),
        content: z
          .string()
          .min(1, "Step content is required")
          .max(500, "Step content must not exceed 500 characters")
          .trim(),
      }),
    )
    .min(1, "Procedures are required")
    .max(30, "Maximum 30 steps allowed")
    .optional(),

  // File --------------------------------------------------------------

  // Main Picture (Required)
  mainPicture: isFileOrUrl.refine(
    (value) => {
      if (!value) return false;
      return true;
    },
    { message: "Main Picture is Required" },
  ),

  // Video (Optional)
  video: isFileOrUrl.optional(),

  // Additional Pictures (Optional, Max 5)
  additionalPictures: z
    .array(isFileOrUrl)
    .max(5, "Only up to 5 additional pictures allowed")
    .optional(),

  // File --------------------------------------------------------------
});

export const firstStepSchema = recipeShema.pick({
  title: true,
  originProvince: true,
  foodCategory: true,
  description: true,
});

export const secondStepSchema = recipeShema.pick({
  ingredients: true,
  procedure: true,
});

export const thirdStepSchema = recipeShema.pick({
  mainPicture: true,
  video: true,
  additionalPictures: true,
});

export default recipeShema;
