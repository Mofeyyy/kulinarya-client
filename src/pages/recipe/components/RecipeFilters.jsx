import SelectRecipeOrigin from "./SelectRecipeOrigin";
import SearchInput from "./SearchInput";
import SelectRecipeCategory from "./SelectRecipeCategory";
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

// ------------------------------------------------------------

const RecipeFilters = () => {
  const { setSearch, resetFilters, origin, category, search } =
    useRecipeFilterStore();

  const hasFilters = origin || category || search;

  return (
    <div className="w-full flex flex-col sm:max-md:grid sm:max-md:grid-cols-2 md:flex-row gap-3 items-center justify-between">
      <div className="flex flex-col md:flex-row gap-3 w-full">
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
