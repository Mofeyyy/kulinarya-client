import { useEffect } from "react";
import { useParams } from "react-router-dom";
import usePageStore from "@/hooks/stores/usePageStore";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import RecipeForm from "./form/RecipeForm";
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
    <section className="flex w-full items-center justify-center py-20">
      <div className="flex w-full max-w-[90vw] flex-col gap-10">
        <CustomBreadCrumb />

        <p className="text-4xl font-bold">Edit Recipe</p>

        <RecipeForm />
      </div>
    </section>
  );
};

export default EditRecipe;
