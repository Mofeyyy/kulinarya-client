import { useQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// ----------------------------------------------------------------

const fetchUnreadNotificationsCount = async () => {
  const response = await handleApiRequest(() => API.get(`/notifications/unread-count`));

  return response?.unreadCount || 0;
};

const useUnreadNotificationsCount = (isLoggedIn) => {
  return useQuery({
    queryKey: ["unreadNotificationsCount"],
    queryFn: fetchUnreadNotificationsCount,
    retry: 3,
    enabled: !!isLoggedIn,
  });
};

export default useUnreadNotificationsCount;
