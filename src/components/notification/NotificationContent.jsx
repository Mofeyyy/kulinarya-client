// Imported Icons
import { Dot } from "lucide-react";

// For Date Formatting Library
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

//  ----------------------------------------------------------
const NotificationContent = ({ fromUserFullName, content, createdAt, isRead }) => {
  return (
    <div className="flex flex-col">
      {/* From User Name */}
      <div className="flex items-center">
        <p
          className="text-foreground hover:text-primary notification-options cursor-pointer text-sm font-semibold transition-colors"
          onClick={() => alert("Feature: User Profile")}
        >
          {fromUserFullName}
        </p>

        {!isRead && <Dot className="text-primary animate-pulse" />}
      </div>

      <p className="text-muted-foreground text-sm">{content}</p>
      <p className="text-primary text-xs">{dayjs(createdAt).fromNow()}</p>
    </div>
  );
};

export default NotificationContent;
