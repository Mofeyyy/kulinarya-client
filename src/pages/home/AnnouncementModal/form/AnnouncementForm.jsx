import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAnnouncementSchema } from "@/schemas/announcementValidation";

const AnnouncementForm = ({ onSubmit, defaultValues = {} }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues,
  });

  const onFormSubmit = (data) => {
    console.log("Form Submitted with Data: ", data); // Add logging here
    onSubmit(data); // Make sure the onSubmit is being called correctly
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          {...register("title")}
          className="w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-gray-700"
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Content
        </label>
        <textarea
          {...register("content")}
          rows={4}
          className="w-full resize-none rounded-md border bg-white px-3 py-2 text-sm dark:bg-gray-700"
        />
        {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default AnnouncementForm;
