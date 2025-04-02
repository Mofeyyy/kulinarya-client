import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// Imported Custom Components
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import RecipeFilters from "./components/RecipeFilters";
import CustomPagination from "@/components/pagination/CustomPagination";
import RecipesDisplay from "./components/RecipeDisplay";
import RecipeFeedSkeleton from "./components/RecipeFeedSkeleton";
import NoRecipesFound from "./components/NoRecipesFound";

// Imported Custom Hooks
import usePageStore from "@/hooks/stores/usePageStore";
import useRecipes from "@/hooks/queries/useRecipes";
import useAuthStore from "@/hooks/stores/useAuthStore";

// Imported Components
import { Button } from "@/components/ui/button";

// Imported Icons
import { Plus } from "lucide-react";

//  ------------------------------------------------------------

const RecipeFeed = () => {
  const { setPage, setSubPage } = usePageStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userDetails = useAuthStore((state) => state.userDetails);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigateTo = useNavigate();

  // Filter values
  const filters = {
    origin: searchParams.get("origin") || "",
    category: searchParams.get("category") || "",
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

  const resetFilters = () => {
    setSearchParams({});
  };

  const { data, isLoading } = useRecipes(filters);
  const recipes = data?.recipes;

  useEffect(() => {
    console.log("Recipes Data:", recipes);
  }, [data]);

  useEffect(() => {
    document.title = "Recipes | Kulinarya";
    setPage({ href: "/recipes", name: "Recipes" });
    setSubPage({ href: "/recipes", name: "All Recipes" });
  }, []);

  return (
    <section className="flex w-full items-center justify-center py-20">
      <div className="flex w-full max-w-[80vw] flex-col gap-10 2xl:max-w-[70vw]">
        <CustomBreadCrumb />

        <div className="flex w-full flex-col gap-3 lg:flex-row">
          {isLoggedIn && userDetails && (
            <Button
              className="w-full self-start !pr-5 !pl-4 md:w-auto"
              onClick={() => navigateTo("/recipes/create")}
            >
              <Plus className="size-5" />
              Create
            </Button>
          )}

          {/* Filters Section */}
          <RecipeFilters
            filters={filters}
            updateFilters={updateFilters}
            resetFilters={resetFilters}
          />
        </div>

        {isLoading ? (
          <RecipeFeedSkeleton />
        ) : (
          <>
            <RecipesDisplay recipes={recipes} />

            {recipes?.length === 0 ? (
              <NoRecipesFound />
            ) : (
              // Pagination and Sorting
              <CustomPagination
                filters={filters}
                updateFilters={updateFilters}
                totalRecipeCount={data?.totalApprovedRecipes || 0}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default RecipeFeed;
