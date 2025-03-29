import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Trash2, Plus } from "lucide-react";

// -------------------------------------------------------------

const ProcedureFieldArray = ({
  control,
  procedureFields,
  addProcedure,
  removeProcedure,
  isDisabled,
  hasError,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Label className={hasError ? "text-destructive" : ""}>Procedure</Label>
      {procedureFields.map((field, index) => (
        <FormField
          key={field.id}
          control={control}
          name={`procedure.${index}.content`}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-3">
                  <p
                    className={`text-sm font-semibold ${fieldState.invalid && "text-destructive"}`}
                  >
                    {index + 1}.
                  </p>
                  <Input
                    placeholder="Step description"
                    {...field}
                    className={`${
                      fieldState.invalid && "border-destructive focus:outline-destructive"
                    }`}
                    disabled={isDisabled}
                  />
                  {/* Delete Button */}
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeProcedure(index)}
                    disabled={isDisabled}
                  >
                    <Trash2 className="size-5" />
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      ))}
      <Button
        type="button"
        onClick={() => addProcedure({ stepNumber: procedureFields.length + 1, content: "" })}
        disabled={isDisabled}
      >
        <Plus className="size-5" />
      </Button>
    </div>
  );
};

export default ProcedureFieldArray;
