import ModalWrapper from "../ui/ModalWrapper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const AnnouncementFullView = ({ announcement, onClose }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <div className="max-w-2xl mx-auto p-6 bg-background  rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
          {announcement.title}
        </h2>

        <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line">
          {announcement.content}
        </p>

        <div className="mt-6 text-right">
          <span className="text-sm text-gray-500 dark:text-gray-400 italic">
            Posted {dayjs(announcement.createdAt).fromNow()}
          </span>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AnnouncementFullView;
