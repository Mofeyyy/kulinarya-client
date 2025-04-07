import { useQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// ----------------------------------------------------------------
const fetchUserData = async ({ queryKey }) => {
  const [_, userId] = queryKey;

  const response = await handleApiRequest(() => API.get(`/users/${userId}`));

  return response?.user || [];
};

const useFetchUserData = (userId) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: fetchUserData,
    enabled: !!userId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchUserData;
