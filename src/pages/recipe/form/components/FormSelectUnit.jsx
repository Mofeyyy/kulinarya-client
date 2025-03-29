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

// -------------------------------------------------------------

const FormSelectUnit = ({ field, error, className, isDisabled }) => {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isDisabled}>
      <SelectTrigger className={cn("m-0 w-28", error && "border-destructive", className)}>
        <SelectValue placeholder="Unit" />
      </SelectTrigger>
      <SelectContent>
        {["g", "kg", "ml", "l", "cup", "tbsp", "tsp", "pcs"].map((unit) => (
          <SelectItem value={unit} key={unit}>
            {unit}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FormSelectUnit;
