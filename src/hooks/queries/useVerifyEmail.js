import { useQuery } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";

// ------------------------------------------------------------------------

const verifyEmailFunction = async (token) =>
  handleApiRequest(() => API.get(`/auth/verify-email?token=${token}`));

const useVerifyEmail = (token) => {
  return useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmailFunction(token),
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useVerifyEmail;
