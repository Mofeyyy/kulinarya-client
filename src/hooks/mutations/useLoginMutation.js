import { useMutation, useQueryClient } from "@tanstack/react-query";
import handleApiRequest from "@/utils/handleApiRequest";
import API from "@/config/axios";

// ------------------------------------------------------------------------

const loginFunction = async (loginCredentials) =>
  handleApiRequest(() => API.post("/auth/login", loginCredentials));

const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginFunction,
  });
};

export default useLoginMutation;
