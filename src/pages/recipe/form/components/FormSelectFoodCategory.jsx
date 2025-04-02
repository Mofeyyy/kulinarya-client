import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { recipeCategories } from "@/constants/recipeConstants";

// -------------------------------------------------------------

const FormSelectFoodCategory = ({ field, error, className, isDisabled }) => {
  return (
    <Select
      value={field.value}
      defaultValue={field.value}
      onValueChange={field.onChange}
      disabled={isDisabled}
    >
      <SelectTrigger
        id={field.name}
        className={cn("w-full", error && "border-destructive", className)}
      >
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {recipeCategories.map(({ label, value }) => (
            <SelectItem key={value} value={value} className="cursor-pointer capitalize">
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FormSelectFoodCategory;
