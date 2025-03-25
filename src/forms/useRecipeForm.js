import { useForm, useFieldArray } from "react-hook-form";
import recipeSchema from "@/schemas/recipeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import useMediaPreviewStore from "@/hooks/stores/useMediaPreviewStore";
import useCreateRecipe from "@/hooks/mutations/useCreateRecipe";
import toast from "react-hot-toast";
import useUpdateRecipe from "@/hooks/mutations/useUpdateRecipe";
import { useNavigate } from "react-router-dom";

// -------------------------- Recipe Form ------------------------------

const useRecipeForm = (initialData = null) => {
  const navigateTo = useNavigate();
  const isEditing = !!initialData; // If data exists, it's edit mode

  const recipeForm = useForm({
    defaultValues: {
      title: initialData?.title || "",
      originProvince: initialData?.originProvince || "",
      foodCategory: initialData?.foodCategory || "",
      description: initialData?.description || "",

      ingredients: initialData?.ingredients?.map((ingredient) => ({
        ...ingredient,
        quantity: String(ingredient.quantity ?? ""),
      })) || [{ quantity: "", unit: "", name: "" }],

      procedure: initialData?.procedure || [{ stepNumber: 1, content: "" }],

      mainPicture: initialData?.mainPictureUrl || null,
      video: initialData?.videoUrl || null,
      additionalPictures: initialData?.additionalPicturesUrls || [],
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
  const { mutate: createRecipe, isPending: isCreating } = useCreateRecipe();
  const { mutate: updateRecipe, isPending: isUpdating } = useUpdateRecipe();

  const onSubmit = async (data) => {
    console.log("Form Submitted!", data);

    if (isEditing) {
      updateRecipe(
        { recipeId: initialData._id, ...data },
        {
          onSuccess: (response) => {
            toast.success("Recipe updated successfully!");
            reset();
            resetAllMediaPreview();
            console.log("Recipe updated successfully!", response);
            navigateTo(`/recipes/${initialData._id}`);
          },
          onError: (err) => {
            toast.error(`Failed to update recipe ${err}`);
            console.error("Failed to update recipe", err);
          },
        }
      );
    } else {
      createRecipe(data, {
        onSuccess: (response) => {
          toast.success("Recipe created successfully! Wait for moderation.");
          reset();
          resetAllMediaPreview();
          console.log("Recipe created successfully!", response);
          navigateTo(`/recipes`);
        },
        onError: (err) => {
          toast.error(`Failed to post recipe ${err}`);
          console.error("Failed to post recipe", err);
        },
      });
    }
  };

  return {
    recipeForm,
    control,
    handleSubmit,
    isSubmitting,
    onSubmit,
    isPending: isCreating || isUpdating,

    // For setting values manually
    setValue,
    getValues,
  };
};

export default useRecipeForm;
