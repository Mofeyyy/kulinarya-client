import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

// Imported Icons
import { ChevronRight, ChevronLeft } from "lucide-react";

// Imported Items For Forms
import { thirdStepSchema } from "@/schemas/recipeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreateRecipeStore from "@/hooks/stores/useCreateRecipeStore";
import useConfirmDialog from "@/components/useConfirmDialog";
import useMediaPreviewStore from "@/hooks/stores/useMediaPreviewStore";

// Imported Components
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

// Imported Custom Components
import AdditionalPicturesUploadField from "./components/AdditionalPicturesUploadField";
import VideoUploadField from "./components/VideoUploadField";
import MainPictureField from "./components/MainPictureField";

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

// -----------------------------------------------------------

const StepThree = ({ onFormValidated, onBack }) => {
  const { openDialog, ConfirmDialog } = useConfirmDialog();
  const { mediaPreview, fileNames, setMediaPreview, setFileNames } = useMediaPreviewStore();
  const getThirdStepValues = useCreateRecipeStore((state) => state.getThirdStepValues);

  const form = useForm({
    defaultValues: getThirdStepValues(),
    resolver: zodResolver(thirdStepSchema),
  });

  const { control, handleSubmit, setValue, getValues } = form;

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
          toast.error(`Only JPEG, JPG, PNG, and WebP allowed`);
          continue;
        }

        if (validateFileSize(file, MAX_IMAGE_SIZE_MB)) {
          toast.error(`Image must be under ${MAX_IMAGE_SIZE_MB}MB`);
          continue;
        }

        // const isValidDimensions = await validateImageDimensions(file);
        // if (!isValidDimensions) {
        //   toast.error(`Image dimensions must be smaller than ${MAX_WIDTH}x${MAX_HEIGHT}px`);
        //   continue;
        // }

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
      setValue(fieldType, [...(getValues(fieldType) || []), ...validFiles]);
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
          toast.error("Only JPEG, JPG, PNG, and WebP allowed");
          return;
        }

        if (validateFileSize(file, MAX_IMAGE_SIZE_MB)) {
          toast.error(`File must be under ${MAX_IMAGE_SIZE_MB}MB`);
          return;
        }

        // const isValidDimensions = await validateImageDimensions(file);
        // if (!isValidDimensions) {
        //   toast.error(`Image dimensions must be smaller than ${MAX_WIDTH}x${MAX_HEIGHT}px`);
        //   return;
        // }
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
      setValue(fieldType, file);
    }

    // Reset input field to allow re-uploading the same file
    event.target.value = "";
  };

  const handleRemoveMainPicture = async () => {
    setMediaPreview((prev) => ({
      ...prev,
      mainPictureUrl: null, // Restore original if it exists
    }));

    setFileNames((prev) => ({
      ...prev,
      mainPicture: null,
    }));

    setValue("mainPicture", recipe?.mainPictureUrl || null);
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

  // Console Errors
  useEffect(() => {
    if (form.formState.errors) {
      console.log("Form Errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  return (
    <div className="w-full max-w-[500px] rounded-lg border p-5">
      <Form {...form}>
        <form onSubmit={handleSubmit(onFormValidated)} className="flex flex-col gap-10">
          {/* Main Picture */}
          <MainPictureField
            control={control}
            mediaPreview={mediaPreview}
            fileNames={fileNames}
            handleFileUpload={handleFileUpload}
            handleRemoveMainPicture={handleRemoveMainPicture}
          />

          {/* Video Field */}
          <VideoUploadField
            control={control}
            mediaPreview={mediaPreview}
            fileNames={fileNames}
            handleFileUpload={handleFileUpload}
            handleRemoveVideo={handleRemoveVideo}
          />

          {/* Additional Pictures */}
          <AdditionalPicturesUploadField
            control={control}
            mediaPreview={mediaPreview}
            fileNames={fileNames}
            handleFileUpload={handleFileUpload}
            removeAdditionalPicture={removeAdditionalPicture}
          />

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
          {ConfirmDialog}
        </form>
      </Form>
    </div>
  );
};

export default StepThree;
