import { useState, useRef, useCallback, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import NotificationItem from "../notification/NotificationItem";
import NotificationTitleSection from "../notification/NotificationTitleSection";

import useAuthStore from "@/hooks/stores/useAuthStore";
import useFetchNotifications from "@/hooks/queries/useFetchNotifications";
import useUnreadNotificationsCount from "@/hooks/queries/useUnreadNotificationsCount";

// Announcement Modal Component
import AnnouncementFullView from "@/pages/home/AnnouncementModal/views/AnnouncementFullView";

const NotificationDropdown = () => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null); // ✅ NEW

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchNotifications(isLoggedIn);

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
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const isThereUnreadNotification = data?.pages?.some((page) =>
    page.notifications.some((notification) => !notification.isRead)
  );
  const hasPageAndNotificationsToLoad =
    data?.pages?.length > 0 && data?.pages[0]?.notifications.length > 0;

  const toggleIsNotificationModalOpen = () => {
    setIsNotificationModalOpen((prev) => !prev);
  };

  return (
    <>
      <Popover
        open={isNotificationModalOpen}
        onOpenChange={(open) => setIsNotificationModalOpen(open)}
      >
        {isLoggedIn && (
          <PopoverTrigger asChild>
            <Button className="relative rounded-full bg-gradient-to-r from-orange-500 to-orange-600 !p-2 text-white shadow-lg transition-transform hover:scale-110">
              <Bell className="size-5" />
              {isThereUnreadNotification && (
                <span className="absolute -top-1 -right-1 flex size-5 animate-bounce items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-lg">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
        )}

        <PopoverContent className="flex w-[90vw] max-w-md min-w-[300px] flex-col gap-3 rounded-lg">
          <NotificationTitleSection isThereUnreadNotification={isThereUnreadNotification} />
          <div className="no-scrollbar flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
            {hasPageAndNotificationsToLoad &&
              data.pages.map((page, pageIndex) => (
                <div key={pageIndex} className="flex flex-col gap-2">
                  {page.notifications.map((notification, notificationIndex) => {
                    const isLastReactionInCurrentPage =
                      pageIndex === data.pages.length - 1 &&
                      notificationIndex === page.notifications.length - 1;

                    const notificationItem = (
                      <NotificationItem
                        key={notification._id}
                        notification={notification}
                        toggleIsNotificationModalOpen={toggleIsNotificationModalOpen}
                        setSelectedAnnouncement={setSelectedAnnouncement} // ✅ Pass down
                      />
                    );

                    return isLastReactionInCurrentPage ? (
                      <div ref={lastNotificationRef} key={notification._id}>
                        {notificationItem}
                      </div>
                    ) : (
                      notificationItem
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
              {error && (
                <p className="text-destructive-foreground">Failed to load notifications</p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* ✅ Fullscreen Announcement Modal */}
      {selectedAnnouncement && (
        <AnnouncementFullView
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </>
  );
};

export default NotificationDropdown;
