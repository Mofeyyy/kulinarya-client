import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Imported Icons
import { LoaderCircle } from "lucide-react";

// Imported Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Imported Stores
import useAuthStore from "@/stores/useAuthStore";

// Imported Forms
import useSignupForm from "@/forms/useSignupForm";

// ----------------------------------------------------------------

export function LoginForm({ className, ...props }) {
  const { isLoading, apiError } = useAuthStore();
  const navigateTo = useNavigate();

  const {
    loginForm,
    control,
    handleSubmit,
    isSubmitSuccessful,
    isSubmitting,
    onSubmit,
  } = useSignupForm();

  return (
    <Form {...loginForm}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-2xl font-bold">Login to your account</p>

          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        {/* Email Input */}
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  id="emailInput"
                  type="email"
                  placeholder="m@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel>Password</FormLabel>

                <p
                  className="text-sm underline-offset-4 hover:underline cursor-pointer"
                  onClick={() => navigateTo("/forgot-password")}
                >
                  Forgot your password?
                </p>
              </div>

              <FormControl>
                <Input id="passwordInput" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="w-full bg-primary"
        >
          {isLoading || isSubmitting ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Login"
          )}
        </Button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <span
            className="underline underline-offset-4 hover:opacity-80 transition cursor-pointer"
            onClick={() => navigateTo("/signup")}
          >
            Sign up
          </span>
        </p>

        {apiError && <InputPopupMessage message={apiError} isError={true} />}
      </form>
    </Form>
  );
}

const InputPopupMessage = ({ message, isError }) => {
  return (
    <div
      className={`w-full border-2 px-3 py-3 rounded-lg text-sm ${
        isError ? `border-red-600 bg-red-200 ` : `border-green-600 bg-green-300`
      }  `}
    >
      <p
        className={`font-medium ${isError ? "text-red-600" : "text-green-600"}`}
      >
        {message}
      </p>
    </div>
  );
};
