import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/authSchema";
import useAuthStore from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const useSignupForm = () => {
  const { login } = useAuthStore();
  const navigateTo = useNavigate();

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isSubmitting },
  } = loginForm;

  const onSubmit = async (data) => {
    console.log(data);

    const { email, password } = data;
    const result = await login(email, password);

    if (result.success) {
      toast.success("Login Success!");
      navigateTo("/");
      reset();
    }

    reset();
    document.querySelector(".emailInput").focus();
  };

  return {
    loginForm,
    control,
    handleSubmit,
    isSubmitSuccessful,
    isSubmitting,
    onSubmit,
  };
};

export default useSignupForm;
