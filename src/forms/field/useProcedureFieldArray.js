import { useFieldArray } from "react-hook-form";

// -------------------------------------------------------------

const useProcedureFieldArray = (control, setValue, getValues) => {
  const {
    fields: procedureFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "procedure",
  });

  const addProcedure = () => {
    append({ stepNumber: procedureFields.length + 1, content: "" });
  };

  const removeProcedure = (index) => {
    remove(index);

    // Ensure step numbers are sequential
    setValue(
      "procedure",
      getValues("procedure").map((step, i) => ({
        ...step,
        stepNumber: i + 1,
      })),
    );
  };

  return { procedureFields, addProcedure, removeProcedure };
};

export default useProcedureFieldArray;
