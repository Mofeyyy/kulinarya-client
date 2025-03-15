import { useQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// ------------------------------------------------------------------------

const fetchUserDetails = async () =>
  handleApiRequest(() => API.get("/auth/user-details"));

const useFetchUserDetails = (isEnabled = false) => {
  return useQuery({
    queryKey: ["userDetails"],
    queryFn: fetchUserDetails,
    enabled: isEnabled,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchUserDetails;
