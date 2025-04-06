import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/config/axios";

const useToggleFeature = (filters) => {
  const queryClient = useQueryClient();

  const toggleFeature = async (recipeId) => {
    return handleApiRequest(async () => API.patch(`/recipes/${recipeId}/toggle-feature`));
  };

  return useMutation({
    mutationFn: toggleFeature,

    onSuccess: () => {
      queryClient.invalidateQueries(["recipes", filters]);
    },
  });
};

export default useToggleFeature;
