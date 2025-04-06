import { useQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// ----------------------------------------------------------------
const fetchApprovedRecipeById = async ({ queryKey }) => {
  const [_, recipeId] = queryKey;

  const response = await handleApiRequest(() => API.get(`/recipes/approved/${recipeId}`));

  return response?.recipe || [];
};

const useFetchApprovedRecipe = (recipeId) => {
  return useQuery({
    queryKey: ["recipe", recipeId, "view"],
    queryFn: fetchApprovedRecipeById,
    enabled: !!recipeId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchApprovedRecipe;
