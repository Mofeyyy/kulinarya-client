import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Imported Hooks
import useCreateRecipe from "@/hooks/mutations/useCreateRecipe";
import useUpdateRecipe from "@/hooks/mutations/useUpdateRecipe";
import useConfirmDialog from "@/components/useConfirmDialog";

// Imported Items For Forms
import useRecipeFormStore from "@/hooks/stores/useRecipeFormStore";
import { recipeDefaultValues } from "@/hooks/stores/useRecipeFormStore";
import useMediaPreviewStore from "@/hooks/stores/useMediaPreviewStore";

// Imported Components
import { Stepper } from "@/components/ui/stepper";

// Imported Custom Components
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";

// Imported Helpers
import { isFormStepChanged, convertToWebP } from "@/helpers/formHelpers";

// Contants
const steps = [
  { stepNumber: 1, title: "Step 1", description: "Describe your recipe" },
  { stepNumber: 2, title: "Step 2", description: "Teach us how to make it" },
  { stepNumber: 3, title: "Step 3", description: "Show us some media" },
  { stepNumber: 4, title: "Step 4", description: "Confirm and finish" },
];

// -----------------------------------------------------------

const SampleForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { openDialog, ConfirmDialog } = useConfirmDialog();
  const firstStepValues = useRecipeFormStore((state) => state.firstStepValues);
  const secondStepValues = useRecipeFormStore((state) => state.secondStepValues);
  const thirdStepValues = useRecipeFormStore((state) => state.thirdStepValues);
  const setFirstStepValues = useRecipeFormStore((state) => state.setFirstStepValues);
  const setSecondStepValues = useRecipeFormStore((state) => state.setSecondStepValues);
  const setThirdStepValues = useRecipeFormStore((state) => state.setThirdStepValues);
  const clearStepsValues = useRecipeFormStore((state) => state.clearStepsValues);
  const resetAllMediaPreview = useMediaPreviewStore((state) => state.resetAllMediaPreview);
  const navigateTo = useNavigate();

  const { mutateAsync: createRecipe, isPending: isCreating } = useCreateRecipe();

  const tabs = [
    <StepOne
      defaultValue={firstStepValues}
      onFormValidated={(data) => {
        setFirstStepValues(data);
        setCurrentStep(1);
      }}
    />,

    <StepTwo
      onFormValidated={(data) => {
        setSecondStepValues(data);
        setCurrentStep(2);
      }}
      onBack={() => setCurrentStep(0)}
    />,

    <StepThree
      onFormValidated={async (data) => {
        // Convert images to WebP
        const convertedMainPicture = await convertToWebP(data.mainPicture);
        const convertedAdditionalPictures = await Promise.all(
          data.additionalPictures.map((file) => convertToWebP(file)),
        );
        // Update form data with converted images
        setThirdStepValues({
          ...data,
          mainPicture: convertedMainPicture,
          additionalPictures: convertedAdditionalPictures,
        });
        setCurrentStep(3);
      }}
      onBack={() => setCurrentStep(1)}
    />,

    <StepFour
      onSubmit={async () => {
        try {
          const recipeData = { ...firstStepValues, ...secondStepValues, ...thirdStepValues };
          const confirm = await openDialog(
            "Create Recipe",
            "Are you sure you want to create this recipe?",
          );

          if (confirm) {
            await toast.promise(createRecipe(recipeData), {
              loading: "Creating recipe...",
              success: "Recipe created successfully! Wait for moderation.",
              error: "Failed to create recipe. Please try again.",
            });
            clearStepsValues();
            resetAllMediaPreview();
            setCurrentStep(0);
            navigateTo("/recipes");
          }
        } catch (error) {
          console.error("Error creating recipe:", error);
        }
      }}
      onBack={() => setCurrentStep(2)}
    />,
  ];

  // Log the form data
  useEffect(() => {
    console.log("First Step Values:", firstStepValues);
    console.log("Second Step Values:", secondStepValues);
    console.log("Third Step Values:", thirdStepValues);
  }, [firstStepValues, secondStepValues, thirdStepValues]);

  // Prompt the user before leaving the page if there is any unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const hasUnsavedChanges =
        isFormStepChanged(firstStepValues, recipeDefaultValues.firstStepValues) ||
        isFormStepChanged(secondStepValues, recipeDefaultValues.secondStepValues) ||
        isFormStepChanged(thirdStepValues, recipeDefaultValues.thirdStepValues);

      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [firstStepValues, secondStepValues, thirdStepValues]);

  // Remove all data from the store when the component unmounts
  useEffect(() => {
    return () => {
      clearStepsValues();
      resetAllMediaPreview();
    };
  }, []);

  return (
    <div className="container pb-10">
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        hasControlButtons={false}
      />

      {/* Steps Content */}
      <div className="mt-10 flex w-full justify-center pb-10">{tabs[currentStep]}</div>
      {ConfirmDialog}
    </div>
  );
};

// ! ----------------------------------------------------------

export default SampleForm;
