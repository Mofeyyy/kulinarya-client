import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import usePageStore from "@/hooks/stores/usePageStore";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import EditRecipeForm from "./form/EditRecipeForm";
import useFetchRecipe from "@/hooks/queries/useFetchRecipe";
import ScreenLoader from "@/components/ScreenLoader";

const EditRecipe = () => {
  const { recipeId } = useParams();
  const { setPage, setSubPage } = usePageStore();

  // Fetch Recipe Data
  const { data: recipe, isLoading, error } = useFetchRecipe(recipeId);

  useEffect(() => {
    document.title = "Edit | Kulinarya";
    setPage({ href: "/recipes", name: "Recipes" });
    setSubPage({ href: `/recipes/${recipeId}/edit`, name: "Edit Recipe" });
  }, []);

  const transformedRecipe = useMemo(() => {
    if (!recipe) return null;

    const { mainPictureUrl, videoUrl, additionalPicturesUrls, ingredients, ...rest } = recipe;

    return {
      ...rest,
      mainPicture: mainPictureUrl,
      video: videoUrl,
      additionalPictures: additionalPicturesUrls,
      ingredients: ingredients.map((ingredient) => ({
        ...ingredient,
        quantity: String(ingredient.quantity ?? ""),
      })),
    };
  }, [recipe]);

  if (isLoading) return <ScreenLoader />;
  // TODO: Create a custom error component for this things
  if (error) return <p>Error loading recipe</p>;

  return (
    <section className="flex w-full items-center justify-center py-20">
      <div className="flex w-full max-w-[90vw] flex-col gap-10">
        <CustomBreadCrumb />

        <p className="text-2xl font-bold">Edit Recipe</p>

        <EditRecipeForm recipe={transformedRecipe} />
      </div>
    </section>
  );
};

export default EditRecipe;
