// Imported Libraries
import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Imported Icons
import { Bell, Loader2, Dot, Check, Trash2, Eye, EllipsisVertical } from "lucide-react";

// Imported Components
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useConfirmDialog from "@/components/useConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Improted Stores
import useAuthStore from "@/hooks/stores/useAuthStore";

// Imported Queries and Mutations
import useFetchNotifications from "@/hooks/queries/useFetchNotifications";
import useNotificationMutations from "@/hooks/mutations/useNotificationMutations";
import useUnreadNotificationsCount from "@/hooks/queries/useUnreadNotificationsCount";

// For Date Formatting Library
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

//  ----------------------------------------------------------

const TestNewNotification = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchNotifications(isLoggedIn);

  const { data: unreadCount } = useUnreadNotificationsCount(isLoggedIn);

  const observer = useRef();

  const lastNotificationRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          setTimeout(() => {
            fetchNextPage();
          }, 800);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  // For hardcoded codes
  const isThereUnreadNotification = data?.pages?.some((page) =>
    page.notifications.some((notification) => !notification.isRead),
  );
  const hasPageAndNotificationsToLoad =
    data?.pages?.length > 0 && data?.pages[0]?.notifications.length > 0;

  // For Debugging
  useEffect(() => {
    console.log("Notifications Data:", data);
    console.log("Unread Notification Count:", unreadCount);
  }, [data, unreadCount]);

  return (
    <Popover>
      {isLoggedIn && (
        <PopoverTrigger asChild>
          <Button className="relative rounded-full bg-gradient-to-r from-orange-500 to-orange-600 !p-2 text-white shadow-lg transition-transform hover:scale-110">
            <Bell className="size-5" />

            {/* Notification count */}
            {isThereUnreadNotification && (
              <span className="absolute -top-1 -right-1 flex size-5 animate-bounce items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-lg">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
      )}

      <PopoverContent className="flex w-[90vw] max-w-md min-w-[300px] flex-col gap-3 rounded-lg">
        {/* Title Section */}
        <NotificationTitleSection isThereUnreadNotification={isThereUnreadNotification} />

        {/* Notification List */}
        <div className="no-scrollbar flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
          {hasPageAndNotificationsToLoad &&
            data.pages.map((page, pageIndex) => (
              <div key={pageIndex} className="flex flex-col gap-2">
                {page.notifications.map((notification, notificationIndex) => {
                  const isLastReactionInCurrentPage =
                    pageIndex === data.pages.length - 1 &&
                    notificationIndex === page.notifications.length - 1;

                  if (isLastReactionInCurrentPage) {
                    return (
                      <div ref={lastNotificationRef} key={notification._id}>
                        <NotificationItem notification={notification} />
                      </div>
                    );
                  }

                  return <NotificationItem key={notification._id} notification={notification} />;
                })}
              </div>
            ))}

          <div className="flex items-center justify-center">
            {!hasPageAndNotificationsToLoad ? (
              <p className="text-center text-sm">No notifications yet</p>
            ) : hasNextPage || isFetchingNextPage || isLoading ? (
              <Loader2 className="text-primary size-8 animate-spin" />
            ) : (
              <p className="text-sm">No more notifications to load</p>
            )}

            {error && <p className="text-destructive-foreground">Failed to load notifications</p>}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

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

const NotificationItem = ({ notification }) => {
  const { byUser } = notification;
  const { firstName, lastName, profilePictureUrl } = byUser;

  // Contants
  const avatarFallback = `${firstName[0]}${lastName[0]}`;
  const fromUserFullName = byUser ? `${firstName} ${lastName}` : "Unknown User";

  return (
    <div
      className="hover:border-primary group relative flex w-full cursor-pointer gap-3 rounded-lg border-2 p-2 shadow-sm transition-colors"
      onClick={(e) => {
        // Prevent clicking when the Notification Options button is clicked
        if (e.target.closest(".notification-options")) return;

        alert("Notification Clicked");
      }}
    >
      {/* User Avatar */}
      <Avatar
        onClick={() => alert("Feature: User Profile")}
        className="group-hover:border-primary notification-options size-14 cursor-pointer border-2 transition-colors hover:scale-105"
      >
        <AvatarImage src={profilePictureUrl} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>

      <NotificationContent
        fromUserFullName={fromUserFullName}
        content={notification?.content}
        createdAt={notification?.createdAt}
        isRead={notification?.isRead}
      />

      <NotificationOptions
        notificationId={notification?._id}
        isRead={notification?.isRead}
        recipeId={notification?.fromPost}
      />
    </div>
  );
};

const NotificationContent = ({ fromUserFullName, content, createdAt, isRead }) => {
  return (
    <div className="flex flex-col">
      {/* From User Name */}
      <div className="flex items-center">
        <p
          className="text-foreground hover:text-primary notification-options cursor-pointer text-sm font-semibold transition-colors"
          onClick={() => alert("Feature: User Profile")}
        >
          {fromUserFullName}
        </p>

        {!isRead && <Dot className="text-primary animate-pulse" />}
      </div>

      <p className="text-muted-foreground text-sm">{content}</p>
      <p className="text-primary text-xs">{dayjs(createdAt).fromNow()}</p>
    </div>
  );
};

// TODO: Do View Button Navigation
// TODO: Analyze how notification will work in different types
const NotificationOptions = ({ notificationId, isRead, recipeId }) => {
  const { markNotificationAsReadMutation, deleteNotificationMutation } =
    useNotificationMutations(notificationId);

  const { mutateAsync: markAsRead, isPending: isMarkingAsRead } = markNotificationAsReadMutation;
  const { mutateAsync: deleteNotification, isPending: isDeletingNotification } =
    deleteNotificationMutation;
  const isLoading = isMarkingAsRead || isDeletingNotification;

  const navigateTo = useNavigate();
  const { openDialog, ConfirmDialog } = useConfirmDialog();

  // Functions
  const handleViewNotification = async () => {
    if (!isRead) {
      await markNotificationAsReadMutation.mutateAsync();
    }

    // TODO: Handle Notification Type Navigation Here
    // TODO: Use RecipeId to navigate to the recipe page
  };

  const handleMarkAsRead = async () => {
    await markAsRead();
  };

  const handleDeleteNotification = async () => {
    const isConfirm = await openDialog(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
    );

    if (isConfirm) {
      await deleteNotification();
    }
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

export default TestNewNotification;
