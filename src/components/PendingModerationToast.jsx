// Imported Icons
import { TriangleAlert } from "lucide-react";

// -----------------------------------------------------------------------------

const PendingModerationToast = ({ pendingModerationCount, toastId, onViewClick }) => {
  return (
    <div
      className={`${
        toastId.visible ? "animate-in" : "animate-out"
      } ring-opacity-5 pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg`}
    >
      <div className="flex-1 p-4">
        <div className="flex items-center gap-5">
          <div className="shrink-0">
            <TriangleAlert className="text-primary size-8" />
          </div>

          <div className="flex-1">
            <p className="text-primary text-sm font-semibold">Pending Moderation</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {pendingModerationCount} recipe{pendingModerationCount > 1 && "s"} awaiting
              moderation.
            </p>
          </div>
        </div>
      </div>

      <div className="flex border-l border-gray-200">
        <button
          onClick={onViewClick}
          className="text-primary flex w-full cursor-pointer items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium transition-opacity hover:opacity-80"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default PendingModerationToast;
