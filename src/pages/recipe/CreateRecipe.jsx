import { useEffect, useRef } from "react";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import usePageStore from "@/hooks/stores/usePageStore";
import CreateRecipeForm from "./form/CreateRecipeForm";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/hooks/stores/useAuthStore";
import toast from "react-hot-toast";
// ----------------------------------------------------------------

const CreateRecipe = () => {
  const userDetails = useAuthStore((state) => state.userDetails);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setPage = usePageStore((state) => state.setPage);
  const setSubPage = usePageStore((state) => state.setSubPage);
  const navigateTo = useNavigate();

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (isLoggedIn && userDetails) {
      if (!userDetails.canPostRecipe && !hasShownToast.current) {
        toast.error("You can't create with 3 pending for moderation posts.", { duration: 5000 });
        hasShownToast.current = true;
        navigateTo("/recipes");
      }
    }
  }, [userDetails, isLoggedIn, navigateTo]);

  useEffect(() => {
    document.title = "Create | Kulinarya";
    setPage({ href: "/recipes", name: "Recipes" });
    setSubPage({ href: "/recipes/create", name: "Create New Recipe" });
  }, [setPage, setSubPage]);

  return (
    <section className="flex h-full w-full items-center justify-center py-20">
      <div className="flex h-full w-full max-w-[90vw] flex-col gap-10">
        <CustomBreadCrumb />

        <p className="text-2xl font-bold">Create New Recipe</p>

        <CreateRecipeForm />
      </div>
    </section>
  );
};

export default CreateRecipe;
