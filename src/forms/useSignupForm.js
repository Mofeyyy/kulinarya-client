import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/authSchema";
import { useNavigate } from "react-router-dom";
import useSignupMutation from "@/hooks/mutations/useSignupMutation";

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

  const { control, handleSubmit, reset, setFocus, formState } = signupForm;

  const onSubmit = async (data, onSuccessCallback) => {
    const { email, password, firstName, lastName } = data;

    mutate(
      { email, password, firstName, lastName },
      {
        onSuccess: () => {
          reset();
          if (onSuccessCallback) onSuccessCallback(); // Call success handler
        },
        onError: () => {
          setFocus("firstName");
          reset();
        },
      },
    );
  };

  return {
    signupForm,
    control,
    handleSubmit,
    onSubmit,
    isPending,
    isSubmitting: formState.isSubmitting,
  };
};

export default useSignupForm;
