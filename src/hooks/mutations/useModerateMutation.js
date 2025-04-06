import { useMutation, useQueryClient } from "@tanstack/react-query";
import handleApiRequest from "@/utils/handleApiRequest";
import API from "@/config/axios";
import toast from "react-hot-toast";

// ------------------------------------------------------------------------

const moderateRecipe = async (moderationId, moderationDecision) =>
  handleApiRequest(() => API.patch(`/moderations/${moderationId}`, moderationDecision));

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
