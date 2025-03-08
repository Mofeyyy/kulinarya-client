import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/useAuthStore";
import useSignupForm from "@/forms/useSignupForm";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LoginForm({ className, ...props }) {
  const { isLoading, apiError } = useAuthStore();
  const navigateTo = useNavigate();

  const {
    register,
    handleSubmit,
    isSubmitSuccessful,
    isSubmitting,
    onSubmit,
    isEmailHasError,
    isPassHasError,
    errorMessages,
  } = useSignupForm();

  //Finding error to the errorMessages array, the first error founded will be stored to the renderError variable, if no error, it will become undefined
  const renderError = errorMessages.find((error) => error.hasError);

  return (
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

      {renderError && (
        <InputPopupMessage message={renderError.message} isError={true} />
      )}
      {apiError && <InputPopupMessage message={apiError} isError={true} />}

      <div className="grid gap-6">
        <TextInputWithLabel
          label="email"
          id="emailInput"
          type="email"
          placeholder="m@example.com"
          register={register}
          isError={isEmailHasError ? true : false}
        />

        <div className="grid gap-1">
          <TextInputWithLabel
            label="password"
            id="passwordInput"
            type="password"
            register={register}
            isError={isPassHasError ? true : false}
          />

          <div className="flex justify-end">
            <p
              className="text-sm hover:text-primary transition cursor-pointer"
              onClick={() => navigateTo("/forgot-password")}
            >
              Forgot your password?
            </p>
          </div>
        </div>

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
      </div>

      <p className="text-center text-sm">
        Don't have an account?{" "}
        <span
          className="underline underline-offset-4 hover:text-primary transition cursor-pointer"
          onClick={() => navigateTo("/signup")}
        >
          Sign up
        </span>
      </p>
    </form>
  );
}

const TextInputWithLabel = ({
  id,
  type,
  placeholder,
  // for react-hook-form
  label,
  register,
  // for design
  isError,
}) => {
  return (
    <label className="grid gap-3">
      <p className="text-sm capitalize font-medium">{label}</p>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={` rounded-lg text-sm p-2 bg-white w-full border placeholder:text-muted-foreground text-black
            ${isError ? "border-2 border-red-500" : ""}`}
        {...register(label)}
      />
    </label>
  );
};

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
