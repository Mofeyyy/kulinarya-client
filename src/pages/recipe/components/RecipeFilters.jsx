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
  const { setSearch, resetFilters, origin, category, search } =
    useRecipeFilterStore();

  const hasFilters = origin || category || search;

  const navigateTo = useNavigate();

  return (
    <div className="w-full flex flex-col sm:max-md:grid sm:max-md:grid-cols-2 md:flex-row gap-3 items-center justify-between">
      <div className="flex flex-col md:flex-row gap-3 w-full">
        {isLoggedIn && (
          <Button
            className="!pl-4 !pr-5 text-base"
            onClick={() => navigateTo("/recipes/create")}
          >
            <Plus className="size-6" />
            Create
          </Button>
        )}

        <SelectRecipeOrigin />
        <SelectRecipeCategory />
      </div>

      <div className="flex flex-col md:flex-row gap-3 w-full sm:w-auto">
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
