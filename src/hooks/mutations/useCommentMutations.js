import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/config/axios";
import toast from "react-hot-toast";

// --------------------------------------------------------

// TODO: Add Toast Feature
const useCommentMutations = (recipeId) => {
  const queryClient = useQueryClient();

  const addComment = async (content) =>
    await handleApiRequest(() => API.post(`/comments/${recipeId}`, { content }));

  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["recipe", recipeId]);
    },
  });

  const updateComment = async ({ commentId, content }) =>
    await handleApiRequest(() =>
      API.patch(
        `/comments/${commentId}`,
        { content },
        {
          withCredentials: true,
        },
      ),
    );

  const updateCommentMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["recipe", recipeId]);
      toast.success("Comment successfully updated!", {
        duration: 5000,
      });
    },
  });

  const deleteComment = async (commentId) =>
    await handleApiRequest(() =>
      API.delete(`/comments/${commentId}/soft-delete`, {
        withCredentials: true,
      }),
    );

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["recipe", recipeId]);
      toast.success("Comment successfully deleted!", {
        duration: 5000,
      });
    },
  });

  return { addCommentMutation, updateCommentMutation, deleteCommentMutation };
};

export default useCommentMutations;
