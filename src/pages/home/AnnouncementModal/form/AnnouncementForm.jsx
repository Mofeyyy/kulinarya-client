import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAnnouncementSchema } from "@/schemas/createAnnouncementSchema";

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
          className="w-full px-3 py-2 border rounded-md bg-background text-sm"
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
          className="w-full px-3 py-2 border rounded-md resize-none bg bg-background text-sm"
        />
        {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-all focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
};

export default AnnouncementForm;
