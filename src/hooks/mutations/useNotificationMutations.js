import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/config/axios";
import toast from "react-hot-toast";

// --------------------------------------------------------

const useNotificationMutations = (notificationId) => {
  const queryClient = useQueryClient();

  const markNotificationAsRead = async () =>
    await handleApiRequest(() => API.patch(`/notifications/${notificationId}/read`));

  const markNotificationAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["unreadNotificationsCount"]);
      toast.success("Notification marked as read!", {
        duration: 5000,
      });
    },
    onError: (error) => {
      toast.error(`Error marking notification as read: ${error.message}`, {
        duration: 5000,
      });
    },
  });

  const markAllNotificationsAsRead = async () =>
    await handleApiRequest(() => API.patch("/notifications/read-all"));

  const markAllNotificationsAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["unreadNotificationsCount"]);
      toast.success("All unread notifications marked as read!", {
        duration: 5000,
      });
    },
    onError: (error) => {
      toast.error(`Error marking all unread notifications as read: ${error.message}`, {
        duration: 5000,
      });
    },
  });

  const deleteNotification = async () =>
    await handleApiRequest(() => API.delete(`/notifications/${notificationId}/soft-delete`));

  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["unreadNotificationsCount"]);
      toast.success("Notification successfully deleted!", {
        duration: 5000,
      });
    },
    onError: (error) => {
      console.error("Error deleting notification", error);
      toast.error(`Error deleting notification: ${error.message}`, {
        duration: 5000,
      });
    },
  });

  return {
    markNotificationAsReadMutation,
    markAllNotificationsAsReadMutation,
    deleteNotificationMutation,
  };
};

export default useNotificationMutations;
