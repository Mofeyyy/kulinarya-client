import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePageStore from "@/hooks/stores/usePageStore";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import EditRecipeForm from "./form/EditRecipeForm";
import useFetchRecipe from "@/hooks/queries/useFetchRecipe";
import ScreenLoader from "@/components/ScreenLoader";
import NotFoundPage from "../NotFoundPage";
import useAuthStore from "@/hooks/stores/useAuthStore";
import toast from "react-hot-toast";

// ----------------------------------------------------------------

const EditRecipe = () => {
  const { recipeId } = useParams();
  const userDetails = useAuthStore((state) => state.userDetails);
  const setPage = usePageStore((state) => state.setPage);
  const setSubPage = usePageStore((state) => state.setSubPage);
  const navigateTo = useNavigate();

  // Fetch Recipe Data
  const { data: recipe, isLoading, error } = useFetchRecipe(recipeId);

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

  // For debugging purpose
  useEffect(() => {
    console.log("Recipe Data:", recipe);
  }, [recipe]);

  // Check if user is authorized to edit recipe
  useEffect(() => {
    if (!recipe) return;

    if (recipe.byUser._id.toString() !== userDetails._id) {
      toast.error("Unauthorized Access", { duration: 5000 });
      navigateTo(-1);
    }

    console.log("Authorized!");
  }, [recipe, userDetails]);

  // Set Page useEffect
  useEffect(() => {
    document.title = "Edit | Kulinarya";
    setPage({ href: "/recipes", name: "Recipes" });
    setSubPage({ href: `/recipes/${recipeId}/edit`, name: "Edit Recipe" });
  }, []);

  if (isLoading) return <ScreenLoader />;
  if (error || !recipe) return <NotFoundPage />;

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
