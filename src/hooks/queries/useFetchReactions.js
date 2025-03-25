import { useInfiniteQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// --------------------------------------------------------

const fetchReactions = async ({ queryKey, pageParam = null }) => {
  const [, recipeId] = queryKey;

  const response = await handleApiRequest(() =>
    API.get(`/reactions/${recipeId}`, {
      params: { cursor: pageParam, limit: 10 },
    })
  );

  return {
    reactions: response.reactions || [],
    nextCursor: response.cursor || null,
  };
};

const useFetchReactions = (recipeId, isModalOpen = false) => {
  return useInfiniteQuery({
    queryKey: ["reactions", recipeId],
    queryFn: fetchReactions,
    enabled: !!recipeId && isModalOpen,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    keepPreviousData: true,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

export default useFetchReactions;
