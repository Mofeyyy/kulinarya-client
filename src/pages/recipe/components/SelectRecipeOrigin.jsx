import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useProvinces from "@/hooks/queries/useProvinces";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { groupByIsland } from "@/utils/recipeUtils";
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore";

// ------------------------------------------------------------

const SelectRecipeOrigin = () => {
  const { data: provinces, isLoading, isError } = useProvinces();
  const groupedProvinces = groupByIsland(provinces);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load provinces. Refresh the page.");
    }
  }, [isError]);

  const { origin, setOrigin } = useRecipeFilterStore();
  const handleChange = (value) => {
    setOrigin(value);
  };

  return (
    <Select
      value={origin}
      onValueChange={handleChange}
      disabled={isLoading || isError}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={isLoading ? "Loading..." : "Origin"} />
      </SelectTrigger>
      <SelectContent>
        {isError && (
          <p className="text-red-500">
            Failed to load provinces. Refresh the page.
          </p>
        )}

        {groupedProvinces &&
          Object.entries(groupedProvinces).map(([island, provinces]) => (
            <SelectGroup key={island}>
              <SelectLabel className="text-primary text-base capitalize">
                {island}
              </SelectLabel>

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
