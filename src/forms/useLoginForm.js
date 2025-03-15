import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/authSchema";
import useAuthStore from "@/hooks/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useLoginMutation from "@/hooks/mutations/useLoginMutation";
import { useQueryClient } from "@tanstack/react-query";

// ----------------------------------------------------------------

const useLoginForm = () => {
  const { mutate, isPending } = useLoginMutation();
  const { login } = useAuthStore();
  const queryClient = useQueryClient();
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
    formState: { isSubmitting },
    setFocus,
  } = loginForm;

  const onSubmit = async (data) => {
    mutate(data, {
      onSuccess: () => {
        login(data.user); // Set isLoggedIn and userDetails State
        queryClient.setQueryData(["userDetails"], data.user); // Update React Query Cache
        toast.success("Login Success!");
        navigateTo("/");
        reset();
      },
      onError: (error) => {
        toast.error(error?.message || "Login Failed! Please try again.");
        setFocus("email");
        reset();
      },
    });
  };

  return {
    loginForm,
    control,
    handleSubmit,
    isSubmitting,
    onSubmit,
    isPending,
  };
};

export default useLoginForm;
