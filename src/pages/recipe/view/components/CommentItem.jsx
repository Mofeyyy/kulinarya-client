import { useState } from "react";
import useConfirmDialog from "@/components/useConfirmDialog";
import { Pencil, Trash2 } from "lucide-react";
import useAuthStore from "@/hooks/stores/useAuthStore";
import CommentOptions from "./CommentOptions";
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

  // ----------------------------------------------------------------

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

  const menuItems = [
    { icon: Pencil, label: "Edit", action: handleEdit },
    { icon: Trash2, label: "Delete", action: handleDelete },
  ];

  return (
    <div className="flex w-full max-w-xl gap-3">
      {/* Profile Picture */}
      <Avatar
        onClick={() => alert("Coming Soon")}
        className="hover:border-primary hover:text-primary mt-1 size-12 cursor-pointer border-2 shadow-sm transition-colors"
      >
        <AvatarImage src={comment.byUser.profilePictureUrl} />
        <AvatarFallback>
          {comment.byUser.firstName[0]}
          {comment.byUser.lastName[0]}
        </AvatarFallback>
      </Avatar>

      {/* Comment Content */}
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <CommentTextArea
            type="edit"
            value={editedComment}
            onChange={setEditedComment}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            className="w-full"
          />
        ) : (
          <>
            <div className="flex w-full flex-col rounded-lg border-2 p-2 pl-4 shadow-sm">
              <span
                onClick={() => alert("Coming Soon")}
                className="hover:text-primary max-w-fit cursor-pointer font-semibold transition-colors"
              >
                {comment.byUser.firstName} {comment.byUser.lastName}
              </span>

              <span className="text-muted-foreground text-justify text-sm break-words">
                {comment.content}
              </span>
            </div>

            <span className="text-muted-foreground ml-4 text-[12px]">
              {dayjs(comment.createdAt).fromNow()}
            </span>
          </>
        )}
      </div>

      <div className="flex flex-col justify-center pb-5">
        {/* Options Menu (Only for comment owner) */}
        {isLoggedIn && comment.byUser._id === userDetails?._id && !isEditing && (
          <CommentOptions
            isOptionOpen={isOptionOpen}
            setIsOptionOpen={setIsOptionOpen}
            menuItems={menuItems}
          />
        )}
      </div>

      {ConfirmDialog}
    </div>
  );
};

export default CommentItem;
