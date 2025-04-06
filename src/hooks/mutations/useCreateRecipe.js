import { useMutation } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";
import convertToFormData from "@/utils/convertToFormData";
import { useQueryClient } from "@tanstack/react-query";

//  ------------------------------------------------------------------------

const createRecipe = async (recipeData) => {
  const formData = convertToFormData(recipeData);

  const response = await handleApiRequest(() =>
    API.post("/recipes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }),
  );

  return response;
};

const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });
};

export default useCreateRecipe;
