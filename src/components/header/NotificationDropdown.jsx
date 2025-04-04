// Imported Libraries
import { useState, useRef, useCallback, useEffect } from "react";

// Imported Icons
import { Bell, Loader2 } from "lucide-react";

// Imported Components
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Imported Custom Components
import NotificationItem from "../notification/NotificationItem";
import NotificationTitleSection from "../notification/NotificationTitleSection";

// Improted Stores
import useAuthStore from "@/hooks/stores/useAuthStore";

// Imported Queries and Mutations
import useFetchNotifications from "@/hooks/queries/useFetchNotifications";
import useUnreadNotificationsCount from "@/hooks/queries/useUnreadNotificationsCount";

//  ----------------------------------------------------------

const NotificationDropdown = () => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
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

  // Functions
  const toggleIsNotificationModalOpen = () => {
    setIsNotificationModalOpen((prev) => !prev);
  };

  return (
    <Popover
      open={isNotificationModalOpen}
      onOpenChange={(open) => setIsNotificationModalOpen(open)}
    >
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
                        <NotificationItem
                          notification={notification}
                          toggleIsNotificationModalOpen={toggleIsNotificationModalOpen}
                        />
                      </div>
                    );
                  }

                  return (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                      toggleIsNotificationModalOpen={toggleIsNotificationModalOpen}
                    />
                  );
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

export default NotificationDropdown;
