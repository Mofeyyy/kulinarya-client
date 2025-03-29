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
import { groupByIsland } from "@/utils/recipeUtils";
import provinces from "@/data/provinces.json";

// -------------------------------------------------------------

const FormSelectRecipeOrigin = ({ field, error, className, isDisabled }) => {
  const groupedProvinces = groupByIsland(provinces);

  return (
    <Select
      value={field.value}
      defaultValue={field.value}
      onValueChange={field.onChange}
      disabled={isDisabled}
    >
      <SelectTrigger
        id={field.name}
        data-error={!!error}
        className={cn("w-full", error && "border-destructive", className)}
      >
        <SelectValue placeholder="Origin" />
      </SelectTrigger>
      <SelectContent>
        {groupedProvinces &&
          Object.entries(groupedProvinces).map(([island, provinces]) => (
            <SelectGroup key={island}>
              <SelectLabel className="text-primary text-base capitalize">{island}</SelectLabel>
              {provinces.map((province) => (
                <SelectItem key={province.code} value={province.name} className="cursor-pointer">
                  {province.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
      </SelectContent>
    </Select>
  );
};

export default FormSelectRecipeOrigin;
