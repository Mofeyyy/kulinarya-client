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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

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
        prev.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
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
  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <DropdownMenu>
      {isLoggedIn || isAdmin ? (
        <DropdownMenuTrigger className="relative flex items-center gap-2 p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full hover:scale-105 transition-transform shadow-md">
          <div className="relative">
            <Bell className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </DropdownMenuTrigger>
      ) : null}

      <DropdownMenuContent className="w-80 bg-white p-4 rounded-lg shadow-xl text-black border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-lg text-gray-800">🔔 Notifications</p>
          {notifications.length > 0 && (
            <button
              onClick={handleReadAllNotifications}
              className="text-sm text-blue-600 hover:underline"
            >
              Mark All as Read
            </button>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto space-y-2">
          {loading ? (
            <p className="text-center text-gray-400">Loading notifications...</p>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <DropdownMenuItem
                key={notif._id}
                className={`flex flex-col p-3 rounded-lg transition duration-200 shadow-sm ${
                  notif.isRead ? "bg-gray-100" : "bg-orange-50"
                } hover:bg-orange-100`}
                onClick={() => {
                  if (!notif.isRead) handleReadNotification(notif._id); // Auto-mark as read
                  if (notif.fromPost) {
                    navigate(`/recipe/${notif.fromPost}`);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  {notif.byUser?.profilePictureUrl ? (
                    <img
                      src={notif.byUser.profilePictureUrl}
                      alt="Profile"
                      className="w-9 h-9 rounded-full border border-gray-300 shadow-sm"
                    />
                  ) : (
                    <User className="w-9 h-9 text-gray-400 bg-gray-200 rounded-full p-1" />
                  )}

                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-800">
                      {notif.byUser
                        ? `${notif.byUser.firstName} ${notif.byUser.lastName}`.trim()
                        : "Unknown User"}
                    </span>
                    <p className="text-xs text-gray-500">
                      {dayjs(notif.createdAt).fromNow()}
                    </p>
                  </div>

                  {!notif.isRead && (
                    <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent dropdown item click
                      handleReadNotification(notif._id);
                    }}
                    className="group cursor-pointer"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 group-hover:text-green-700 transition-colors duration-200" />
                  </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent dropdown item click
                      handleDeleteNotification(notif._id);
                    }}
                    className="group cursor-pointer"
                  >
                    <Trash className="w-5 h-5 text-red-500 group-hover:text-red-700 transition-colors duration-200" />
                  </button>
                                  </div>

                <p className="text-sm text-gray-700 mt-1">{notif.content}</p>

                {notif.fromPost && (
                  <span className="text-xs text-orange-600 hover:underline font-medium mt-1 inline-block">
                    View Post
                  </span>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <p className="text-center text-gray-400">No new notifications.</p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
