import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { recipeCategories } from "@/constants/recipeConstants";
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore";

// ------------------------------------------------------------

const SelectRecipeCategory = () => {
  const { category, setCategory } = useRecipeFilterStore();

  const handleChange = (value) => {
    setCategory(value);
  };

  return (
    <Select value={category} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {recipeCategories.map(({ label, value }) => (
            <SelectItem key={value} value={value} className="capitalize">
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectRecipeCategory;
