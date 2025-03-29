import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Dot } from "lucide-react";
import FormSelectUnit from "./FormSelectUnit";
import CustomInputField from "./CustomInputField";
import CustomSelectField from "./CustomSelectField";

// -------------------------------------------------------------

const IngredientsFieldArray = ({
  control,
  ingredientFields,
  addIngredient,
  removeIngredient,
  isDisabled,
  hasError,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Label className={hasError ? "text-destructive" : ""}>Ingredients</Label>
      {ingredientFields.map((field, index) => (
        <div key={field.id} className="flex w-full items-center gap-2">
          <Dot className={hasError ? "text-destructive" : ""} />

          <div className="flex w-full flex-col items-center gap-2 md:max-lg:flex-row xl:flex-row">
            {/* Ingredient Name */}
            <CustomInputField
              control={control}
              name={`ingredients.${index}.name`}
              inputPlaceholder="Ingredient Name"
              className="w-full xl:flex-1"
              hasErrorMessage={false}
              isDisabled={isDisabled}
            />

            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:max-lg:flex md:max-lg:w-auto xl:flex xl:w-auto">
              {/* Quantity */}
              <CustomInputField
                control={control}
                name={`ingredients.${index}.quantity`}
                inputPlaceholder="Quantity"
                className="w-full md:max-lg:w-28 xl:w-28"
                type="number"
                hasErrorMessage={false}
                isDisabled={isDisabled}
              />

              {/* Unit */}
              <CustomSelectField
                control={control}
                name={`ingredients.${index}.unit`}
                Component={FormSelectUnit}
                className="w-full md:max-lg:w-28 xl:w-28"
                hasErrorMessage={false}
                isDisabled={isDisabled}
              />

              {/* Delete Button */}
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeIngredient(index)}
                className="col-start-1 col-end-3 w-full sm:col-start-3 sm:col-end-3 sm:w-auto"
                disabled={isDisabled}
              >
                <Trash2 className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      {/* Add Button */}
      <Button
        type="button"
        onClick={() => addIngredient({ name: "", unit: "", quantity: "" })}
        disabled={isDisabled}
      >
        <Plus className="size-5" />
      </Button>
    </div>
  );
};

export default IngredientsFieldArray;
