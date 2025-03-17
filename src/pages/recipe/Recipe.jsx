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
    <section className="w-full p-5 min-[400px]:p-10 min-[500px]:p-16 sm:p-12 md:p-16 lg:px-24 lg:py-20 xl:px-40 xl:py-20 flex flex-col gap-8">
      <CustomBreadCrumb />

      <RecipeFilters />

      {isLoading ? (
        <RecipeFeedSkeleton />
      ) : (
        <>
          <RecipesDisplay recipes={recipes} />
          <CustomPagination />
        </>
      )}
    </section>
  );
};

export default Recipe;
