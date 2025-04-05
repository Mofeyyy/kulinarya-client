import { useQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// ----------------------------------------------------------------
const fetchPendingModerationCount = async () => {
  const response = await handleApiRequest(() => API.get(`/moderations/pending-count`));

  return response?.pendingModerationCount || 0;
};

const usePendingModerationCount = (isAuthorized) => {
  return useQuery({
    queryKey: ["pendingModerationCount"],
    queryFn: fetchPendingModerationCount,
    retry: 3,
    enabled: isAuthorized,
    refetchOnWindowFocus: false,
  });
};

export default usePendingModerationCount;
