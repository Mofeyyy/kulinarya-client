import SelectRecipeOrigin from "./SelectRecipeOrigin";
import SearchInput from "./SearchInput";
import SelectRecipeCategory from "./SelectRecipeCategory";
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore";
import { Button } from "@/components/ui/button";

// ------------------------------------------------------------

const RecipeFilters = () => {
  const { setSearch, resetFilters, origin, category, search } =
    useRecipeFilterStore();

  const hasFilters = origin || category || search;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-3 items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3">
        <SelectRecipeOrigin />
        <SelectRecipeCategory />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput setSearch={setSearch} />
        {hasFilters && <Button onClick={resetFilters}>Reset Filters</Button>}
      </div>
    </div>
  );
};

export default RecipeFilters;
