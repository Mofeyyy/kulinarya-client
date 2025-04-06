import { useQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// --------------------------------------------------------

const fetchPendingRecipes = async ({ queryKey }) => {
  const [_, filters] = queryKey;
  const { search, page, limit, sortOrder } = filters;

  const hasParams = search || page || limit || sortOrder;

  const response = await handleApiRequest(() =>
    API.get("/recipes/pending", {
      params: hasParams ? { search, page, limit, sortOrder } : {},
    }),
  );

  return response || [];
};

const usePendingRecipes = (filters) => {
  return useQuery({
    queryKey: ["pendingRecipes", filters],
    queryFn: fetchPendingRecipes,
    keepPreviousData: true,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

export default usePendingRecipes;
