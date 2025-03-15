import { useMutation, useQueryClient } from "@tanstack/react-query";
import handleApiRequest from "@/utils/handleApiRequest";
import API from "@/config/axios";

// ------------------------------------------------------------------------

const logoutFunction = async () =>
  handleApiRequest(() => API.post("/auth/logout"));

const useLogoutMutation = () => {
  return useMutation({
    mutationFn: logoutFunction,
  });
};

export default useLogoutMutation;
