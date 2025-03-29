import { cn } from "@/lib/utils";
import { useFieldArray } from "react-hook-form";
import useRecipeForm from "@/forms/useRecipeForm";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderCircle } from "lucide-react";
import { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import useMediaPreviewStore from "@/hooks/stores/useMediaPreviewStore";
import useRecipeStore from "@/hooks/stores/useRecipeStore";
import useConfirmDialog from "@/components/useConfirmDialog";

// -------------------------------------------------------------

import AdditionalPicturesUploadField from "./components/AdditionalPicturesUploadField";
import VideoUploadField from "./components/VideoUploadField";
import MainPictureField from "./components/MainPictureField";
import CustomInputField from "./components/CustomInputField";
import CustomSelectField from "./components/CustomSelectField";
import CustomTextAreaField from "./components/CustomTextAreaField";
import FormSelectRecipeOrigin from "./components/FormSelectRecipeOrigin";
import FormSelectFoodCategory from "./components/FormSelectFoodCategory";
import ProcedureFieldArray from "./components/ProcedureFieldArray";
import IngredientsFieldArray from "./components/IngredientsFieldArray";
import useProcedureFieldArray from "@/forms/field/useProcedureFieldArray";

const RecipeForm = () => {
  const { recipe } = useRecipeStore();
  const { openDialog, ConfirmDialog } = useConfirmDialog();
  const {
    recipeForm,
    control,
    handleSubmit,
    isSubmitting,
    onSubmit,
    isPending,

    // For setting values manually
    setValue,
    getValues,
  } = useRecipeForm(recipe);

  console.log("RENDDDEERRR!!!!!");

  const {
    fields: ingredientFields,
    append: addIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const { mediaPreview, fileNames, setMediaPreview, setFileNames } = useMediaPreviewStore();

  useEffect(() => {
    if (recipe) {
      setMediaPreview({
        mainPictureUrl: recipe.mainPictureUrl || null,
        videoUrl: recipe.videoUrl || null,
        additionalPicturesUrls: recipe.additionalPicturesUrls || [],
      });
    }
  }, [recipe, setMediaPreview]);

  const { procedureFields, addProcedure, removeProcedure } = useProcedureFieldArray(
    control,
    setValue,
    getValues,
  );

  const handleFileUpload = useCallback((event, type, fieldType) => {
    const files = event.target.files;
    if (!files?.length) return;

    if (type === "additionalPicturesUrls") {
      if (mediaPreview.additionalPicturesUrls.length >= 5) {
        toast.error("Max additional pictures reached!");
        return;
      } // Prevent upload if already at the limit

      const newFiles = Array.from(files).slice(0, 5 - mediaPreview.additionalPicturesUrls.length); // Limit to 5

      setMediaPreview((prev) => ({
        ...prev,
        additionalPicturesUrls: [
          ...prev.additionalPicturesUrls,
          ...newFiles.map((file) => URL.createObjectURL(file)),
        ],
      }));

      setFileNames((prev) => ({
        ...prev,
        additionalPictures: [...prev.additionalPictures, ...newFiles.map((f) => f.name)],
      }));

      // Set multiple files in react-hook-form
      setValue(fieldType, [...(getValues(fieldType) || []), ...newFiles]);
    } else {
      const file = files[0];

      setMediaPreview((prev) => ({
        ...prev,
        [type]: URL.createObjectURL(file),
      }));

      setFileNames((prev) => ({
        ...prev,
        [type.replace("Url", "")]: file.name,
      }));

      console.log("Uploaded File:", file);

      // Set the file in react-hook-form
      setValue(fieldType, file);
    }

    // Reset input field to allow re-uploading the same file
    event.target.value = "";
  }, []);

  const handleRemoveMainPicture = useCallback(async () => {
    if (mediaPreview.mainPictureUrl === recipe?.mainPictureUrl && !!recipe) {
      toast.error("You cannot remove the old main picture. Change it!");
      return;
    }

    const isConfirmed = await openDialog(
      `Are you sure you want to ${
        !!recipe ? "restore to the old picture" : "remove this main picture"
      }?`,
    );

    if (isConfirmed) {
      setMediaPreview((prev) => ({
        ...prev,
        mainPictureUrl: recipe?.mainPictureUrl || null, // Restore original if it exists
      }));

      setFileNames((prev) => ({
        ...prev,
        mainPicture: null,
      }));

      setValue("mainPicture", recipe?.mainPictureUrl || null);
    }
  }, []);

  const handleRemoveVideo = useCallback(async () => {
    const isConfirmed = await openDialog("Are you sure you want to remove this video?");

    if (isConfirmed) {
      setMediaPreview((prev) => ({
        ...prev,
        videoUrl: null,
      }));

      setFileNames((prev) => ({
        ...prev,
        video: null,
      }));

      setValue("video", null);
    }
  }, []);

  const removeAdditionalPicture = useCallback(async (index) => {
    const isConfirmed = await openDialog(
      "Are you sure you want to remove this additional picture?",
    );

    if (isConfirmed) {
      setMediaPreview((prev) => ({
        ...prev,
        additionalPicturesUrls: prev.additionalPicturesUrls.filter((_, i) => i !== index),
      }));

      setFileNames((prev) => ({
        ...prev,
        additionalPictures: prev.additionalPictures.filter((_, i) => i !== index),
      }));

      setValue(
        "additionalPictures",
        (getValues("additionalPictures") || []).filter((_, i) => i !== index),
      );
    }
  }, []);

  // FOR DEBUGGING - useForm Errors
  useEffect(() => {
    console.log("Form State:", recipeForm.formState);
    console.log("Form Errors", recipeForm.formState.errors);
  }, [recipeForm.formState]);

  return (
    <Form {...recipeForm}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-10 lg:grid lg:grid-cols-2 xl:gap-14 2xl:gap-20"
      >
        {/* Left Side Fields */}
        <div className="flex w-full flex-col gap-10">
          {/* Title Field */}
          <CustomInputField
            control={control}
            name="title"
            formLabel="Recipe Title"
            inputPlaceholder="Recipe Name"
            isDisabled={isPending || isSubmitting}
          />

          {/* Food Origin and Category */}
          <div className="flex flex-col gap-10 xl:grid xl:grid-cols-2 2xl:gap-20">
            {/* Origin Field */}
            <CustomSelectField
              control={control}
              name="originProvince"
              formLabel="Province Origin"
              Component={FormSelectRecipeOrigin}
              isDisabled={isPending || isSubmitting}
            />

            {/* Food Category Field */}
            <CustomSelectField
              control={control}
              name="foodCategory"
              formLabel="Food Category"
              Component={FormSelectFoodCategory}
              isDisabled={isPending || isSubmitting}
            />
          </div>

          {/* Description Field */}
          <CustomTextAreaField
            control={control}
            name="description"
            formLabel="Description"
            textAreaPlaceholder="Description"
            isDisabled={isPending || isSubmitting}
          />

          {/* Ingredients  Field */}
          <IngredientsFieldArray
            control={control}
            ingredientFields={ingredientFields}
            addIngredient={addIngredient}
            removeIngredient={removeIngredient}
            isDisabled={isPending || isSubmitting}
          />

          {/* Procedure Field */}
          <ProcedureFieldArray
            control={control}
            procedureFields={procedureFields}
            addProcedure={addProcedure}
            removeProcedure={removeProcedure}
            isDisabled={isPending || isSubmitting}
          />
        </div>

        {/* Right Side Fields */}
        <div className="flex w-full flex-col gap-10">
          {/* Main Picture */}
          <MainPictureField
            control={control}
            mediaPreview={mediaPreview}
            fileNames={fileNames}
            handleFileUpload={handleFileUpload}
            handleRemoveMainPicture={handleRemoveMainPicture}
            isDisabled={isPending || isSubmitting}
          />

          {/* Video Field */}
          <VideoUploadField
            control={control}
            mediaPreview={mediaPreview}
            fileNames={fileNames}
            handleFileUpload={handleFileUpload}
            handleRemoveVideo={handleRemoveVideo}
            isDisabled={isPending || isSubmitting}
          />

          {/* Additional Pictures */}
          <AdditionalPicturesUploadField
            control={control}
            mediaPreview={mediaPreview}
            fileNames={fileNames}
            handleFileUpload={handleFileUpload}
            removeAdditionalPicture={removeAdditionalPicture}
            isDisabled={isPending || isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center md:col-start-1 md:col-end-3">
          <Button
            type="submit"
            className={cn("bg-primary w-full lg:w-1/2", {
              "opacity-50": isSubmitting || isPending,
            })}
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <p>{!!recipe ? "Update" : "Submit"}</p>
            )}
          </Button>
        </div>
        {ConfirmDialog}
      </form>
    </Form>
  );
};

// ! Custom Components To Be Moved Soon -----------------------------------------

export default RecipeForm;
