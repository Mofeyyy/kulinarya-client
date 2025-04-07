import { useMutation } from "@tanstack/react-query";
import API from "@/config/axios";
import handleApiRequest from "@/utils/handleApiRequest";
import { QueryClient } from "@tanstack/react-query";

// ----------------------------------------------------------------

const convertToFormData = (userData) => {
  const formData = new FormData();

  Object.entries(userData).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};

const updateUser = async ({ userId, userData }) => {
  const formData = convertToFormData(userData);

  const response = await handleApiRequest(() =>
    API.patch(`/users/${userId}/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }),
  );

  return response;
};

const useUserInfoMutation = () => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["userDetails"]);
    },
  });
};

export default useUserInfoMutation;
