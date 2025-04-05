import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAnnouncementSchema } from "../../../../../../kulinarya-server/src/validations/announcementValidation";

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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          {...register("title")}
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-sm"
        />
        {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Content
        </label>
        <textarea
          {...register("content")}
          rows={4}
          className="w-full px-3 py-2 border rounded-md resize-none bg-white dark:bg-gray-700 text-sm"
        />
        {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default AnnouncementForm;
