import { useForm, useFieldArray } from "react-hook-form";

// Imported Icons
import { ChevronRight, ChevronLeft } from "lucide-react";

// Imported Items For Forms
import { secondStepSchema } from "@/schemas/recipeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreateRecipeStore from "@/hooks/stores/useCreateRecipeStore";

// Imported Components
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

// Imported Custom Components
import ProcedureFieldArray from "./components/ProcedureFieldArray";
import IngredientsFieldArray from "./components/IngredientsFieldArray";
import useProcedureFieldArray from "@/forms/field/useProcedureFieldArray";

// -----------------------------------------------------------

const StepTwo = ({ onFormValidated, onBack }) => {
  const getSecondStepValues = useCreateRecipeStore((state) => state.getSecondStepValues);

  const form = useForm({
    defaultValues: getSecondStepValues(),
    resolver: zodResolver(secondStepSchema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const {
    fields: ingredientFields,
    append: addIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const { procedureFields, addProcedure, removeProcedure } = useProcedureFieldArray(
    control,
    setValue,
    getValues,
  );

  return (
    <div className="w-full max-w-[500px] rounded-lg border p-5">
      <Form {...form}>
        <form onSubmit={handleSubmit(onFormValidated)} className="flex flex-col gap-10">
          {/* Ingredients  Field */}
          <IngredientsFieldArray
            control={control}
            ingredientFields={ingredientFields}
            addIngredient={addIngredient}
            removeIngredient={removeIngredient}
            hasError={!!errors.ingredients}
          />

          {/* Procedure Field */}
          <ProcedureFieldArray
            control={control}
            procedureFields={procedureFields}
            addProcedure={addProcedure}
            removeProcedure={removeProcedure}
            hasError={!!errors.procedure}
          />

          {(errors.ingredients || errors.procedure) && (
            <p className="text-destructive-foreground text-sm">Please fill missing fields</p>
          )}

          <div className="flex justify-between">
            <Button type="button" onClick={onBack} variant="ghost" className="border !pr-4">
              <ChevronLeft />
              Previous
            </Button>
            <Button type="submit" className="!pl-4">
              Next
              <ChevronRight />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StepTwo;
