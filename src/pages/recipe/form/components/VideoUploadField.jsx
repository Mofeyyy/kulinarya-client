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

const VideoUploadField = ({
  control,
  mediaPreview,
  fileNames,
  handleFileUpload,
  handleRemoveVideo,
  isDisabled,
}) => {
  return (
    <FormField
      control={control}
      name="video"
      render={() => (
        <FormItem>
          <Label htmlFor="video">Video Highlight</Label>
          <FormControl>
            <div className="flex w-full flex-col items-center">
              {mediaPreview.videoUrl && (
                <div className="relative mb-2 w-1/2">
                  <video controls className="w-full rounded-lg shadow-sm" preload="none">
                    <source src={mediaPreview.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  <Button
                    type="button"
                    variant="destructive"
                    className="absolute top-1 right-1 rounded-full text-white"
                    onClick={handleRemoveVideo}
                    disabled={isDisabled}
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
                disabled={isDisabled}
              />

              <Button asChild className="w-full" disabled={isDisabled}>
                <Label htmlFor="video" className="flex cursor-pointer items-center gap-1">
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
              <ol className="mt-2 list-disc">
                {fileNames.video && (
                  <li className="flex items-center justify-between text-sm">
                    {fileNames.video}
                    <button
                      type="button"
                      className="text-destructive ml-2 cursor-pointer text-xs hover:underline"
                      onClick={handleRemoveVideo}
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

export default VideoUploadField;
