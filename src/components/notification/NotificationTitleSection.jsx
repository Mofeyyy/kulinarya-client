// Imported Components
import { Button } from "../ui/button";
import useConfirmDialog from "@/components/useConfirmDialog";

// Imported Queries and Mutations
import useNotificationMutations from "@/hooks/mutations/useNotificationMutations";

const NotificationTitleSection = ({ isThereUnreadNotification }) => {
  const { openDialog, ConfirmDialog } = useConfirmDialog();
  const { markAllNotificationsAsReadMutation } = useNotificationMutations();
  const { mutateAsync: markAllAsRead, isPending: isMarkingAllAsRead } =
    markAllNotificationsAsReadMutation;

  const handleMarkAllAsRead = async () => {
    const isConfirm = await openDialog(
      "Mark all as read",
      "Are you sure you want to mark all notifications as read? This action cannot be undone.",
    );

    if (isConfirm) {
      await markAllAsRead();
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      {/* Title */}
      <h2 className="text-primary text-xl font-bold">Notifications</h2>

      {/* If there are unread notifications */}
      {isThereUnreadNotification && (
        <Button
          variant="ghost"
          size="xs"
          className="hover:text-primary hover:bg-background px-3 font-normal transition-colors"
          onClick={handleMarkAllAsRead}
          disabled={isMarkingAllAsRead}
        >
          Mark all as read
        </Button>
      )}

      {ConfirmDialog}
    </div>
  );
};

export default NotificationTitleSection;
