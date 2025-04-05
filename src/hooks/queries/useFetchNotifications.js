import { useInfiniteQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// ----------------------------------------------------------------
const fetchNotifications = async ({ pageParam = null }) => {
  const response = await handleApiRequest(() =>
    API.get(`/notifications/`, {
      params: { cursor: pageParam, limit: 10 },
    }),
  );

  return {
    notifications: response?.notifications || [],
    unreadCount: response?.unreadCount || 0,
    nextCursor: response?.cursor || null,
  };
};

const useFetchNotifications = (isLoggedIn) => {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    keepPreviousData: true,
    retry: 3,
    enabled: !!isLoggedIn,
  });
};

export default useFetchNotifications;
