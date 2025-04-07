import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../../../../kulinarya-server/src/validations/userValidations";
import API from "@/config/axios";
import toast from "react-hot-toast";

export const useForgotPasswordForm = () => {
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data) => {
    try {
      await API.post("/auth/forgot-password", data);
      toast.success("Reset link sent! Please check your email.", {
        duration: 10000, // Show toast for 10 seconds
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.", {
        duration: 10000, // Show error toast for 10 seconds
      });
    }
  };

  return { form, control, handleSubmit, onSubmit, isSubmitting };
};
