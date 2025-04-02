import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Upload, Trash2, SquarePen } from "lucide-react";

// -------------------------------------------------------------

const MainPictureField = ({
  control,
  mediaPreview,
  fileNames,
  handleFileUpload,
  handleRemoveMainPicture,
  isDisabled,
}) => {
  return (
    <FormField
      control={control}
      name="mainPicture"
      render={() => (
        <FormItem>
          <Label htmlFor="mainPicture">Main Picture</Label>
          <FormControl>
            <div className="flex w-full flex-col items-center">
              {mediaPreview.mainPictureUrl && (
                <div className="relative mb-2 w-1/2">
                  <img
                    src={mediaPreview.mainPictureUrl}
                    alt="Main Preview"
                    className="rounded-lg object-cover shadow-sm"
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    className="absolute top-1 right-1 rounded-full text-white"
                    onClick={handleRemoveMainPicture}
                    disabled={isDisabled}
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
                onChange={(e) => handleFileUpload(e, "mainPictureUrl", "mainPicture")}
                disabled={isDisabled}
              />

              <Button asChild className="w-full" disabled={isDisabled}>
                <Label htmlFor="mainPicture" className="flex cursor-pointer items-center gap-1">
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
              <ol className="mt-2 list-disc">
                {fileNames.mainPicture && (
                  <li className="flex items-center justify-between text-sm">
                    {fileNames.mainPicture}
                    <button
                      type="button"
                      className="text-destructive ml-2 cursor-pointer text-xs hover:underline"
                      onClick={handleRemoveMainPicture}
                      disabled={isDisabled}
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

export default MainPictureField;
