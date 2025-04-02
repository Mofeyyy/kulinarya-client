import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useRef, useCallback } from "react";
import { MessageCircleMore, Loader2 } from "lucide-react";
import useRecipeStore from "@/hooks/stores/useRecipeStore";
import useFetchComments from "@/hooks/queries/useFetchComments";
import CommentItem from "./CommentItem";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// ----------------------------------------------------------------

const CommentsDialog = () => {
  const recipe = useRecipeStore((state) => state.recipe);
  const [open, setOpen] = useState(false);
  const { _id: recipeId } = recipe;

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchComments(recipeId, open);

  const observer = useRef();

  const lastCommentRef = useCallback(
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
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  const hasPageAndCommentsToLoad = data?.pages?.length > 0 && data?.pages[0]?.comments.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hover:text-primary flex cursor-pointer items-center gap-2 border-l px-4 py-2 text-sm transition-colors">
          <MessageCircleMore className="size-5" />
          <p>
            View <span className="hidden sm:inline">Comments</span>
          </p>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg px-2 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold">Comments</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        <div className="flex max-h-[40vh] flex-col gap-5 overflow-y-auto p-2">
          {hasPageAndCommentsToLoad &&
            data.pages.map((page, pageIndex) => (
              <div key={pageIndex} className="flex flex-col gap-5">
                {page.comments.map((comment, index) => {
                  if (pageIndex === data.pages.length - 1 && index === page.comments.length - 1) {
                    return (
                      <div ref={lastCommentRef} key={comment._id}>
                        <CommentItem comment={comment} />
                      </div>
                    );
                  }

                  return <CommentItem key={comment._id} comment={comment} />;
                })}
              </div>
            ))}

          <div className="flex items-center justify-center">
            {!hasPageAndCommentsToLoad ? (
              <p>No comments yet</p>
            ) : hasNextPage || isFetchingNextPage || isLoading ? (
              <Loader2 className="text-primary size-8 animate-spin" />
            ) : (
              <p className="text-sm">No more comments to load</p>
            )}

            {error && (
              <p className="text-destructive-foreground font-bold">Failed to load comments</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsDialog;
