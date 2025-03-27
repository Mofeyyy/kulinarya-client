import { useQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// --------------------------------------------------------

const fetchFeaturedRecipes = async () => {
  const response = await handleApiRequest(() => API.get("/recipes/featured"));

  return response?.featuredRecipesData || [];
};

const useFeaturedRecipes = () => {
  return useQuery({
    queryKey: ["featuredRecipes"],
    queryFn: fetchFeaturedRecipes,
    retry: 3,
  });
};

export default useFeaturedRecipes;
