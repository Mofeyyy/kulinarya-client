import { useForm, useFieldArray } from "react-hook-form";
import recipeSchema from "@/schemas/recipeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import useMediaPreviewStore from "@/hooks/stores/useMediaPreviewStore";
import useCreateRecipe from "@/hooks/mutations/useCreateRecipe";
import toast from "react-hot-toast";

// -------------------------- Recipe Form ------------------------------

const useRecipeForm = () => {
  const recipeForm = useForm({
    defaultValues: {
      title: "",
      originProvince: "",
      foodCategory: "",
      description: "",
      ingredients: [
        {
          quantity: "",
          unit: "",
          name: "",
        },
      ],
      procedure: [
        {
          stepNumber: 1,
          content: "",
        },
      ],
      mainPicture: null,
      video: null,
      additionalPictures: [],
    },

    mode: "onTouched",
    resolver: zodResolver(recipeSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = recipeForm;

  const { resetAllMediaPreview } = useMediaPreviewStore();
  const { mutate: createRecipe, isPending, error } = useCreateRecipe();

  const onSubmit = async (data) => {
    console.log("Form Submitted!", data);

    createRecipe(data, {
      onSuccess: (response) => {
        toast.success("Recipe created successfully!");
        toast.success("Recipe sent for moderation, Please wait for approval.");
        reset();
        resetAllMediaPreview();
        console.log("Recipe created successfully!", response);
      },
      onError: (err) => {
        console.error("Failed to post recipe", err);
        // reset();
        // resetAllMediaPreview();
      },
    });
  };

  return {
    recipeForm,
    control,
    handleSubmit,
    isSubmitting,
    onSubmit,
    isPending,

    // For setting values manually
    setValue,
    getValues,
  };
};

export default useRecipeForm;
