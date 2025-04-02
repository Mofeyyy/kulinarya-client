import { useEffect, useState } from "react";
import { useBlocker } from "react-router-dom";

const usePreventUnload = ({ condition, message = "" }) => {
  const [showDialog, setShowDialog] = useState(false);
  const blocker = useBlocker(condition);

  // Prevent browser refresh or tab closing
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (condition) {
        event.preventDefault();
        event.returnValue = message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [condition]);

  // Handle route navigation blocking
  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowDialog(true);
    }
  }, [blocker.state]);

  return { blocker, showDialog, setShowDialog };
};

export default usePreventUnload;
