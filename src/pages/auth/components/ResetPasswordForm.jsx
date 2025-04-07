import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../../../../kulinarya-server/src/validations/userValidations";
import API from "@/config/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useResetPasswordForm = (token) => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "" },
    mode: "onChange",
  });

  const { control, handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = async (data) => {
    try {
      await API.post(`/auth/reset-password?token=${token}`, data);
      toast.success("Password has been reset. You can now log in.");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong.";
      toast.error(message);
    }
  };

  return { form, control, handleSubmit, onSubmit, isSubmitting };
};
