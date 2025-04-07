// Imported Libraries
import { useNavigate } from "react-router-dom";

// Imported Images
import kulinaryaLogo from "@/assets/kulinarya-logo.jpg";

// Imported Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Imported Custom Components
import NotificationOptions from "../notification/NotificationOptions";
import NotificationContent from "../notification/NotificationContent";

// Imported Mutations
import useNotificationMutations from "@/hooks/mutations/useNotificationMutations";


import { useState } from "react";
import API from "@/config/axios"; // adjust if using another instance
import AnnouncementFullView from "@/pages/home/AnnouncementModal/views/AnnouncementFullView";

//  ----------------------------------------------------------

const NotificationItem = ({ notification, toggleIsNotificationModalOpen, setSelectedAnnouncement }) => {
  const navigateTo = useNavigate();
  


  // Contants
  const profilePictureUrl = notification?.byUser
    ? notification?.byUser?.profilePictureUrl
    : kulinaryaLogo;
  const avatarFallback =
    notification?.byUser?.firstName[0] + notification?.byUser?.lastName[0] || "KS";
  const fromUserFullName = notification?.byUser
    ? `${notification?.byUser?.firstName} ${notification?.byUser?.lastName}`
    : "Kulinarya System";
  const notificationType = notification?.type;
  const isRead = notification?.isRead;
  const fromPostId = notification?.fromPost;
  const notificationId = notification?._id;
  const content = notification?.content;
  const dateDisplay = notification?.updatedAt ? notification?.updatedAt : notification?.createdAt;

  const { markNotificationAsReadMutation } = useNotificationMutations(notificationId);
  const { mutateAsync: markAsRead } = markNotificationAsReadMutation;

  // Functions
  const handleViewNotification = async () => {
    if (!isRead) {
      await markAsRead();
    }
  
    if (notificationType === "announcement") {
      toggleIsNotificationModalOpen(); // Close popover first
      const { data } = await API.get(`/announcements/${fromPostId}`);
      setSelectedAnnouncement(data.announcement);
      return;
    }
  
    // Close parent modal AFTER setting announcement
    toggleIsNotificationModalOpen();
  
    if (notificationType === "comment" || notificationType === "reaction") {
      navigateTo(`/recipes/${fromPostId}`);
    }
  
    if (notificationType === "moderation") {
      navigateTo(`/moderation/${fromPostId}`);
    }
  };
  

  const handleClickUser = () => {
    alert("Coming Soon");
    if (notification?.byUser) {
      // TODO: Navigate to User Profile
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
        onClick={handleClickUser}
        className="group-hover:border-primary notification-options size-14 cursor-pointer border-2 transition-colors hover:scale-105"
      >
        <AvatarImage src={profilePictureUrl} />
        <AvatarFallback className="group-hover:text-primary transition-colors">
          {avatarFallback}
        </AvatarFallback>
      </Avatar>

      <NotificationContent
        fromUserFullName={fromUserFullName}
        content={content}
        dateDisplay={dateDisplay}
        isRead={isRead}
        handleClickUser={handleClickUser}
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
