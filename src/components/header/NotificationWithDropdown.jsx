import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/config/axios";
import { Bell, User, Trash, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "@/hooks/stores/useAuthStore";
import { Button } from "../ui/button";

// For Date Formatting Library
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// -------------------------------------------------------------------------

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, isAdmin } = useAuthStore(); // Added isAdmin to check if the user is an admin
  const navigate = useNavigate(); // Hook for navigation

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await API.get("/notifications");
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchNotifications();
  }, [isLoggedIn]);

  // Mark a notification as read
  const handleReadNotification = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((notif) => (notif._id === id ? { ...notif, isRead: true } : notif)),
      );
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  // Mark all notifications as read
  const handleReadAllNotifications = async () => {
    try {
      await API.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error("Error marking all notifications as read", error);
    }
  };

  // Delete a notification
  const handleDeleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  // Count unread notifications
  // const unreadCount = notifications.filter((notif) => !notif.isRead).length;
  const unreadCount = 1; // Dummy for testing

  return (
    <DropdownMenu>
      {isLoggedIn && (
        <DropdownMenuTrigger asChild>
          <Button className="relative rounded-full bg-gradient-to-r from-orange-500 to-orange-600 !p-2 text-white shadow-lg transition-transform hover:scale-110">
            <Bell className="size-5" />

            {/* Notification count */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-5 animate-bounce items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-lg">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
      )}

      <DropdownMenuContent className="w-80 rounded-lg border border-gray-200 bg-white p-4 text-black shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-lg font-semibold text-gray-800">🔔 Notifications</p>
          {notifications.length > 0 && (
            <button
              onClick={handleReadAllNotifications}
              className="text-sm text-blue-600 hover:underline"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {/* //! ------------------------- ON WORK -------------------------------- */}
        <div className="no-scrollbar max-h-72 space-y-2 overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-400">Loading notifications...</p>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <DropdownMenuItem
                key={notif._id}
                className={`flex flex-col rounded-lg p-3 shadow-sm transition duration-200 ${
                  notif.isRead ? "bg-gray-100" : "bg-orange-50"
                } hover:bg-orange-100`}
                onClick={async () => {
                  if (!notif.isRead) {
                    await handleReadNotification(notif._id); // Mark as read before navigating
                  }

                  // Navigate based on notification type
                  if (notif.type === "announcement") {
                    navigate(`/announcements/${notif.fromPost}`);
                  } else if (notif.type === "recipe") {
                    navigate(`/recipes/${notif.fromPost}`);
                  }
                }}
              >
                {/* //! First Section */}
                <div className="flex items-center gap-3">
                  {/* //! User Profile Picture */}
                  {notif.byUser?.profilePictureUrl ? (
                    <img
                      src={notif.byUser.profilePictureUrl}
                      alt="Profile"
                      className="h-9 w-9 rounded-full border border-gray-300 shadow-sm"
                    />
                  ) : (
                    <User className="h-9 w-9 rounded-full bg-gray-200 p-1 text-gray-400" />
                  )}
                  {/* //! User Name and Time */}
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-800">
                      {notif.byUser
                        ? `${notif.byUser.firstName} ${notif.byUser.lastName}`.trim()
                        : "Unknown User"}
                    </span>
                    <p className="text-xs text-gray-500">{dayjs(notif.createdAt).fromNow()}</p>
                  </div>

                  {/* //! Button to mark as read */}
                  {!notif.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent dropdown item click
                        handleReadNotification(notif._id);
                      }}
                      className="group cursor-pointer"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 transition-colors duration-200 group-hover:text-green-700" />
                    </button>
                  )}

                  {/* //! Button to delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent dropdown item click
                      handleDeleteNotification(notif._id);
                    }}
                    className="group cursor-pointer"
                  >
                    <Trash className="h-5 w-5 text-red-500 transition-colors duration-200 group-hover:text-red-700" />
                  </button>
                </div>

                {/* //! Second Section */}
                {/* //! Notification Content */}
                <p className="mt-1 text-sm text-gray-700">{notif.content}</p>

                {/* //! View Post Button */}
                {notif.fromPost && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation(); // Prevent dropdown from closing immediately

                      if (!notif.isRead) {
                        await handleReadNotification(notif._id); // Mark as read before navigating
                      }

                      // Check notification type
                      if (notif.type === "announcement") {
                        navigate(`/announcements/${notif.fromPost}`); // Redirect to announcement
                      } else {
                        navigate(`/recipes/${notif.fromPost}`); // Redirect to recipe
                      }
                    }}
                    className="mt-1 inline-block text-xs font-medium text-orange-600 hover:underline"
                  >
                    View Post
                  </button>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <p className="text-center text-gray-400">No new notifications.</p>
          )}
        </div>
      </DropdownMenuContent>
      {/* //! ------------------------- ON WORK -------------------------------- */}
    </DropdownMenu>
  );
};

export default NotificationDropdown;
