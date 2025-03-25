import { useMutation } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";
import convertToFormData from "@/utils/convertToFormData";

const updateRecipe = async ({ recipeId, ...recipeData }) => {
  const formData = convertToFormData(recipeData);

  const response = await handleApiRequest(() =>
    API.patch(`/recipes/${recipeId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
  );

  return response;
};

const useUpdateRecipe = () => {
  return useMutation({
    mutationFn: updateRecipe,
  });
};

export default useUpdateRecipe;
