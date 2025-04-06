import { useMutation } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";
import convertToFormData from "@/utils/convertToFormData";
import { useQueryClient } from "@tanstack/react-query";

const updateRecipe = async ({ recipeId, ...recipeData }) => {
  const formData = convertToFormData(recipeData);

  const response = await handleApiRequest(() =>
    API.patch(`/recipes/${recipeId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }),
  );

  return response;
};

const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });
};

export default useUpdateRecipe;
