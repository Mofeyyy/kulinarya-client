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
    // Debug log to check data sent
    console.log("Login request data:", data);
  
    mutate(data, {
      onSuccess: (response) => {
        // Debug log for the actual server response
        console.log("Server response:", response);
  
        const user = response?.data?.user;
  
        if (!user) {
          toast.error("Invalid response from server.");
          return;
        }
  
        // Log the email verification status to debug
        console.log("User email verification status:", user.isEmailVerified);
  
        // Check if email is verified
        if (user.isEmailVerified === false) {
          toast.error("Please verify your email before logging in.");
          navigateTo("/resend-verification");
          return;
        }
  
        // If the email is verified, login the user and redirect
        login(user); // Update user in auth store
        queryClient.setQueryData(["userDetails"], user);
        toast.success("Login Success!", { duration: 5000 });
  
        // Check if userDetails and isLoggedIn are updated in the store
        console.log("User logged in:", user);
        console.log("Auth Store State:", useAuthStore.getState());
  
        // Add a slight delay to ensure the state has updated before navigation
        setTimeout(() => {
          navigateTo("/");  // Redirect to homepage or appropriate page
        }, 500);  // Delay to ensure the login state is properly updated
        reset();  // Reset the form
      },
  
      onError: (error) => {
        toast.error(error?.message || "Login Failed! Please try again.", {
          duration: 5000,
        });
        setFocus("email");
        reset();  // Reset the form on error
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
