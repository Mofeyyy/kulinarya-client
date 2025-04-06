import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";

// ------------------------------------------------------------

const SearchInput = ({ value, onChange }) => {
  const debouncedSetSearch = useDebouncedCallback((value) => {
    onChange(value);
  }, 500);

  return (
    <div className="relative flex w-full items-center hover:opacity-80 md:max-w-xs">
      <Search className="text-foreground absolute left-3" size={20} />
      <Input
        type="text"
        defaultValue={value}
        onChange={(e) => debouncedSetSearch(e.target.value)}
        className="pr-10 pl-10"
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchInput;
