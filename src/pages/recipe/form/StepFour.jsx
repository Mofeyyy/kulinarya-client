// Imported Icons
import { ChevronRight, ChevronLeft } from "lucide-react";

// Imported Items For Forms
import useRecipeFormStore from "@/hooks/stores/useRecipeFormStore";

// Imported Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// -----------------------------------------------------------

const StepFour = ({ onBack, onSubmit }) => {
  const firstStepValues = useRecipeFormStore((state) => state.firstStepValues);
  const secondStepValues = useRecipeFormStore((state) => state.secondStepValues);
  const thirdStepValues = useRecipeFormStore((state) => state.thirdStepValues);

  return (
    <div className="flex w-full max-w-[500px] flex-col gap-5">
      <h2 className="text-2xl font-bold">Preview</h2>

      {/* First Step */}
      <Card className="text-foreground bg-transparent p-0">
        <CardContent className="flex flex-col gap-5 p-5">
          <p>
            <span className="font-semibold">Title:</span> {firstStepValues.title}
          </p>
          <p>
            <span className="font-semibold">Origin Province:</span> {firstStepValues.originProvince}
          </p>
          <p>
            <span className="font-semibold">Category:</span> {firstStepValues.foodCategory}
          </p>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {firstStepValues.description || "No description provided"}
          </p>
        </CardContent>
      </Card>

      {/* Second Step */}
      <Card className="text-foreground bg-transparent p-0">
        <CardContent className="flex flex-col p-5">
          <h2 className="text-lg font-semibold">Ingredients</h2>
          <ul className="list-inside list-disc">
            {secondStepValues.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.quantity} {ingredient.unit} - {ingredient.name}
              </li>
            ))}
          </ul>

          <h2 className="mt-5 text-lg font-semibold">Procedure</h2>
          <ol className="list-inside list-decimal">
            {secondStepValues.procedure.map((step, index) => (
              <li key={index}>{step.content}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Third Step */}
      <Card className="text-foreground bg-transparent p-0">
        <CardContent className="flex flex-col gap-5 p-5">
          {thirdStepValues.mainPicture && (
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Main Picture:</span>
              <img
                src={URL.createObjectURL(thirdStepValues.mainPicture)}
                alt="Main"
                className="w-full rounded-lg object-cover"
              />
            </div>
          )}

          {thirdStepValues.video && (
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Video:</span>
              <video controls className="w-full rounded-lg shadow-sm" preload="none">
                <source src={URL.createObjectURL(thirdStepValues.video)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {thirdStepValues.additionalPictures.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Additional Pictures:</span>
              <div className="grid grid-cols-3 gap-2">
                {thirdStepValues.additionalPictures.map((pic, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(pic)}
                    alt={`Additional ${index + 1}`}
                    className="w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between rounded-lg border p-5 shadow-sm">
        <Button type="button" onClick={onBack} variant="ghost" className="border !pr-4">
          <ChevronLeft />
          Previous
        </Button>
        <Button type="button" onClick={onSubmit} className="!pl-4">
          Submit
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default StepFour;
