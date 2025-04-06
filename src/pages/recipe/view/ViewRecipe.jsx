import { useParams } from "react-router-dom";
import { useEffect } from "react";

// Imported Custom Hooks
import usePageStore from "@/hooks/stores/usePageStore";
import useFetchRecipe from "@/hooks/queries/useFetchRecipe";
import useRecipeStore from "@/hooks/stores/useRecipeStore";

// Imported Custom Components
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import ScreenLoader from "@/components/ScreenLoader";
import CarouselWithThumbs from "@/components/carousel-09";
import CommentsPreviewSection from "./components/CommentsPreviewSection";
import RecipeTabs from "./components/RecipeTabs";
import VideoPlayer from "./components/VideoPlayer";
import RecipeImages from "./components/RecipeImages";
import RecipeTitleSection from "./components/RecipeTitleSection";
import RecipeDescription from "./components/RecipeDescription";
import OwnerProfileCard from "./components/OwnerProfileCard";
import NotFoundPage from "@/pages/NotFoundPage";

// Imported API
import { trackPostView } from "@/config/postViewApi";

// ----------------------------------------------------------------
// TODO: If there is no updatedAt, use createdAt
// TODO: Add Fallback Image When Loading Error

const ViewRecipe = () => {
  const { recipeId } = useParams();
  const { setPage, setSubPage } = usePageStore(); // TODO: Deal with this asap
  const recipe = useRecipeStore((state) => state.recipe);
  const setRecipe = useRecipeStore((state) => state.setRecipe);
  const clearRecipe = useRecipeStore((state) => state.clearRecipe);

  const { data: recipeData, isLoading, error } = useFetchRecipe(recipeId);

  // Set and Clear Recipe State
  useEffect(() => {
    if (recipeData) {
      setRecipe(recipeData);
    }

    return () => {
      console.log("Clearing recipe...");
      clearRecipe();
    };
  }, [recipeId, recipeData]);

  // Set Page
  useEffect(() => {
    document.title = "View | Kulinarya";
    setPage({ href: "/recipes", name: "Recipes" });
    setSubPage({
      href: `/recipes/${recipeId}`,
      name: recipe?.title || "Recipe View",
    });
  }, [recipe]);

  // For Debugging
  useEffect(() => {
    console.log("Updated Recipe State:", recipe);
  }, [recipe]);

  // Track Post View
  // useEffect(() => {
  //   if (recipeId) {
  //     trackPostView(recipeId); // Track view when the page loads
  //   }
  // }, [recipeId]);

  if (error) return <NotFoundPage />;
  if (isLoading || !recipe) return <ScreenLoader />;

  // Destructure when loaded
  const { videoUrl, mainPictureUrl, additionalPicturesUrls } = recipe;

  return (
    <section className="flex w-full items-center justify-center py-20">
      <div className="flex w-full max-w-[90vw] flex-col gap-10 2xl:max-w-[80vw]">
        <CustomBreadCrumb />

        {/* Main Content */}
        <div className="flex w-full flex-col gap-10 lg:flex-row">
          {/* Left Side */}
          <div className="flex w-full flex-col gap-5 lg:w-[60%] 2xl:w-[65%]">
            <CarouselWithThumbs recipeImages={[mainPictureUrl, ...additionalPicturesUrls]} />
            <RecipeTitleSection />
            <RecipeDescription />
            <CommentsPreviewSection />
          </div>

          {/* Right Side */}
          <div className="flex w-full flex-col items-center gap-32 lg:w-[40%] 2xl:w-[35%]">
            <div className="flex w-full flex-col gap-3 overflow-hidden rounded-lg border shadow-lg">
              {videoUrl && <VideoPlayer src={videoUrl} />}
              <RecipeTabs />
            </div>

            <OwnerProfileCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewRecipe;
