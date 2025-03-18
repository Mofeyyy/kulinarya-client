import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore";

// ------------------------------------------------------------

// TODO: -----------------------
// Control the value
// TODO: -----------------------

const SearchInput = () => {
  const { setSearch } = useRecipeFilterStore();

  const debouncedSetSearch = useDebouncedCallback((value) => {
    setSearch(value);
  }, 300);

  return (
    <div className="relative flex items-center hover:opacity-80 min-w-[16rem]">
      <Search className="absolute left-3 text-foreground" size={20} />
      <Input
        type="text"
        onChange={(e) => debouncedSetSearch(e.target.value)}
        className="pl-10 pr-10"
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchInput;
