import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const reactions = [
  { value: "heart", reaction: "❤️" },
  { value: "drool", reaction: "🤤" },
  { value: "neutral", reaction: "😐" },
];

// ----------------------------------------------------------------

const ReactionItem = ({ reaction }) => {
  return (
    <div>
      <div className="flex items-center gap-3 rounded-lg border p-2">
        {/* Profile Picture */}
        <Avatar
          onClick={() => alert("Coming Soon")}
          className="cursor-pointer transition-transform hover:scale-125"
        >
          <AvatarImage src={reaction.byUser.profilePictureUrl} />
          <AvatarFallback>
            {reaction.byUser.firstName[0]}
            {reaction.byUser.lastName[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <span
            onClick={() => alert("Coming Soon")}
            className="hover:text-primary cursor-pointer font-semibold transition-colors"
          >
            {reaction.byUser.firstName} {reaction.byUser.lastName}
          </span>
        </div>

        <span className="text-2xl">
          {reactions.find((r) => r.value === reaction.reaction)?.reaction}
        </span>
      </div>

      <span className="text-muted-foreground ml-2 text-xs">
        {dayjs(reaction.createdAt).fromNow()}
      </span>
    </div>
  );
};

export default ReactionItem;
