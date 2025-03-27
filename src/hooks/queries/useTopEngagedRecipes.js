import { useQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// --------------------------------------------------------

const fetchTopEngagedRecipes = async () => {
  const response = await handleApiRequest(() => API.get("/recipes/top-engaged"));

  return response?.topEngagedRecipes || [];
};

const useTopEngagedRecipes = () => {
  return useQuery({
    queryKey: ["topEngagedRecipes"],
    queryFn: fetchTopEngagedRecipes,
    retry: 3,
  });
};

export default useTopEngagedRecipes;
