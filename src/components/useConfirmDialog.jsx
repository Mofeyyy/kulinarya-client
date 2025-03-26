import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState({ title: "", description: "" });
  const [resolveCallback, setResolveCallback] = useState(null);

  const openDialog = (title, description) => {
    return new Promise((resolve) => {
      setContent({ title, description });
      setResolveCallback(() => resolve);
      setIsOpen(true);
    });
  };

  const handleClose = (result) => {
    setIsOpen(false);
    if (resolveCallback) resolveCallback(result);
  };

  return {
    openDialog,
    ConfirmDialog: (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{content.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {content.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="text-destructive-foreground"
              onClick={() => handleClose(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleClose(true)}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
  };
};

export default useConfirmDialog;
