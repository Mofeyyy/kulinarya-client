import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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

// Imported Forms
import useSignupForm from "@/forms/useSignupForm";

// Imported Assets
import Logo from "@/components/Logo";

// ----------------------------------------------------------------

const SignupForm = ({ className, ...props }) => {
  const {
    signupForm,
    control,
    handleSubmit,
    isSubmitting,
    onSubmit,
    isPending,
  } = useSignupForm();

  return (
    <Form {...signupForm}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <Logo className="self-center size-24 lg:hidden" />
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-2xl font-bold">Welcome to Kulinarya!</p>

          <p className="text-muted-foreground text-sm text-balance">
            Signup and share your amazing Filipino recipes!
          </p>
        </div>

        {/* First Name Input */}
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Sean" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name Input */}
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Bakal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Input */}
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || isPending}
          className={cn("w-full bg-primary", {
            "opacity-50": isSubmitting || isPending,
          })}
        >
          {isSubmitting || isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Signup"
          )}
        </Button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/signup"
            className="underline underline-offset-4 hover:opacity-80 transition"
          >
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignupForm;
