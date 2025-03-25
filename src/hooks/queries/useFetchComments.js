import { useInfiniteQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// --------------------------------------------------------

const fetchComments = async ({ queryKey, pageParam = null }) => {
  const [, recipeId] = queryKey;

  const response = await handleApiRequest(() =>
    API.get(`/comments/${recipeId}`, {
      params: { cursor: pageParam, limit: 10 },
    })
  );

  return {
    comments: response.comments || [],
    nextCursor: response.cursor || null,
  };
};

const useFetchComments = (recipeId, isModalOpen = false) => {
  return useInfiniteQuery({
    queryKey: ["comments", recipeId],
    queryFn: fetchComments,
    enabled: !!recipeId && isModalOpen,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    keepPreviousData: true,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

export default useFetchComments;
