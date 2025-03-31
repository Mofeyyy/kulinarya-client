import { Button } from "@/components/ui/button";
import SelectRecipeOrigin from "./SelectRecipeOrigin";
import SearchInput from "./SearchInput";
import SelectRecipeCategory from "./SelectRecipeCategory";

const defaultFilters = {
  origin: "",
  category: "",
  search: "",
  page: 1,
  limit: 10,
  sortOrder: "newest",
};

// ------------------------------------------------------------

const RecipeFilters = ({ filters, updateFilters, resetFilters }) => {
  const hasFiltersChanged = Object.keys(filters).some(
    (key) => filters[key] !== defaultFilters[key],
  );

  return (
    <div className="flex w-full flex-col items-center justify-between gap-3 sm:max-md:grid sm:max-md:grid-cols-2 md:flex-row">
      <div className="flex w-full flex-col gap-3 md:flex-row">
        <SelectRecipeOrigin
          value={filters.origin}
          onChange={(val) => updateFilters("origin", val)}
        />
        <SelectRecipeCategory
          value={filters.category}
          onChange={(val) => updateFilters("category", val)}
        />
      </div>

      <div className="flex h-full w-full flex-col gap-3 sm:w-auto md:flex-row">
        <SearchInput value={filters.search} onChange={(val) => updateFilters("search", val)} />

        {hasFiltersChanged && (
          <Button onClick={resetFilters}>
            Reset <span className="md:max-xl:hidden">Filters</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecipeFilters;
