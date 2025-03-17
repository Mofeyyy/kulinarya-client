import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore";

// ------------------------------------------------------------

const LimitSelect = () => {
  const { limit, setLimit } = useRecipeFilterStore();

  return (
    <Select
      value={String(limit)}
      onValueChange={(value) => setLimit(Number(value))}
    >
      <SelectTrigger className="w-24">
        <SelectValue placeholder="Limit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="20">20</SelectItem>
        <SelectItem value="50">50</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LimitSelect;
