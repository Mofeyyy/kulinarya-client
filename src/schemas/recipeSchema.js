import { z } from "zod";

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
    .max(1000, "Description must not exceed 1000 characters")
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

  mainPicture: z
    .custom((file) => file instanceof File, "Main picture is required")
    .refine(
      (file) => !file || file.size <= 10 * 1024 * 1024,
      "File size must be under 10MB"
    )
    .refine(
      (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
      "Only JPEG or PNG allowed"
    ),

  video: z
    .custom(
      (file) => file === null || file === undefined || file instanceof File,
      "Invalid video file"
    )
    .refine(
      (file) => !file || file.size <= 50 * 1024 * 1024,
      "Video size must be under 50MB"
    )
    .refine(
      (file) => !file || ["video/mp4"].includes(file.type),
      "Only MP4 format allowed"
    )
    .optional(),

  additionalPictures: z
    .array(
      z
        .custom(
          (file) => file === null || file === undefined || file instanceof File,
          "Invalid file"
        )
        .refine(
          (file) => !file || file.size <= 10 * 1024 * 1024,
          "File size must be under 10MB"
        )
        .refine(
          (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
          "Only JPEG or PNG allowed"
        )
    )
    .max(5, "Maximum 5 additional pictures allowed")
    .optional(),

  // File --------------------------------------------------------------
});

export default recipeSchema;
