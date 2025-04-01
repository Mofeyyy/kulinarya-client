import { cn } from "@/lib/utils";
import { useFieldArray } from "react-hook-form";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

// Imported Components
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

// Imported Icons
import { LoaderCircle } from "lucide-react";

// Imported Custom Hooks
import useRecipeStore from "@/hooks/stores/useRecipeStore";
import useMediaPreviewStore from "@/hooks/stores/useMediaPreviewStore";
import useConfirmDialog from "@/components/useConfirmDialog";
import useUpdateRecipe from "@/hooks/mutations/useUpdateRecipe";
import useUnsavedChangesStore from "@/hooks/stores/useUnsavedChangesStore";

// Imported Schemas
import recipeSchema from "@/schemas/recipeSchema";

// Imported Constants
import {
  MAX_WIDTH,
  MAX_HEIGHT,
  MAX_IMAGE_SIZE_MB,
  MAX_VIDEO_SIZE_MB,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
} from "@/constants/recipeFormConstants";

// Imported Helpers
import { validateImageDimensions, validateFileSize, validateFileType } from "@/helpers/formHelpers";
import { convertToWebP } from "@/helpers/formHelpers";

// Imported Custom Components
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

// -------------------------------------------------------------

const EditRecipeForm = ({ recipe }) => {
  const setHasUnsavedChanges = useUnsavedChangesStore((state) => state.setHasUnsavedChanges);
  const mediaPreview = useMediaPreviewStore((state) => state.mediaPreview);
  const fileNames = useMediaPreviewStore((state) => state.fileNames);
  const setMediaPreview = useMediaPreviewStore((state) => state.setMediaPreview);
  const setFileNames = useMediaPreviewStore((state) => state.setFileNames);
  const resetAllMediaPreview = useMediaPreviewStore((state) => state.resetAllMediaPreview);
  const { openDialog, ConfirmDialog } = useConfirmDialog();
  const navigateTo = useNavigate();

  const { mutateAsync: updateRecipe, isPending: isUpdating } = useUpdateRecipe();

  const form = useForm({
    defaultValues: recipe,
    mode: "onTouched",
    resolver: zodResolver(recipeSchema),
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    getValues,
    setValue,
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

  const onSubmit = async (data) => {
    try {
      // Convert images to WebP (only if they are files)
      const convertedMainPicture =
        data.mainPicture instanceof File ? await convertToWebP(data.mainPicture) : data.mainPicture;

      const convertedAdditionalPictures = await Promise.all(
        data.additionalPictures.map((file) => (file instanceof File ? convertToWebP(file) : file)),
      );

      const finalData = {
        ...data,
        mainPicture: convertedMainPicture,
        additionalPictures: convertedAdditionalPictures,
      };

      console.log("Final data:", finalData); // For Debugging

      const confirm = await openDialog("Are you sure you want to update this recipe?");

      if (confirm) {
        await toast.promise(
          updateRecipe({ recipeId: recipe._id, ...finalData }),
          {
            loading: "Updating recipe...",
            success: "Recipe updated successfully!",
          },
          {
            duration: 5000,
          },
        );

        resetAllMediaPreview();
        setHasUnsavedChanges(false);

        // Delay to ensure states are updated before navigate
        setTimeout(() => navigateTo(`/recipes/${recipe._id}`), 0);
      }
    } catch (error) {
      console.error("Failed to update recipe", error);
      toast.error(`Failed to update recipe: ${error}`);
    }
  };

  const handleFileUpload = async (event, type, fieldType) => {
    const files = event.target.files;
    if (!files?.length) return;

    // If the media type is additionalPicturesUrls (Multiple files)
    if (type === "additionalPicturesUrls") {
      if (mediaPreview.additionalPicturesUrls.length >= 5) {
        toast.error("Max additional pictures reached!");
        return;
      }

      const newFiles = Array.from(files).slice(0, 5 - mediaPreview.additionalPicturesUrls.length); // Limit to 5
      const validFiles = [];

      for (const file of newFiles) {
        if (validateFileType(file, ALLOWED_IMAGE_TYPES)) {
          toast.error(`Only JPEG, PNG, and WebP allowed`);
          continue;
        }

        if (validateFileSize(file, MAX_IMAGE_SIZE_MB)) {
          toast.error(`Image must be under ${MAX_IMAGE_SIZE_MB}MB`);
          continue;
        }

        const isValidDimensions = await validateImageDimensions(file);
        if (!isValidDimensions) {
          toast.error(`Image dimensions must be smaller than ${MAX_WIDTH}x${MAX_HEIGHT}px`);
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      setMediaPreview((prev) => ({
        ...prev,
        additionalPicturesUrls: [
          ...prev.additionalPicturesUrls,
          ...validFiles.map((file) => URL.createObjectURL(file)),
        ],
      }));

      setFileNames((prev) => ({
        ...prev,
        additionalPictures: [...prev.additionalPictures, ...validFiles.map((f) => f.name)],
      }));

      // Set multiple files in react-hook-form
      setValue(fieldType, [...(getValues(fieldType) || []), ...validFiles], { shouldDirty: true });
    } else {
      // Single file uploads (Main picture, Video)
      const file = files[0];

      if (type === "videoUrl") {
        // Video-specific validation
        if (validateFileType(file, ALLOWED_VIDEO_TYPES)) {
          toast.error("Only MP4 files allowed");
          return;
        }

        if (validateFileSize(file, MAX_VIDEO_SIZE_MB)) {
          toast.error(`Video must be under ${MAX_VIDEO_SIZE_MB}MB`);
          return;
        }
      } else {
        // Image-specific validation
        if (validateFileType(file, ALLOWED_IMAGE_TYPES)) {
          toast.error("Only JPEG, PNG, and WebP allowed");
          return;
        }

        if (validateFileSize(file, MAX_IMAGE_SIZE_MB)) {
          toast.error(`File must be under ${MAX_IMAGE_SIZE_MB}MB`);
          return;
        }

        const isValidDimensions = await validateImageDimensions(file);
        if (!isValidDimensions) {
          toast.error(`Image dimensions must be smaller than ${MAX_WIDTH}x${MAX_HEIGHT}px`);
          return;
        }
      }

      setMediaPreview((prev) => ({
        ...prev,
        [type]: URL.createObjectURL(file),
      }));

      setFileNames((prev) => ({
        ...prev,
        [type.replace("Url", "")]: file.name,
      }));

      // Set the file in react-hook-form
      setValue(fieldType, file, { shouldDirty: true });
    }

    // Reset input field to allow re-uploading the same file
    event.target.value = "";
  };

  const handleRemoveMainPicture = async () => {
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
  };

  const handleRemoveVideo = async () => {
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
  };

  const removeAdditionalPicture = async (index) => {
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
  };

  // Monitor for unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(Object.keys(dirtyFields).length > 0);
  }, [dirtyFields]);

  // Set existing media once recipe is loaded
  useEffect(() => {
    if (recipe) {
      setMediaPreview({
        mainPictureUrl: recipe.mainPicture || null,
        videoUrl: recipe.video || null,
        additionalPicturesUrls: recipe.additionalPictures || [],
      });
    }
  }, [recipe]);

  // FOR DEBUGGING - useForm Errors
  useEffect(() => {
    console.log("Form Errors", errors);
  }, [errors]);

  // Clear Media Preview on unmount
  useEffect(() => {
    return () => {
      resetAllMediaPreview();
    };
  }, []);

  return (
    <Form {...form}>
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
            isDisabled={isUpdating || isSubmitting}
          />

          {/* Food Origin and Category */}
          <div className="flex flex-col gap-10 xl:grid xl:grid-cols-2 2xl:gap-20">
            {/* Origin Field */}
            <CustomSelectField
              control={control}
              name="originProvince"
              formLabel="Province Origin"
              Component={FormSelectRecipeOrigin}
              isDisabled={isUpdating || isSubmitting}
            />

            {/* Food Category Field */}
            <CustomSelectField
              control={control}
              name="foodCategory"
              formLabel="Food Category"
              Component={FormSelectFoodCategory}
              isDisabled={isUpdating || isSubmitting}
            />
          </div>

          {/* Description Field */}
          <CustomTextAreaField
            control={control}
            name="description"
            formLabel="Description"
            textAreaPlaceholder="Description"
            isDisabled={isUpdating || isSubmitting}
          />

          {/* Ingredients  Field */}
          <IngredientsFieldArray
            control={control}
            ingredientFields={ingredientFields}
            addIngredient={addIngredient}
            removeIngredient={removeIngredient}
            isDisabled={isUpdating || isSubmitting}
          />

          {/* Procedure Field */}
          <ProcedureFieldArray
            control={control}
            procedureFields={procedureFields}
            addProcedure={addProcedure}
            removeProcedure={removeProcedure}
            isDisabled={isUpdating || isSubmitting}
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
            isDisabled={isUpdating || isSubmitting}
          />

          {/* Video Field */}
          <VideoUploadField
            control={control}
            mediaPreview={mediaPreview}
            fileNames={fileNames}
            handleFileUpload={handleFileUpload}
            handleRemoveVideo={handleRemoveVideo}
            isDisabled={isUpdating || isSubmitting}
          />

          {/* Additional Pictures */}
          <AdditionalPicturesUploadField
            control={control}
            mediaPreview={mediaPreview}
            fileNames={fileNames}
            handleFileUpload={handleFileUpload}
            removeAdditionalPicture={removeAdditionalPicture}
            isDisabled={isUpdating || isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center md:col-start-1 md:col-end-3">
          <Button
            type="submit"
            className={cn("bg-primary w-full lg:w-1/2", {
              "opacity-50": isSubmitting || isUpdating,
            })}
            disabled={isSubmitting || isUpdating}
          >
            {isSubmitting || isUpdating ? (
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

export default EditRecipeForm;
