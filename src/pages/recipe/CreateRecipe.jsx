import { useEffect } from "react";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import usePageStore from "@/hooks/stores/usePageStore";
import CreateRecipeForm from "./components/CreateRecipeForm";

// ----------------------------------------------------------------

const CreateRecipe = () => {
  const { setPage, setSubPage } = usePageStore();

  useEffect(() => {
    document.title = "Create | Kulinarya";
    setPage({ href: "/recipes", name: "Recipes" });
    setSubPage({ href: "/recipes/create", name: "Create New Recipe" });
  }, []);

  return (
    <section className="w-full px-5 min-[400px]:px-10 min-[500px]:px-16 sm:px-12 md:px-16 lg:px-24 xl:px-40 py-20 flex flex-col gap-10">
      <CustomBreadCrumb />

      <p className="text-4xl font-bold">Create New Recipe</p>

      <CreateRecipeForm />
    </section>
  );
};

export default CreateRecipe;
