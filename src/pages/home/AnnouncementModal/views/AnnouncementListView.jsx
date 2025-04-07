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
      <div className="flex items-center mb-6 px-4 py-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mr-4">
          📢 Announcements
        </h2>
        {canCreate && (
          <button
            onClick={onCreateClick}
            className="bg-orange-500 text-white text-xs sm:text-sm px-3 py-1 rounded-md hover:bg-orange-600 transition-all focus:outline-none ml-5"
          >
            + Create
          </button>
        )}
      </div>

      <div className="space-y-4 max-h-72 overflow-y-auto p-4 bg-background rounded-lg">
        {announcements.length > 0 ? (
          announcements.map((announcement) => {
            // Format the time using dayjs
            const relativeTime = dayjs(announcement.createdAt).fromNow(); // Format relative time (e.g., "1 minute ago")

            return (
              <div
                key={announcement._id}
                className="p-6 bg-background border-b border-white rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition-shadow"
                onClick={() => onItemClick(announcement)}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">{announcement.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{announcement.content}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-3 block">
                  {relativeTime}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 dark:text-gray-300 text-center">No announcements available.</p>
        )}
      </div>
    </ModalWrapper>
  );
};

export default AnnouncementListView;
