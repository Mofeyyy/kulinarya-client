import { cn } from "@/lib/utils";
import { useFieldArray } from "react-hook-form";
import useRecipeForm from "@/forms/useRecipeForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Upload,
  Trash2,
  Plus,
  SquarePen,
  LoaderCircle,
  Dot,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import useProvinces from "@/hooks/queries/useProvinces";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { groupByIsland } from "@/utils/recipeUtils";
import { recipeCategories } from "@/constants/recipeConstants";
import useMediaPreviewStore from "@/hooks/stores/useMediaPreviewStore";

// -------------------------------------------------------------

const CreateRecipeForm = () => {
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
  } = useRecipeForm();

  const {
    fields: ingredientFields,
    append: addIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const { mediaPreview, fileNames, setMediaPreview, setFileNames } =
    useMediaPreviewStore();

  const { procedureFields, addProcedure, removeProcedure } =
    useProcedureFieldArray(control, setValue, getValues);

  const handleFileUpload = (event, type, fieldType) => {
    const files = event.target.files;
    if (!files?.length) return;

    if (type === "additionalPicturesUrls") {
      const newFiles = Array.from(files).slice(
        0,
        5 - mediaPreview.additionalPicturesUrls.length
      );

      setMediaPreview((prev) => ({
        ...prev,
        additionalPicturesUrls: [
          ...prev.additionalPicturesUrls,
          ...newFiles.map((file) => URL.createObjectURL(file)),
        ],
      }));

      setFileNames((prev) => ({
        ...prev,
        additionalPictures: [
          ...prev.additionalPictures,
          ...newFiles.map((f) => f.name),
        ],
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

      console.log(file);

      // Set the file in react-hook-form
      setValue(fieldType, file);
    }

    // Reset input field to allow re-uploading the same file
    event.target.value = "";
  };

  const handleRemoveMainPicture = () => {
    setMediaPreview((prev) => ({
      ...prev,
      mainPictureUrl: null,
    }));

    setFileNames((prev) => ({
      ...prev,
      mainPicture: null,
    }));

    setValue("mainPicture", null);
  };

  const handleRemoveVideo = () => {
    setMediaPreview((prev) => ({
      ...prev,
      videoUrl: null,
    }));

    setFileNames((prev) => ({
      ...prev,
      video: null,
    }));

    setValue("video", null);
  };

  const removeAdditionalPicture = (index) => {
    setMediaPreview((prev) => ({
      ...prev,
      additionalPicturesUrls: prev.additionalPicturesUrls.filter(
        (_, i) => i !== index
      ),
    }));

    setFileNames((prev) => ({
      ...prev,
      additionalPictures: prev.additionalPictures.filter((_, i) => i !== index),
    }));

    // Remove the file from react-hook-form state
    setValue(
      "additionalPictures",
      (getValues("additionalPictures") || []).filter((_, i) => i !== index)
    );
  };

  // FOR DEBUGGING - useForm Errors
  useEffect(() => {
    console.log("Form Errors:", recipeForm.formState.errors);
  }, [recipeForm.formState.errors]);

  return (
    <Form {...recipeForm}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-10 lg:grid lg:grid-cols-2 xl:gap-14 2xl:gap-20"
      >
        {/* Left Side Fields */}
        <div className="w-full flex flex-col gap-10">
          {/* Title Field */}
          <CustomInputField
            control={control}
            name="title"
            formLabel="Recipe Title"
            inputPlaceholder="Recipe Name"
          />

          {/* Food Origin and Category */}
          <div className="flex flex-col gap-10 xl:grid xl:grid-cols-2 2xl:gap-20">
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
          </div>

          {/* Description Field */}
          <CustomTextAreaField
            control={control}
            name="description"
            formLabel="Description"
            textAreaPlaceholder="Description"
          />

          {/* Ingredients  Field */}
          <IngredientsFieldArray
            control={control}
            ingredientFields={ingredientFields}
            addIngredient={addIngredient}
            removeIngredient={removeIngredient}
          />

          {/* Procedure Field */}
          <ProcedureFieldArray
            control={control}
            procedureFields={procedureFields}
            addProcedure={addProcedure}
            removeProcedure={removeProcedure}
          />
        </div>

        {/* Right Side Fields */}
        <div className="w-full flex flex-col gap-10">
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
        </div>

        {/* Submit Button */}
        <div className="md:col-start-1 md:col-end-3 flex justify-center items-center">
          <Button
            type="submit"
            disabled={isSubmitting || isPending}
            className={cn("w-full lg:w-1/2 bg-primary ", {
              "opacity-50": isSubmitting || isPending,
            })}
          >
            {isSubmitting || isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

// ! Custom Components To Be Moved Soon -----------------------------------------

const AdditionalPicturesUploadField = ({
  control,
  mediaPreview,
  fileNames,
  handleFileUpload,
  removeAdditionalPicture,
}) => {
  return (
    <FormField
      control={control}
      name="additionalPictures"
      render={() => (
        <FormItem>
          <Label htmlFor="additionalPictures">Additional Pictures</Label>
          <FormControl>
            <div className="w-full flex flex-col items-center">
              {/* Preview Grid */}
              <div className="mb-2 grid grid-cols-3 sm:grid-cols-5 gap-2">
                {mediaPreview.additionalPicturesUrls.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt={`Additional Preview ${index + 1}`}
                      className="object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      className="absolute top-1 right-1 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      onClick={() => removeAdditionalPicture(index)}
                    >
                      <Trash2 className="size-5" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* File Input */}
              <Input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="additionalPictures"
                onChange={(e) =>
                  handleFileUpload(
                    e,
                    "additionalPicturesUrls",
                    "additionalPictures"
                  )
                }
              />

              {/* Upload Button */}
              <Button asChild className="w-full">
                <Label
                  htmlFor="additionalPictures"
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="size-5" /> Upload
                </Label>
              </Button>

              {/* File Names List */}
              <ol className="list-disc mt-2">
                {fileNames.additionalPictures.length > 0 &&
                  fileNames.additionalPictures.map((name, index) => (
                    <li
                      key={index}
                      className="text-sm flex justify-between items-center"
                    >
                      {name}
                      <button
                        type="button"
                        className="ml-2 text-destructive hover:underline cursor-pointer text-xs"
                        onClick={() => removeAdditionalPicture(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
              </ol>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const VideoUploadField = ({
  control,
  mediaPreview,
  fileNames,
  handleFileUpload,
  handleRemoveVideo,
}) => {
  return (
    <FormField
      control={control}
      name="video"
      render={() => (
        <FormItem>
          <Label htmlFor="video">Video Highlight</Label>
          <FormControl>
            <div className="w-full flex flex-col items-center">
              {mediaPreview.videoUrl && (
                <div className="mb-2 w-1/2 relative group">
                  <video
                    src={mediaPreview.videoUrl}
                    controls
                    className="rounded-lg shadow-sm"
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    className="absolute top-1 right-1 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    onClick={handleRemoveVideo}
                  >
                    <Trash2 className="size-5" />
                  </Button>
                </div>
              )}

              <Input
                type="file"
                accept="video/*"
                className="hidden"
                id="video"
                onChange={(e) => handleFileUpload(e, "videoUrl", "video")}
              />

              <Button asChild className="w-full">
                <Label
                  htmlFor="video"
                  className="flex items-center gap-1 cursor-pointer"
                >
                  {mediaPreview.videoUrl ? (
                    <>
                      <SquarePen className="size-5" /> Change
                    </>
                  ) : (
                    <>
                      <Upload className="size-5" /> Upload
                    </>
                  )}
                </Label>
              </Button>

              <ol className="list-disc mt-2">
                {fileNames.video && (
                  <li className="text-sm flex justify-between items-center">
                    {fileNames.video}
                    <button
                      type="button"
                      className="ml-2 text-destructive hover:underline cursor-pointer text-xs"
                      onClick={handleRemoveVideo}
                    >
                      Remove
                    </button>
                  </li>
                )}
              </ol>
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const MainPictureField = ({
  control,
  mediaPreview,
  fileNames,
  handleFileUpload,
  handleRemoveMainPicture,
}) => {
  return (
    <FormField
      control={control}
      name="mainPicture"
      render={() => (
        <FormItem>
          <Label htmlFor="mainPicture">Main Picture</Label>
          <FormControl>
            <div className="w-full flex flex-col items-center">
              {mediaPreview.mainPictureUrl && (
                <div className="mb-2 w-1/2 relative group">
                  <img
                    src={mediaPreview.mainPictureUrl}
                    alt="Main Preview"
                    className="object-cover rounded-lg shadow-sm"
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    className="absolute top-1 right-1 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    onClick={handleRemoveMainPicture}
                  >
                    <Trash2 className="size-5" />
                  </Button>
                </div>
              )}

              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="mainPicture"
                onChange={(e) =>
                  handleFileUpload(e, "mainPictureUrl", "mainPicture")
                }
              />

              <Button asChild className="w-full">
                <Label
                  htmlFor="mainPicture"
                  className="flex items-center gap-1 cursor-pointer"
                >
                  {mediaPreview.mainPictureUrl ? (
                    <>
                      <SquarePen className="size-5" /> Change
                    </>
                  ) : (
                    <>
                      <Upload className="size-5" /> Upload
                    </>
                  )}
                </Label>
              </Button>

              <ol className="list-disc mt-2">
                {fileNames.mainPicture && (
                  <li className="text-sm flex justify-between items-center">
                    {fileNames.mainPicture}
                    <button
                      type="button"
                      className="ml-2 text-destructive hover:underline cursor-pointer text-xs"
                      onClick={handleRemoveMainPicture}
                    >
                      Remove
                    </button>
                  </li>
                )}
              </ol>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

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
      }))
    );
  };

  return { procedureFields, addProcedure, removeProcedure };
};

const ProcedureFieldArray = ({
  control,
  procedureFields,
  addProcedure,
  removeProcedure,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Label>Procedure</Label>
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
                    className={`font-semibold text-sm ${
                      fieldState.invalid && "text-destructive"
                    }`}
                  >
                    {index + 1}.
                  </p>
                  <Input
                    placeholder="Step description"
                    {...field}
                    className={`${
                      fieldState.invalid &&
                      "border-destructive focus:outline-destructive"
                    }`}
                  />
                  {/* Delete Button */}
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeProcedure(index)}
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
        onClick={() =>
          addProcedure({ stepNumber: procedureFields.length + 1, content: "" })
        }
      >
        <Plus className="size-5" />
      </Button>
    </div>
  );
};

const IngredientsFieldArray = ({
  control,
  ingredientFields,
  addIngredient,
  removeIngredient,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Label>Ingredients</Label>
      {ingredientFields.map((field, index) => (
        <div key={field.id} className="w-full flex gap-2 items-center">
          <Dot />

          <div className="w-full flex flex-col md:max-lg:flex-row xl:flex-row items-center gap-2">
            {/* Ingredient Name */}
            <CustomInputField
              control={control}
              name={`ingredients.${index}.name`}
              inputPlaceholder="Ingredient Name"
              className="w-full xl:flex-1"
              hasErrorMessage={false}
            />

            <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:max-lg:flex md:max-lg:w-auto xl:flex xl:w-auto gap-3">
              {/* Quantity */}
              <CustomInputField
                control={control}
                name={`ingredients.${index}.quantity`}
                inputPlaceholder="Quantity"
                className="w-full md:max-lg:w-28 xl:w-28"
                type="number"
                hasErrorMessage={false}
              />
              {/* Unit */}
              <CustomSelectField
                control={control}
                name={`ingredients.${index}.unit`}
                Component={FormSelectUnit}
                className="w-full md:max-lg:w-28 xl:w-28"
                hasErrorMessage={false}
              />

              {/* Delete Button */}
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeIngredient(index)}
                className="w-full col-start-1 col-end-3 sm:col-start-3 sm:col-end-3 sm:w-auto"
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
      >
        <Plus className="size-5" />
      </Button>
    </div>
  );
};

const CustomInputField = ({
  control,
  type,
  name,
  formLabel,
  inputPlaceholder,
  className,
  hasErrorMessage = true,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>
            <Input type={type} placeholder={inputPlaceholder} {...field} />
          </FormControl>
          {hasErrorMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
};

const CustomTextAreaField = ({
  control,
  name,
  formLabel,
  textAreaPlaceholder,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{formLabel}</FormLabel>
          <FormControl>
            <Textarea placeholder={textAreaPlaceholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const CustomSelectField = ({
  control,
  name,
  formLabel,
  Component,
  className,
  hasErrorMessage = true,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {formLabel && (
            <Label
              htmlFor={field.name}
              data-error={!!fieldState.error}
              className="data-[error=true]:text-destructive-foreground text-foreground"
            >
              {formLabel}
            </Label>
          )}
          <FormControl>
            <Component
              field={field}
              error={fieldState.error}
              className={className}
            />
          </FormControl>
          {hasErrorMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
};

const FormSelectRecipeOrigin = ({ field, error, className }) => {
  const { data: provinces, isLoading, isError } = useProvinces();
  const groupedProvinces = groupByIsland(provinces);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load provinces. Refresh the page.");
    }
  }, [isError]);

  return (
    <Select
      value={field.value}
      defaultValue={field.value}
      onValueChange={field.onChange}
      disabled={isLoading || isError}
    >
      <SelectTrigger
        id={field.name}
        data-error={!!error}
        className={cn("w-full", error && "border-destructive", className)}
      >
        <SelectValue placeholder={isLoading ? "Loading..." : "Origin"} />
      </SelectTrigger>
      <SelectContent>
        {groupedProvinces &&
          Object.entries(groupedProvinces).map(([island, provinces]) => (
            <SelectGroup key={island}>
              <SelectLabel className="text-primary text-base capitalize">
                {island}
              </SelectLabel>
              {provinces.map((province) => (
                <SelectItem
                  key={province.code}
                  value={province.name}
                  className="cursor-pointer"
                >
                  {province.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
      </SelectContent>
    </Select>
  );
};

const FormSelectFoodCategory = ({ field, error, className }) => {
  return (
    <Select
      value={field.value}
      defaultValue={field.value}
      onValueChange={field.onChange}
    >
      <SelectTrigger
        id={field.name}
        className={cn("w-full", error && "border-destructive", className)}
      >
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {recipeCategories.map(({ label, value }) => (
            <SelectItem
              key={value}
              value={value}
              className="capitalize cursor-pointer"
            >
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const FormSelectUnit = ({ field, error, className }) => {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger
        className={cn("w-28", error && "border-destructive", className)}
      >
        <SelectValue placeholder="Unit" />
      </SelectTrigger>
      <SelectContent>
        {["g", "kg", "ml", "l", "cup", "tbsp", "tsp", "pcs"].map((unit) => (
          <SelectItem value={unit} key={unit}>
            {unit}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CreateRecipeForm;
