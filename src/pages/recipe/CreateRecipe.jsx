import { useEffect } from "react";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import usePageStore from "@/hooks/stores/usePageStore";
import RecipeForm from "./form/RecipeForm";
import SampleForm from "./form/SampleForm";

// ----------------------------------------------------------------

const CreateRecipe = () => {
  const { setPage, setSubPage } = usePageStore();

  useEffect(() => {
    document.title = "Create | Kulinarya";
    setPage({ href: "/recipes", name: "Recipes" });
    setSubPage({ href: "/recipes/create", name: "Create New Recipe" });
  }, []);

  return (
    <section className="flex h-full w-full items-center justify-center py-20">
      <div className="flex h-full w-full max-w-[90vw] flex-col gap-10">
        <CustomBreadCrumb />

        <p className="text-2xl font-bold">Create New Recipe</p>

        {/* <RecipeForm /> */}
        <SampleForm />
      </div>
    </section>
  );
};

export default CreateRecipe;
