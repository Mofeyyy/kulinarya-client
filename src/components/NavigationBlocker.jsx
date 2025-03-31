import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// --------------------------------------------------------------------

const NavigationBlocker = ({ blocker, showDialog, setShowDialog, setHasUnsavedChanges }) => {
  if (blocker.state !== "blocked") return null;

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <p>You have unsaved changes. Are you sure you want to leave?</p>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setShowDialog(false);
              blocker.reset();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setHasUnsavedChanges(false);
              blocker.proceed();
            }}
          >
            Leave Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NavigationBlocker;
