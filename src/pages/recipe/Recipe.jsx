import { useEffect } from "react";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import usePageStore from "@/hooks/stores/usePageStore";
import RecipeFilters from "./components/RecipeFilters";
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore";
import useRecipes from "@/hooks/queries/useRecipes";
import CustomPagination from "@/components/pagination/CustomPagination";
import RecipesDisplay from "./components/RecipeDisplay";
import RecipeFeedSkeleton from "./components/RecipeFeedSkeleton";

//  ------------------------------------------------------------

const Recipe = () => {
  const { setPage, setSubPage } = usePageStore();
  const {
    search,
    origin,
    category,
    page,
    limit,
    sortOrder,
    setTotalRecipeCount,
    resetFilters,
  } = useRecipeFilterStore();

  useEffect(() => {
    document.title = "Recipes | Kulinarya";
    setPage({ href: "/recipes", name: "Recipes" });
    setSubPage({ href: "/recipes", name: "All Recipes" });
    resetFilters();
  }, []);

  const { data, isLoading } = useRecipes({
    origin,
    category,
    search,
    page,
    limit,
    sortOrder,
  });
  const recipes = data?.recipes;

  useEffect(() => {
    setTotalRecipeCount(data?.totalApprovedRecipes);
  }, [data]);

  return (
    <section className="w-full px-5 min-[400px]:px-10 min-[500px]:px-16 sm:px-12 md:px-16 lg:px-24 xl:px-40 py-20 flex flex-col gap-8">
      <CustomBreadCrumb />

      <RecipeFilters />

      {isLoading ? (
        <RecipeFeedSkeleton />
      ) : (
        <>
          <RecipesDisplay recipes={recipes} />

          {recipes?.length === 0 ? (
            <div className="h-52 flex justify-center items-center">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                No Recipes{" "}
                <span className="text-primary animate-pulse">Found</span>
              </p>
            </div>
          ) : (
            <CustomPagination />
          )}
        </>
      )}
    </section>
  );
};

export default Recipe;
