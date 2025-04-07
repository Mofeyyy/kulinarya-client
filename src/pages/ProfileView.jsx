// Imported  Libraries
import { useEffect } from "react";
import { useSearchParams, useParams, Link } from "react-router-dom";

// Imported Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Imported Stores
import usePageStore from "@/hooks/stores/usePageStore";

// Imported Custom Components
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import NotFoundPage from "./NotFoundPage";
import RecipeFilters from "./recipe/components/RecipeFilters";
import RecipesDisplay from "./recipe/components/RecipeDisplay";
import NoRecipesFound from "./recipe/components/NoRecipesFound";
import CustomPagination from "@/components/pagination/CustomPagination";
import ScreenLoader from "@/components/ScreenLoader";

// Imported Queries
import useRecipes from "@/hooks/queries/useRecipes";
import useFetchUserData from "@/hooks/queries/useFetchUserData";

// Imported Icons
import { SquarePen } from "lucide-react";

// ----------------------------------------------------------------

const ProfilePage = () => {
  const { userId } = useParams();
  const setPage = usePageStore((state) => state.setPage);
  const setSubPage = usePageStore((state) => state.setSubPage);
  const [searchParams, setSearchParams] = useSearchParams();

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
    if (value) newParams.set(key, value);
    else newParams.delete(key);

    if (searchParams.toString() !== newParams.toString()) {
      setSearchParams(newParams);
    }
  };

  const resetFilters = () => setSearchParams({});

  const { data: user, isLoading: userLoading, error: userError } = useFetchUserData(userId);
  const {
    data: recipesData,
    isLoading: recipeLoading,
    error: recipeError,
  } = useRecipes({ ...filters, userId });

  const recipes = recipesData?.recipes || [];
  const error = userError || recipeError;
  const isLoading = userLoading || recipeLoading;

  // Debug logs
  useEffect(() => {
    console.log("User Data:", user);
    console.log("Recipes Data:", recipes);
  }, [user, recipes]);

  // Page Titles & Breadcrumb
  useEffect(() => {
    document.title = "Profile | Kulinarya";
    setPage({ href: "/profile", name: "Profile" });

    if (user) {
      setSubPage({ href: "/profile", name: `${user.firstName} ${user.lastName}` });
    }
  }, [user, setPage, setSubPage]);

  // Early return on error or no userId
  if (!userId || error) return <NotFoundPage />;
  if (isLoading || !user || !recipesData) return <ScreenLoader />;

  return (
    <section className="flex w-full items-center justify-center py-20">
      <div className="flex w-full max-w-[80vw] flex-col gap-10 2xl:max-w-[70vw]">
        <CustomBreadCrumb />

        {/* User Details */}
        <div className="flex w-full flex-col items-center justify-center gap-2 sm:flex-row sm:gap-5">
          {/* Avatar */}
          <Avatar className="border-primary size-40 border-4">
            <AvatarImage src={user.profilePictureUrl} />
            <AvatarFallback className="text-2xl font-semibold capitalize">
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex w-full min-w-0 flex-col items-center justify-center sm:items-start">
            <div className="flex w-full min-w-0 items-center justify-center sm:justify-start lg:gap-2">
              <p className="w-full text-[clamp(20px,3vw,36px)] font-semibold break-words capitalize">
                {user.firstName} {user.middleName} {user.lastName}
              </p>

              <Link to={`/profile/edit`}>
                <Button
                  variant="ghost"
                  className="hover:bg-background hover:text-primary flex items-center justify-center transition-colors"
                >
                  <SquarePen className="size-5 lg:size-8" />
                </Button>
              </Link>
            </div>

            <p className="text-muted-foreground w-full text-justify text-sm break-words whitespace-normal">
              {user.bio || "No bio yet"}
            </p>
          </div>
        </div>

        <hr />

        {/* Recipes */}
        <div className="flex flex-col gap-10">
          <p className="text-center text-[clamp(18px,2.5vw,30px)] font-bold sm:text-left">
            <span className="text-primary">Recipes</span> Posted
          </p>

          <RecipeFilters
            filters={filters}
            updateFilters={updateFilters}
            resetFilters={resetFilters}
          />

          <RecipesDisplay recipes={recipes} />

          {recipes.length === 0 ? (
            <NoRecipesFound />
          ) : (
            <CustomPagination
              filters={filters}
              updateFilters={updateFilters}
              totalCount={recipesData.totalApprovedRecipes}
              totalPages={recipesData.pagination.totalPages}
              hasNextPage={recipesData.pagination.hasNextPage}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
