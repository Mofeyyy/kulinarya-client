import { useSearchParams } from "react-router-dom";
import { useResetPasswordForm } from "@/pages/auth/components/ResetPasswordForm";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import API from "@/config/axios"; // Assuming you have API set up for your requests

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [isTokenValid, setIsTokenValid] = useState(true); // State to track token validity

  const {
    form,
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
  } = useResetPasswordForm(token);

  // Check token validity when the component mounts or when token changes
  useEffect(() => {
    document.title = "Reset Password | Kulinarya";

    if (token) {
      API.post("/auth/verify-reset-token", { token })
        .then(() => setIsTokenValid(true))
        .catch((err) => {
          console.error("Error verifying token:", err.response?.data?.message || err.message);
          setIsTokenValid(false); // Set the token as invalid
        });
    }
  }, [token]);

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0D0D0D] px-4 py-12">
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Link Expired or Invalid
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            The link you used is either invalid or has already expired.
            <br />
            Please request a new one to reset your password.
          </p>
          <Button
            onClick={() => window.location.href = "/forgot-password"}
            className="px-6 py-2 text-sm bg-[#F97316] hover:bg-[#EA580C] text-white"
          >
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-xl rounded-2xl bg-background">

        <CardHeader className="flex flex-col items-center space-y-4">
          <Logo className="size-20" />
          <div className="text-center">
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
              Enter your new password below.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="bg-white dark:bg-[#1A1A1A] text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#F97316] transition duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="px-6 py-2 text-sm mx-auto block bg-[#F97316] hover:bg-[#EA580C] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
