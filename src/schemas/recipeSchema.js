import { z } from "zod";

const isFileOrUrl = z.union([z.string().url(), z.instanceof(File)]);

const recipeSchema = z.object({
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
      })
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
      })
    )
    .min(1, "Procedures are required")
    .max(30, "Maximum 30 steps allowed")
    .optional(),

  // File --------------------------------------------------------------

  mainPicture: isFileOrUrl
    .nullable() // Allow null values explicitly
    .refine((file) => file !== null && file !== undefined, {
      message: "Main Picture is Required",
    })
    .refine(
      (file) => !(file instanceof File) || file.size <= 10 * 1024 * 1024,
      "File size must be under 10MB"
    )
    .refine(
      (file) =>
        !(file instanceof File) ||
        ["image/jpeg", "image/png"].includes(file.type),
      "Only JPEG or PNG allowed"
    ),

  video: isFileOrUrl
    .nullable()
    .optional()
    .refine(
      (file) => !(file instanceof File) || file.size <= 50 * 1024 * 1024,
      "Video size must be under 50MB"
    )
    .refine(
      (file) => !(file instanceof File) || ["video/mp4"].includes(file.type),
      "Only MP4 format allowed"
    ),

  additionalPictures: z
    .array(
      isFileOrUrl
        .refine(
          (file) => !(file instanceof File) || file.size <= 10 * 1024 * 1024,
          "File size must be under 10MB"
        )
        .refine(
          (file) =>
            !(file instanceof File) ||
            ["image/jpeg", "image/png"].includes(file.type),
          "Only JPEG or PNG allowed"
        )
    )
    .max(5, "5 additional pictures allowed")
    .optional(),

  // File --------------------------------------------------------------
});

export default recipeSchema;
