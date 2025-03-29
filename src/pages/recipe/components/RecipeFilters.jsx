import SelectRecipeOrigin from "./SelectRecipeOrigin";
import SearchInput from "./SearchInput";
import SelectRecipeCategory from "./SelectRecipeCategory";
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/hooks/stores/useAuthStore";

// ------------------------------------------------------------

const RecipeFilters = () => {
  const { isLoggedIn } = useAuthStore();
  const { setSearch, resetFilters, origin, category, search } = useRecipeFilterStore();

  const hasFilters = origin || category || search;

  const navigateTo = useNavigate();

  return (
    <div className="flex w-full flex-col items-center justify-between gap-3 sm:max-md:grid sm:max-md:grid-cols-2 md:flex-row">
      <div className="flex w-full flex-col gap-3 md:flex-row">
        {isLoggedIn && (
          <Button className="!pr-5 !pl-4 text-base" onClick={() => navigateTo("/recipes/create")}>
            <Plus className="size-6" />
            Create
          </Button>
        )}

        <SelectRecipeOrigin />
        <SelectRecipeCategory />
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto md:flex-row">
        <SearchInput setSearch={setSearch} />
        {hasFilters && (
          <Button onClick={resetFilters}>
            <p className="md:max-lg:hidden">Reset Filters</p>
            <RotateCcw className="hidden md:max-lg:block" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecipeFilters;
