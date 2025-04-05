import ModalWrapper from "../ui/ModalWrapper";
import dayjs from "dayjs"; // Import dayjs
import relativeTime from "dayjs/plugin/relativeTime"; // Import relativeTime plugin for distance formatting

dayjs.extend(relativeTime);

const AnnouncementFullView = ({ announcement, onClose }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{announcement.title}</h2>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{announcement.content}</p>

      <span className="mt-4 block text-xs text-gray-500">
        {/* Display relative time or formatted full date */}
        {dayjs(announcement.createdAt).fromNow()} {/* For relative time like "5 days ago" */}
        {/* OR */}
        {/* {dayjs(announcement.createdAt).format("MMMM DD, YYYY")} */}
        {/* For full date like "January 01, 2025" */}
      </span>
    </ModalWrapper>
  );
};

export default AnnouncementFullView;
