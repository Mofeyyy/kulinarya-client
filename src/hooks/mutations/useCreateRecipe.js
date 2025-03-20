import { useMutation } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

//  ------------------------------------------------------------------------
const convertToFormData = (formValues) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(formValues)) {
    if (value === undefined || value === null) continue; // Skip empty values

    if (Array.isArray(value)) {
      if (key === "additionalPictures") {
        // Append each file separately
        for (const file of value) {
          if (file instanceof File) {
            formData.append("additionalPictures", file);
          }
        }
      } else {
        // Convert other arrays (ingredients, procedure) to JSON string
        formData.append(key, JSON.stringify(value));
      }
    } else if (value instanceof File) {
      formData.append(key, value); // Append single file
    } else {
      formData.append(key, value); // Append text fields
    }
  }

  // **Debugging: Log FormData contents**
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return formData;
};

const createRecipe = async (recipeData) => {
  const formData = convertToFormData(recipeData);

  const response = await handleApiRequest(() =>
    API.post("/recipes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
  );

  return response;
};

const useCreateRecipe = () => {
  return useMutation({
    mutationFn: createRecipe,
  });
};

export default useCreateRecipe;
