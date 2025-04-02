import CommentItem from "./CommentItem";

// ----------------------------------------------------------------

const Comments = ({ comments }) => {
  return (
    <div className="flex flex-col gap-6">
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} />
      ))}
    </div>
  );
};

export default Comments;
