// Imported Icons
import { Check, Trash2, Eye, EllipsisVertical } from "lucide-react";

// Imported Components
import { Button } from "../ui/button";
import useConfirmDialog from "@/components/useConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Imported Queries and Mutations
import useNotificationMutations from "@/hooks/mutations/useNotificationMutations";

//  ----------------------------------------------------------

const NotificationOptions = ({
  notificationId,
  handleViewNotification,
  isRead,
  toggleIsNotificationModalOpen,
}) => {
  const { markNotificationAsReadMutation, deleteNotificationMutation } =
    useNotificationMutations(notificationId);

  const { mutateAsync: markAsRead, isPending: isMarkingAsRead } = markNotificationAsReadMutation;
  const { mutateAsync: deleteNotification, isPending: isDeletingNotification } =
    deleteNotificationMutation;
  const isLoading = isMarkingAsRead || isDeletingNotification;

  const { openDialog, ConfirmDialog } = useConfirmDialog();

  // Functions
  const handleMarkAsRead = async () => {
    await markAsRead();
    toggleIsNotificationModalOpen();
  };

  const handleDeleteNotification = async () => {
    const isConfirm = await openDialog(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
    );

    if (isConfirm) {
      await deleteNotification();
    }

    toggleIsNotificationModalOpen();
  };

  const menuItems = [
    { icon: Eye, label: "View", action: handleViewNotification },
    !isRead && { icon: Check, label: "Mark as Read", action: handleMarkAsRead },
    { icon: Trash2, label: "Delete", action: handleDeleteNotification },
  ].filter(Boolean);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="hover:bg-background flex items-center justify-center rounded-full border !p-2 shadow-sm transition-transform hover:scale-110"
        >
          <EllipsisVertical className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {menuItems.map(({ icon: Icon, label, action }) => (
          <DropdownMenuItem
            key={label}
            onClick={action}
            disabled={isLoading}
            className="group notification-options cursor-pointer"
          >
            <Icon className="group-hover:text-primary size-5 transition-colors" />
            <span className="group-hover:text-primary transition-colors">{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
      {ConfirmDialog}
    </DropdownMenu>
  );
};

export default NotificationOptions;
