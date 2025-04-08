import { useMutation } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";
import { QueryClient } from "@tanstack/react-query";

// ----------------------------------------------------------------

const changePassword = async ({ userId, passwordData }) =>
  await handleApiRequest(() =>
    API.patch(`/users/${userId}/change-password`, passwordData, {
      withCredentials: true,
    }),
  );

const userChangePassword = () => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries(["userDetails"]);
    },
  });
};

export default userChangePassword;
