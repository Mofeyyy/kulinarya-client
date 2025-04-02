// Imported Constants
import { MAX_WIDTH, MAX_HEIGHT } from "@/constants/recipeFormConstants";

// ----------------------------------------------------------------------------

export const isFormStepChanged = (currentValues, defaultValues) => {
  return JSON.stringify(currentValues) !== JSON.stringify(defaultValues);
};

export const validateImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      resolve(img.width <= MAX_WIDTH && img.height <= MAX_HEIGHT);
    };
  });
};

export const validateFileSize = (file, maxSizeMB) => {
  return file instanceof File && file.size > maxSizeMB * 1024 * 1024;
};

export const validateFileType = (file, allowedTypes) => {
  return file instanceof File && !allowedTypes.includes(file.type);
};

export const convertToWebP = async (file) => {
  if (!file) return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(
              new File([blob], file.name.replace(/\.(png|jpg|jpeg)$/, ".webp"), {
                type: "image/webp",
              }),
            );
          } else {
            resolve(file); // If conversion fails, use original
          }
        },
        "image/webp",
        0.8,
      );
    };
  });
};
