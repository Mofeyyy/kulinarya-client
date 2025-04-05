// Imported Libraries
import { useNavigate } from "react-router-dom";

// Imported Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Imported Custom Components
import NotificationOptions from "../notification/NotificationOptions";
import NotificationContent from "../notification/NotificationContent";

//  ----------------------------------------------------------

const NotificationItem = ({ notification, toggleIsNotificationModalOpen }) => {
  const { byUser } = notification;
  const { firstName, lastName, profilePictureUrl } = byUser;

  const navigateTo = useNavigate();

  // Contants
  const avatarFallback = `${firstName[0]}${lastName[0]}`;
  const fromUserFullName = byUser ? `${firstName} ${lastName}` : "Unknown User";
  const notificationType = notification?.type;
  const isRead = notification?.isRead;
  const fromPostId = notification?.fromPost;
  const notificationId = notification?._id;
  const createdAt = notification?.createdAt;
  const content = notification?.content;

  // Functions
  const handleViewNotification = async () => {
    if (!isRead) {
      await markNotificationAsReadMutation.mutateAsync();
    }

    toggleIsNotificationModalOpen();

    if (notificationType === "comment" || notificationType === "reaction") {
      navigateTo(`/recipes/${fromPostId}`);
    }

    if (notificationType === "announcement") {
      navigateTo(`/announcements/${fromPostId}`);
    }

    if (notificationType === "moderation") {
      navigateTo(`/moderation/${fromPostId}`);
    }
  };

  return (
    <div
      className="hover:border-primary group relative flex w-full cursor-pointer gap-3 rounded-lg border-2 p-2 shadow-sm transition-colors"
      onClick={(e) => {
        // Prevent clicking when the Notification Options button is clicked
        if (e.target.closest(".notification-options")) return;

        handleViewNotification();
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
        content={content}
        createdAt={createdAt}
        isRead={isRead}
      />

      <NotificationOptions
        notificationId={notificationId}
        handleViewNotification={handleViewNotification}
        isRead={isRead}
        fromPostId={fromPostId}
        toggleIsNotificationModalOpen={toggleIsNotificationModalOpen}
      />
    </div>
  );
};

export default NotificationItem;
