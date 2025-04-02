import { useForm } from "react-hook-form";

// Imported Icons
import { ChevronRight } from "lucide-react";

// Imported Items For Forms
import { firstStepSchema } from "@/schemas/recipeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreateRecipeStore from "@/hooks/stores/useCreateRecipeStore";

// Imported Components
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

// Imported Custom Components
import CustomInputField from "./components/CustomInputField";
import CustomSelectField from "./components/CustomSelectField";
import CustomTextAreaField from "./components/CustomTextAreaField";
import FormSelectRecipeOrigin from "./components/FormSelectRecipeOrigin";
import FormSelectFoodCategory from "./components/FormSelectFoodCategory";

// -----------------------------------------------------------

const StepOne = ({ onFormValidated }) => {
  const getFirstStepValues = useCreateRecipeStore((state) => state.getFirstStepValues);

  const form = useForm({
    defaultValues: getFirstStepValues(),
    resolver: zodResolver(firstStepSchema),
  });

  const { control, handleSubmit } = form;

  return (
    <div className="w-full max-w-[500px] rounded-lg border p-5">
      <Form {...form}>
        <form onSubmit={handleSubmit(onFormValidated)} className="flex flex-col gap-10">
          {/* Title Field */}
          <CustomInputField
            control={control}
            name="title"
            formLabel="Recipe Title"
            inputPlaceholder="Recipe Name"
          />

          {/* Origin Field */}
          <CustomSelectField
            control={control}
            name="originProvince"
            formLabel="Province Origin"
            Component={FormSelectRecipeOrigin}
          />

          {/* Food Category Field */}
          <CustomSelectField
            control={control}
            name="foodCategory"
            formLabel="Food Category"
            Component={FormSelectFoodCategory}
          />

          {/* Description Field */}
          <CustomTextAreaField
            control={control}
            name="description"
            formLabel="Description"
            textAreaPlaceholder="Description"
          />

          <Button type="submit" className="self-end !pl-4">
            Next
            <ChevronRight />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StepOne;
