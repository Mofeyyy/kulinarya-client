import { useQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// ----------------------------------------------------------------
const fetchModeration = async (recipeId) => {
  const response = await handleApiRequest(() => API.get(`/moderations/${recipeId}`));

  return response?.moderation || [];
};

const useFetchSpecificModeration = (recipeId, isLoggedIn) => {
  return useQuery({
    queryKey: ["moderation", recipeId],
    queryFn: () => fetchModeration(recipeId),
    enabled: !!recipeId && isLoggedIn,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchSpecificModeration;
