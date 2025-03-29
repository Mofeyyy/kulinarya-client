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
import { Upload, Trash2 } from "lucide-react";

// -------------------------------------------------------------

const AdditionalPicturesUploadField = ({
  control,
  mediaPreview,
  fileNames,
  handleFileUpload,
  removeAdditionalPicture,
  isDisabled,
}) => {
  return (
    <FormField
      control={control}
      name="additionalPictures"
      render={() => (
        <FormItem>
          <Label htmlFor="additionalPictures">Additional Pictures</Label>
          <FormControl>
            <div className="flex w-full flex-col items-center">
              {/* Preview Grid */}
              <div className="mb-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {mediaPreview.additionalPicturesUrls.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`Additional Preview ${index + 1}`}
                      className="rounded-md border object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      className="absolute top-1 right-1 rounded-full text-white"
                      onClick={() => removeAdditionalPicture(index)}
                      disabled={isDisabled}
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
                  handleFileUpload(e, "additionalPicturesUrls", "additionalPictures")
                }
                disabled={isDisabled}
              />

              {/* Upload Button */}

              <Button asChild className="w-full" disabled={isDisabled}>
                <Label
                  htmlFor="additionalPictures"
                  className="flex cursor-pointer items-center gap-1"
                >
                  <Upload className="size-5" /> Upload
                </Label>
              </Button>

              {/* File Names List */}
              <ol className="mt-2 list-disc">
                {fileNames.additionalPictures.length > 0 &&
                  fileNames.additionalPictures.map((name, index) => (
                    <li key={index} className="flex items-center justify-between text-sm">
                      {name}
                      <button
                        type="button"
                        className="text-destructive ml-2 cursor-pointer text-xs hover:underline"
                        onClick={() => removeAdditionalPicture(index)}
                        disabled={isDisabled}
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

export default AdditionalPicturesUploadField;
