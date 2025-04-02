import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { groupByIsland } from "@/utils/recipeUtils";
import provinces from "@/data/provinces.json";

// ------------------------------------------------------------

const SelectRecipeOrigin = ({ value, onChange }) => {
  const groupedProvinces = groupByIsland(provinces);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full md:w-[150px] lg:w-[180px] xl:w-[200px]">
        <SelectValue placeholder="Origin" />
      </SelectTrigger>
      <SelectContent>
        {groupedProvinces &&
          Object.entries(groupedProvinces).map(([island, provinces]) => (
            <SelectGroup key={island}>
              <SelectLabel className="text-primary text-base capitalize">{island}</SelectLabel>

              {provinces.map((province) => (
                <SelectItem key={province.code} value={province.name}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
      </SelectContent>
    </Select>
  );
};

export default SelectRecipeOrigin;
