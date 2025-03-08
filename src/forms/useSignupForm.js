import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/authSchema";
import useAuthStore from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const useSignupForm = () => {
  const { login } = useAuthStore();
  const navigateTo = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    const result = await login(data.email, data.password);

    if (result.success) {
      toast.success("Login Success!");
      navigateTo("/");
      reset();
    }

    reset();
    document.querySelector("#emailInput").focus();
  };

  // For code readability
  // Note: the "!!" or double negation converts to its boolean value to ensure that the value is boolean
  // Note: the "?" or optional chaining prevents runtime error if the property that we will access is null or undefined
  const isEmailHasError = !!errors.email;
  const isPassHasError = !!errors.password;

  const emailErrorMessage = errors.email?.message;
  const passErrorMessage = errors.password?.message;

  // Array object for rendering
  const errorMessages = [
    { hasError: isEmailHasError, message: emailErrorMessage },
    { hasError: isPassHasError, message: passErrorMessage },
  ];

  return {
    register,
    handleSubmit,
    isSubmitSuccessful,
    isSubmitting,
    onSubmit,
    isEmailHasError,
    isPassHasError,
    errorMessages,
  };
};

export default useSignupForm;
