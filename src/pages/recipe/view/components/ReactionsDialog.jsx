import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useRef, useCallback } from "react";
import useFetchReactions from "@/hooks/queries/useFetchReactions";
import { Smile, Loader2 } from "lucide-react";
import useRecipeStore from "@/hooks/stores/useRecipeStore";
import ReactionItem from "./ReactionItem";

// ----------------------------------------------------------------

const ReactionsDialog = () => {
  const recipe = useRecipeStore((state) => state.recipe);
  const [open, setOpen] = useState(false);
  const { _id: recipeId } = recipe;

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchReactions(recipeId, open);

  const observer = useRef();

  const lastReactorRef = useCallback(
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

  const hasPageAndReactionsToLoad = data?.pages?.length > 0 && data?.pages[0]?.reactions.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hover:text-primary flex cursor-pointer items-center gap-2 border-l px-4 py-2 text-sm transition-colors">
          <Smile className="size-5" />
          <p>
            View <span className="hidden sm:inline">Reactions</span>
          </p>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg px-2 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold">Reactions</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        <div className="flex max-h-[40vh] flex-col gap-5 overflow-y-auto p-2">
          {hasPageAndReactionsToLoad &&
            data.pages.map((page, pageIndex) => (
              <div key={pageIndex} className="flex flex-col gap-4">
                {page.reactions.map((reaction, index) => {
                  const isLastReactorInCurrentPage =
                    pageIndex === data.pages.length - 1 && index === page.reactions.length - 1;

                  if (isLastReactorInCurrentPage) {
                    return (
                      <div ref={lastReactorRef} key={reaction._id}>
                        <ReactionItem reaction={reaction} />
                      </div>
                    );
                  }

                  return <ReactionItem key={reaction._id} reaction={reaction} />;
                })}
              </div>
            ))}

          <div className="flex items-center justify-center">
            {!hasPageAndReactionsToLoad ? (
              <p className="text-center text-sm">No reactions yet</p>
            ) : hasNextPage || isFetchingNextPage || isLoading ? (
              <Loader2 className="text-primary size-8 animate-spin" />
            ) : (
              <p className="text-sm">No more reactions to load</p>
            )}

            {error && <p className="text-destructive-foreground">Failed to load reactions</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReactionsDialog;
