import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/config/axios";
import useRecipeStore from "../stores/useRecipeStore";

const useToggleReaction = (recipeId) => {
  const queryClient = useQueryClient();
  const { setRecipe } = useRecipeStore();

  const toggleReaction = async (reactionType) => {
    return handleApiRequest(async () =>
      API.post(`/reactions/${recipeId}/toggle`, { reaction: reactionType }),
    )();
  };

  // TODO: Add Toast Feature
  return useMutation({
    mutationFn: toggleReaction,

    onMutate: async (reactionValue) => {
      // Cancel any outgoing refetches to avoid race conditions
      await queryClient.cancelQueries(["recipe", recipeId, "view"]);

      // Get the current cached data
      const prevRecipe = queryClient.getQueryData(["recipe", recipeId, "view"]);

      if (!prevRecipe) return;

      const prevReaction = prevRecipe.userReaction?.reaction;
      const isRemovingReaction = reactionValue === null;
      const isAddingReaction = prevReaction === null && reactionValue !== null;

      // Optimistically update the cache
      queryClient.setQueryData(["recipe", recipeId, "view"], {
        ...prevRecipe,
        userReaction: isRemovingReaction
          ? null
          : { _id: prevRecipe.userReaction?._id || "newId", reaction: reactionValue },
        totalReactions:
          prevRecipe.totalReactions + (isAddingReaction ? 1 : isRemovingReaction ? -1 : 0),
      });

      // Return a rollback function in case of error
      return { prevRecipe };
    },

    onError: (_, __, context) => {
      if (context?.prevRecipe) {
        queryClient.setQueryData(["recipe", recipeId, "view"], context.prevRecipe); // Rollback on error
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(["recipe", recipeId, "view"]); // Ensure fresh data in the background
    },
  });
};

export default useToggleReaction;
