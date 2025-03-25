import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/config/axios";
import useRecipeStore from "../stores/useRecipeStore";

const useToggleReaction = (recipeId) => {
  const queryClient = useQueryClient();
  const { setRecipe } = useRecipeStore();

  const toggleReaction = async (reactionType) => {
    return handleApiRequest(async () =>
      API.post(`/reactions/${recipeId}/toggle`, { reaction: reactionType })
    )();
  };

  // TODO: Add Toast Feature
  return useMutation({
    mutationFn: toggleReaction,

    onSuccess: () => {
      queryClient.invalidateQueries(["recipe", recipeId]);
    },

    onError: () => {
      queryClient.invalidateQueries(["recipe", recipeId]);
    },
  });
};

export default useToggleReaction;
