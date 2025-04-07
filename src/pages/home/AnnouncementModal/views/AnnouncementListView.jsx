import ModalWrapper from "../ui/ModalWrapper";
import dayjs from "dayjs"; 
import relativeTime from "dayjs/plugin/relativeTime"; 

dayjs.extend(relativeTime);


const AnnouncementListView = ({
  announcements,
  canCreate,
  onClose,
  onCreateClick,
  onItemClick,
}) => {
  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">📢 Announcements</h2>
        {canCreate && (
          <button
            onClick={onCreateClick}
            className="bg-orange-500 text-white text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-orange-600 transition-all"
          >
            + Create
          </button>
        )}
      </div>

      {announcements.length > 0 ? (
        <div className="space-y-4 max-h-60 overflow-y-auto">
          {announcements.map((announcement) => {
            // Format the time using dayjs
            const relativeTime = dayjs(announcement.createdAt).fromNow(); // Format relative time (e.g., "1 minute ago")

            return (
              <div
                key={announcement._id}
                className="p-3 border-b border-gray-300 dark:border-gray-600 cursor-pointer"
                onClick={() => onItemClick(announcement)}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">{announcement.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{announcement.content}</p>
                <span className="text-xs text-gray-500">
                  {/* Display relative time */}
                  {relativeTime} 
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-300">No announcements available.</p>
      )}
    </ModalWrapper>
  );
};

export default AnnouncementListView;
