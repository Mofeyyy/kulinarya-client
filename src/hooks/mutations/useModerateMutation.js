import { useMutation, useQueryClient } from "@tanstack/react-query";
import handleApiRequest from "@/utils/handleApiRequest";
import API from "@/config/axios";

// ------------------------------------------------------------------------

const moderateRecipe = async (requestData) => {
  const { moderationId, payload: moderationDecision } = requestData;

  const { data } = await handleApiRequest(() =>
    API.patch(`/moderations/${moderationId}`, moderationDecision),
  );
  return data;
};

const useModerateMutation = (filters) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moderateRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingRecipes", filters]);
    },
  });
};

export default useModerateMutation;
