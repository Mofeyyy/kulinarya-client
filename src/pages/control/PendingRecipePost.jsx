// Imported Libraries
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

// Imported Icons
import { Eye, CircleCheck, CircleX } from "lucide-react";

// Imported Custom Components
import SearchInput from "@/pages/recipe/components/SearchInput";
import CustomPagination from "@/components/pagination/CustomPagination";
import TableWebView from "./components/TableWebView";
import TableMobileView from "./components/TableMobileView";

// Imported Stores
import usePageStore from "@/hooks/stores/usePageStore";

// Imported Queries
import usePendingRecipes from "@/hooks/queries/usePendingRecipes";

// Config
const MAX_CHAR_LENGTH = 20;

// ----------------------------------------------------------------------------------
const PendingRecipes = () => {
  const setPage = usePageStore((state) => state.setPage);
  const setSubPage = usePageStore((state) => state.setSubPage);
  const [searchParams, setSearchParams] = useSearchParams();

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
          variant: "default",
          size: "sm",
          Icon: Eye,
          onClick: () => {},
        },
        {
          label: "Approve",
          variant: "outline",
          size: "default",
          Icon: CircleCheck,
          onClick: () => {},
        },
        {
          label: "Reject",
          variant: "outline",
          size: "default",
          Icon: CircleX,
          onClick: () => {},
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
    </div>
  );
};

// --------------------------------- Custom Components ----------------------------------

export default PendingRecipes;
