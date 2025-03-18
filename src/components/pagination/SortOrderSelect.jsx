import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore";

// ------------------------------------------------------------

const SortOrderSelect = () => {
  const { sortOrder, setSortOrder } = useRecipeFilterStore();

  return (
    <Select value={sortOrder} onValueChange={setSortOrder}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="oldest">Oldest</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SortOrderSelect;
