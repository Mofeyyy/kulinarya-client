// Imported Libraries
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import toast from "react-hot-toast";

// Imported Icons
import { Eye, CircleCheck, CircleX } from "lucide-react";

// Imported Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";

// Imported Custom Components
import SearchInput from "@/pages/recipe/components/SearchInput";
import CustomPagination from "@/components/pagination/CustomPagination";
import TableWebView from "./components/TableWebView";
import TableMobileView from "./components/TableMobileView";
import ImageWithFallback from "@/components/ImageWithFallback";

// Imported Stores
import usePageStore from "@/hooks/stores/usePageStore";

// Imported Queries
import usePendingRecipes from "@/hooks/queries/usePendingRecipes";

// Imported Mutations
import useModerateMutation from "@/hooks/mutations/useModerateMutation";

// Config
const MAX_CHAR_LENGTH = 20;

// ----------------------------------------------------------------------------------
const PendingRecipes = () => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const setPage = usePageStore((state) => state.setPage);
  const setSubPage = usePageStore((state) => state.setSubPage);
  const [searchParams, setSearchParams] = useSearchParams();
  const { openDialog, ModerationDialog } = useModerationDialog();

  // State Function Handlers
  const handleToggleViewDialog = (boolean) => setIsViewDialogOpen(boolean);
  const handleSelectedRecipe = (recipe) => setSelectedRecipe(recipe);

  // Filter values
  const filters = {
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 10,
    sortOrder: searchParams.get("sortOrder") || "newest",
  };

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    if (searchParams.toString() !== newParams.toString()) {
      setSearchParams(newParams);
    }
  };

  const { data, isLoading } = usePendingRecipes(filters);
  const pendingRecipes = data?.pendingRecipesData;

  const { mutateAsync: moderateRecipe, isPending: isModerating } = useModerateMutation(filters);

  // Functions
  const handleModerateRecipe = async (moderationId, decision) => {
    const { confirmed, message } = await openDialog(
      `${decision === "approved" ? "Approve" : "Reject"} Recipe`,
      `Are you sure you want to ${decision === "approved" ? "approve" : "reject"} this recipe?`,
    );

    if (!confirmed) return;

    try {
      await toast.promise(
        moderateRecipe(moderationId, { status: decision, notes: message || "" }),
        {
          loading: `${decision === "approved" ? "Approving" : "Rejecting"} recipe...`,
          success: `${decision === "approved" ? "Approved" : "Rejected"} recipe successfully!`,
        },
        {
          duration: 5000,
        },
      );
    } catch (error) {
      console.log(
        `Error ${decision === "approved" ? "approving" : "rejecting"} recipe:`,
        error.message,
      );
      toast.error(`${error.message}`, {
        duration: 5000,
      });
    }
  };

  // Table Head and Table Rows Declaration For Reusable Table
  const tableHead = ["Recipe Title", "Author", "Status", "Created At"];
  const tableRows = pendingRecipes?.map((recipe) => {
    return {
      key: recipe._id,
      data: [
        {
          key: "recipeTitle",
          value:
            recipe.title.length > MAX_CHAR_LENGTH
              ? `${recipe.title.slice(0, MAX_CHAR_LENGTH)}...`
              : recipe.title,
        },
        {
          key: "ownerName",
          value: `${recipe.byUser?.firstName} ${recipe.byUser?.lastName}`,
          avatarUrl: recipe.byUser?.profilePictureUrl,
          avatarFallback: `${recipe.byUser?.firstName[0]}`,
        },
        { key: "status", value: recipe.moderationInfo?.status, className: "text-center" },
        {
          key: "createdAt",
          value: dayjs(recipe.createdAt).format("MMM DD, YYYY"),
          className: "text-center",
        },
      ],

      actions: [
        {
          label: "View",
          variant: "outline",
          size: "sm",
          Icon: Eye,
          onClick: () => {
            handleSelectedRecipe(recipe);
            handleToggleViewDialog(true);
          },
        },
        {
          label: "Approve",
          variant: "default",
          size: "sm",
          Icon: CircleCheck,
          onClick: async () => handleModerateRecipe(recipe.moderationInfo?._id, "approved"),
        },
        {
          label: "Reject",
          variant: "destructive",
          size: "sm",
          Icon: CircleX,
          onClick: () => handleModerateRecipe(recipe.moderationInfo?._id, "rejected"),
        },
      ],
    };
  });

  // If there is actions in tableRows add Actions on Head
  if (tableRows?.some((row) => row.actions)) {
    tableHead.push("Actions");
  }

  // For Debugging
  useEffect(() => {
    console.log("Pending Recipes:", pendingRecipes);
  }, [data]);

  // For Breadcrumbs
  useEffect(() => {
    document.title = "Pending Recipes | Kulinarya";
    setPage({ href: "/control/dashboard", name: "Control" });
    setSubPage({ href: "/control/pending-recipes", name: "Pending Recipes" });
  }, []);

  return (
    <div className="flex w-full max-w-[90%] flex-col gap-5">
      {/* Search Input */}
      <div className="flex w-full items-center justify-end">
        <SearchInput value={filters.search} onChange={(val) => updateFilters("search", val)} />
      </div>

      {/* Web Table View */}
      <TableWebView
        tableHead={tableHead}
        tableRows={tableRows}
        isLoading={isLoading}
        columnWidth="w-1/5"
        hasPendingMutation={isModerating}
      />

      {/* Mobile Table View */}
      <TableMobileView
        tableHead={tableHead}
        tableRows={tableRows}
        isLoading={isLoading}
        hasPendingMutation={isModerating}
      />

      {/* Pagination */}
      {!isLoading && (
        <CustomPagination
          filters={filters}
          updateFilters={updateFilters}
          totalCount={data?.totalPendingRecipes || 0}
          totalPages={data?.pagination?.totalPages || 0}
          hasNextPage={data?.pagination?.hasNextPage || false}
        />
      )}

      <ViewPendingRecipeDialog
        isViewDialogOpen={isViewDialogOpen}
        handleToggleViewDialog={handleToggleViewDialog}
        recipe={selectedRecipe}
        handleSelectedRecipe={handleSelectedRecipe}
      />

      {ModerationDialog}
    </div>
  );
};

// --------------------------------- Custom Components ----------------------------------

const ViewPendingRecipeDialog = ({
  isViewDialogOpen,
  handleToggleViewDialog,
  recipe,
  handleSelectedRecipe,
}) => {
  console.log("Selected Pending Recipe To View:", recipe);

  return (
    <Dialog
      open={isViewDialogOpen}
      onOpenChange={(open) => {
        handleToggleViewDialog(open);
        if (!open) handleSelectedRecipe(null);
      }}
    >
      <DialogContent className="flex max-h-[80%] flex-col gap-0 overflow-hidden">
        <DialogHeader className="shrink-0 border-b pb-4">
          <DialogTitle className="text-primary">View Pending Recipe</DialogTitle>
          <DialogDescription>Review Pending Recipe Before Approval</DialogDescription>
        </DialogHeader>

        {/* Contents */}
        <div className="flex flex-1 flex-col overflow-y-auto pr-2">
          {/* Recipe Details */}
          <div className="flex flex-col gap-5 border-b py-4 text-sm">
            <p>
              <span className="font-semibold">Title:</span> {recipe?.title}
            </p>
            <p>
              <span className="font-semibold">Origin Province:</span> {recipe?.originProvince}
            </p>
            <p>
              <span className="font-semibold">Category:</span> {recipe?.foodCategory}
            </p>
            <p>
              <span className="font-semibold">Description:</span>{" "}
              {recipe?.description || "No description provided"}
            </p>
          </div>

          {/* Main Recipe */}
          <div className="flex flex-col gap-5 border-b py-4 text-sm">
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold">Ingredients</h2>
              <ul className="list-inside list-disc">
                {recipe?.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.quantity} {ingredient.unit} - {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-semibold">Procedure</h2>
              <ol className="list-inside list-decimal">
                {recipe?.procedure.map((step, index) => (
                  <li key={index}>{step.content}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Recipe Media */}
          <div className="flex flex-col gap-5 border-b py-4 text-sm">
            {recipe?.mainPictureUrl && (
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Main Picture:</span>
                <ImageWithFallback
                  src={recipe?.mainPictureUrl}
                  alt="Main"
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {recipe?.videoUrl && (
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Video:</span>
                <video controls className="w-full rounded-lg shadow-sm" preload="none">
                  <source src={recipe?.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {recipe?.additionalPicturesUrls.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Additional Pictures:</span>
                <div className="grid grid-cols-3 gap-2">
                  {recipe?.additionalPicturesUrls.map((url, index) => (
                    <ImageWithFallback
                      key={index}
                      src={url}
                      alt={`Additional ${index + 1}`}
                      className="w-full rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const useModerationDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState({ title: "", description: "" });
  const [message, setMessage] = useState("");
  const [resolveCallback, setResolveCallback] = useState(null);

  const openDialog = (title, description) => {
    return new Promise((resolve) => {
      setContent({ title, description });
      setMessage("");
      setResolveCallback(() => resolve);
      setIsOpen(true);
    });
  };

  const handleClose = (confirmed) => {
    setIsOpen(false);
    if (resolveCallback) {
      resolveCallback({ confirmed, message });
    }
  };

  const ModerationDialog = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary">{content.title}</AlertDialogTitle>
          <AlertDialogDescription>{content.description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-2 flex flex-col gap-2">
          <label className="text-sm font-medium">Note</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add your note or reason here..."
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            className="text-destructive-foreground"
            onClick={() => handleClose(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleClose(true)}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    openDialog,
    ModerationDialog,
  };
};

export default PendingRecipes;
