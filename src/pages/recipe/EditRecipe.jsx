import { useEffect } from "react";
import { useParams } from "react-router-dom";
import usePageStore from "@/hooks/stores/usePageStore";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import RecipeForm from "./components/RecipeForm";
import useRecipeStore from "@/hooks/stores/useRecipeStore";
import useFetchRecipe from "@/hooks/queries/useFetchRecipe";
import ScreenLoader from "@/components/ScreenLoader";

const EditRecipe = () => {
  const { recipeId } = useParams();
  const { setPage, setSubPage } = usePageStore();

  const { recipe, setRecipe, clearRecipe } = useRecipeStore();
  const { data: fetchedData, isLoading, error } = useFetchRecipe(recipeId);

  useEffect(() => {
    document.title = "Edit | Kulinarya";
    setPage({ href: "/recipes", name: "Recipes" });
    setSubPage({ href: `/recipes/${recipeId}/edit`, name: "Edit Recipe" });

    if (fetchedData?.recipe) {
      setRecipe(fetchedData.recipe);
    }

    return () => {
      console.log("Clearing recipe...");
      clearRecipe();
    };
  }, [recipeId, fetchedData?.recipe]);

  if (isLoading || !recipe) return <ScreenLoader />;
  // TODO: Create a custom error component for this things
  if (error) return <p>Error loading recipe</p>;

  return (
    <section className="w-full px-5 min-[400px]:px-10 min-[500px]:px-16 sm:px-12 md:px-16 lg:px-24 xl:px-40 py-20 flex flex-col gap-10">
      <CustomBreadCrumb />

      <p className="text-4xl font-bold">Edit Recipe</p>

      <RecipeForm />
    </section>
  );
};

export default EditRecipe;
