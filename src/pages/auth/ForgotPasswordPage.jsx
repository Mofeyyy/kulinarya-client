import { Link, useNavigate } from "react-router-dom";  // Import useNavigate
import { CircleArrowLeft } from "lucide-react";
import { useForgotPasswordForm } from "@/pages/auth/components/ForgotPasswordForm";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import Logo from "@/components/Logo";

export default function ForgotPasswordPage() {
  const { form, control, handleSubmit, onSubmit, isSubmitting } = useForgotPasswordForm();
  const navigate = useNavigate();  // Initialize useNavigate

  const handleFormSubmit = async (data) => {
    // Handle the password reset logic asynchronously
    await onSubmit(data);  // Wait for onSubmit to finish

    // After the submission is completed, navigate to /login after a delay of 10 seconds
    setTimeout(() => {
      navigate("/login"); // Navigate to login page after 10 seconds
    }, 10000); // 10 seconds delay
  };

  document.title = "Forgot Password | Kulinarya";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-10">
      {/* Back Button */}
      <Link to="/login" className="absolute top-15 left-65 flex items-center">
        <CircleArrowLeft className="size-10 sm:size-12 hover:text-primary transition" />
        <span className="ml-2 text-gray-900 dark:text-white">Back</span>
      </Link>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow p-8 space-y-6">
        <Logo className="mx-auto size-20" />
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
          <p className="text-sm text-muted-foreground dark:text-gray-400">Enter your email to receive a reset link</p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                      className="bg-white dark:bg-gray-700"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                className="px-6 py-2 text-sm"
                disabled={isSubmitting} // Disable button while submitting
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" /> // Show loader while submitting
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
