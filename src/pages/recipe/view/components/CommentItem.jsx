import { useState } from "react";
import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/components/useConfirmDialog";
import { MoreVertical } from "lucide-react";
import useAuthStore from "@/hooks/stores/useAuthStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CommentTextArea from "./CommentTextArea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useCommentMutations from "@/hooks/mutations/useCommentMutations";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const CommentItem = ({ comment }) => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);
  const userDetails = useAuthStore((state) => state.userDetails);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { updateCommentMutation, deleteCommentMutation } = useCommentMutations(comment.fromPost);
  const { openDialog, ConfirmDialog } = useConfirmDialog();

  const handleEdit = () => {
    setIsEditing(true);
    setIsOptionOpen(false);
  };

  const handleSave = () => {
    if (editedComment.trim() && editedComment !== comment.content) {
      updateCommentMutation.mutate({
        commentId: comment._id,
        content: editedComment,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const isConfirmed = await openDialog("Are you sure you want to delete this comment?");
    if (isConfirmed) {
      deleteCommentMutation.mutate(comment._id);
    }
  };

  return (
    <div className="flex w-full max-w-xl items-start gap-3">
      {/* Profile Picture */}
      <Avatar
        onClick={() => alert("Coming Soon")}
        className="mt-2 size-10 cursor-pointer transition-transform hover:scale-125"
      >
        <AvatarImage src={comment.byUser.profilePictureUrl} />
        <AvatarFallback>
          {comment.byUser.firstName[0]}
          {comment.byUser.lastName[0]}
        </AvatarFallback>
      </Avatar>

      {/* Comment Content */}
      <div className="flex-1">
        {isEditing ? (
          <CommentTextArea
            type="edit"
            value={editedComment}
            onChange={setEditedComment}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="rounded-lg border p-2 pl-4">
              <span
                onClick={() => alert("Coming Soon")}
                className="hover:text-primary cursor-pointer font-semibold transition-colors"
              >
                {comment.byUser.firstName} {comment.byUser.lastName}
              </span>

              <p className="text-muted-foreground text-sm">{comment.content}</p>
            </div>
            <span className="text-muted-foreground ml-4 text-[12px]">
              {dayjs(comment.createdAt).fromNow()}
            </span>
          </>
        )}
      </div>

      {/* Options Menu (Only for comment owner) */}
      {isLoggedIn && comment.byUser._id === userDetails?._id && !isEditing && (
        <Popover open={isOptionOpen} onOpenChange={setIsOptionOpen}>
          <PopoverTrigger asChild>
            <button className="hover:text-primary mt-5 cursor-pointer transition-colors">
              <MoreVertical className="size-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-28 overflow-hidden p-0">
            <Button
              variant="ghost"
              className="w-full justify-center rounded-none"
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              className="text-destructive-foreground w-full justify-center rounded-none"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </PopoverContent>
        </Popover>
      )}
      {ConfirmDialog}
    </div>
  );
};

export default CommentItem;
