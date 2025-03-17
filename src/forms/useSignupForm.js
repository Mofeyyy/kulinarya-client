import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/authSchema";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useSignupMutation from "@/hooks/mutations/useSignupMutation";

// ----------------------------------------------------------------

const useSignupForm = () => {
  const { mutate, isPending } = useSignupMutation();
  const navigateTo = useNavigate();

  const signupForm = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
    resolver: zodResolver(signupSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { isSubmitting },
  } = signupForm;

  const onSubmit = async (data) => {
    const { email, password, firstName, lastName } = data;

    mutate(
      { email, password, firstName, lastName },
      {
        onSuccess: () => {
          toast.success("Signup Success!, Please verify your email.");
          navigateTo("/");
          reset();
        },
        onError: (error) => {
          toast.error(error?.message || "Signup Failed! Please try again.");
          setFocus("firstName");
          reset();
        },
      }
    );
  };

  return {
    signupForm,
    control,
    handleSubmit,
    isSubmitting,
    onSubmit,
    isPending,
  };
};

export default useSignupForm;
