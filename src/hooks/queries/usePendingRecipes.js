import { useQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// --------------------------------------------------------

const fetchFilteredRecipes = async ({ queryKey }) => {
  const [_, filters] = queryKey;
  const { origin, category, search, page, limit, sortOrder } = filters;

  const hasParams = origin || category || search || page || limit || sortOrder;

  const response = await handleApiRequest(() =>
    API.get("/recipes/approved", {
      params: hasParams ? { origin, category, search, page, limit, sortOrder } : {},
    }),
  );

  return response || [];
};

const useRecipes = (filters) => {
  return useQuery({
    queryKey: ["recipes", filters],
    queryFn: fetchFilteredRecipes,
    keepPreviousData: true,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

export default useRecipes;
