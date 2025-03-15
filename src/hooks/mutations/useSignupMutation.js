import { useMutation, useQueryClient } from "@tanstack/react-query";
import handleApiRequest from "@/utils/handleApiRequest";
import API from "@/config/axios";

// ------------------------------------------------------------------------

const signupFunction = async (signupCredentials) =>
  handleApiRequest(() => API.post("/auth/register", signupCredentials));

const useSignupMutation = () => {
  return useMutation({
    mutationFn: signupFunction,
  });
};

export default useSignupMutation;
