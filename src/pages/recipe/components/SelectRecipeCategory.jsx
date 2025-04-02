import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { recipeCategories } from "@/constants/recipeConstants";

// ------------------------------------------------------------

const SelectRecipeCategory = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full md:w-[150px] lg:w-[180px] xl:w-[200px]">
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
