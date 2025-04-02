import { useQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// ----------------------------------------------------------------
const fetchRecipeById = async (recipeId) => {
  const response = await handleApiRequest(() => API.get(`/recipes/${recipeId}`));

  return response?.recipe || [];
};

const useFetchRecipe = (recipeId) => {
  return useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => fetchRecipeById(recipeId),
    enabled: !!recipeId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchRecipe;
