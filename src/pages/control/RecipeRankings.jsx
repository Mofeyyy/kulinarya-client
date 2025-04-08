// Imported Libraries
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import toast from "react-hot-toast";

// Imported Icons
import { Eye, Sparkle } from "lucide-react";

// Imported Custom Components
import SearchInput from "@/pages/recipe/components/SearchInput";
import CustomPagination from "@/components/pagination/CustomPagination";
import TableWebView from "./components/TableWebView";
import TableMobileView from "./components/TableMobileView";
import useConfirmDialogs from "@/components/useConfirmDialog";

// Imported Stores
import usePageStore from "@/hooks/stores/usePageStore";

// Imported Queries
import useRecipes from "@/hooks/queries/useRecipes";

// Imported Mutations
import useToggleFeature from "@/hooks/mutations/useToggleFeature";

// Config
const MAX_CHAR_LENGTH = 20;

// ----------------------------------------------------------------------

const RecipeRankings = () => {
  const setPage = usePageStore((state) => state.setPage);
  const setSubPage = usePageStore((state) => state.setSubPage);
  const [searchParams, setSearchParams] = useSearchParams();
  const { openDialog, ConfirmDialog } = useConfirmDialogs();
  const navigateTo = useNavigate();

  // Filter values
  const filters = {
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 10,
    sortOrder: searchParams.get("sortOrder") || "newest",
    forRankingRecipes: true,
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

  const { data, isLoading } = useRecipes(filters);
  const recipes = data?.recipes;

  // Table Head and Table Rows Declaration For Reusable Table
  const tableHead = [
    "Recipe Title",
    "Author",
    "Total ❤️",
    "Total 🤤",
    "Total 😐",
    "Total Views",
    "Total Comments",
    "Total Engagement",
  ];
  const tableRows = recipes?.map((recipe) => {
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
        {
          key: "totalHeart",
          value: recipe.heartCount,
          className: "text-center",
        },
        {
          key: "totalDrool",
          value: recipe.droolCount,
          className: "text-center",
        },
        {
          key: "totalNeutral",
          value: recipe.neutralCount,
          className: "text-center",
        },
        {
          key: "totalViews",
          value: recipe.totalViews,
          className: "text-center",
        },
        {
          key: "totalComments",
          value: recipe.totalComments,
          className: "text-center",
        },
        {
          key: "totalEngagement",
          value: recipe.totalEngagement,
          className: "text-center",
        },
      ],

      actions: [
        {
          label: "View",
          variant: "default",
          size: "sm",
          Icon: Eye,
          onClick: () => navigateTo(`/recipes/${recipe._id}`),
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
    console.log("Recipes Rankings Fetched:", recipes);
  }, [data]);

  // For Breadcrumbs
  useEffect(() => {
    document.title = "Recipe Rankings | Kulinarya";
    setPage({ href: "/control/dashboard", name: "Control" });
    setSubPage({ href: "/control/ranked-recipes", name: "Recipe Rankings" });
  }, []);

  return (
    <div className="flex w-full max-w-[90%] flex-col gap-5">
      {/* Search Input */}
      <div className="flex w-full items-center justify-end">
        <SearchInput
          value={filters.search}
          onChange={(val) => updateFilters("search", val)}
          className="sm:w-[100vw] sm:max-w-sm"
        />
      </div>

      {/* Web Table View */}
      <TableWebView
        tableHead={tableHead}
        tableRows={tableRows}
        isLoading={isLoading}
        columnWidth="w-1/12"
      />

      {/* Mobile Table View */}
      <TableMobileView tableHead={tableHead} tableRows={tableRows} isLoading={isLoading} />

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

      {ConfirmDialog}
    </div>
  );
};

export default RecipeRankings;
