import usePreventUnload from "@/hooks/usePreventUnload";
import NavigationBlocker from "./NavigationBlocker";
import useUnsavedChangesStore from "@/hooks/stores/useUnsavedChangesStore";

// ----------------------------------------------------------------------

const GlobalNavigationBlocker = () => {
  const hasUnsavedChanges = useUnsavedChangesStore((state) => state.hasUnsavedChanges);
  const setHasUnsavedChanges = useUnsavedChangesStore((state) => state.setHasUnsavedChanges);
  const { blocker, showDialog, setShowDialog } = usePreventUnload({
    condition: hasUnsavedChanges,
    message: "You have unsaved changes. Are you sure you want to leave?",
  });

  return (
    <NavigationBlocker
      blocker={blocker}
      showDialog={showDialog}
      setShowDialog={setShowDialog}
      setHasUnsavedChanges={setHasUnsavedChanges}
    />
  );
};

export default GlobalNavigationBlocker;
