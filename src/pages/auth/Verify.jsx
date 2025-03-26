import { CircleArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import useVerifyEmail from "@/hooks/queries/useVerifyEmail";
import { useEffect, useState } from "react";
import VerifyStatusMessage from "./components/VerifyStatusMessage";

// --------------------------------------------------------------------

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigateTo = useNavigate();
  const [countdown, setCountdown] = useState(10); // Countdown starts at 10 seconds

  useEffect(() => {
    document.title = "Verify | Kulinarya";

    if (!token) {
      navigateTo("/");
    }
  }, [token, navigateTo]);

  const { isLoading, isError, error, isSuccess } = useVerifyEmail(token);

  useEffect(() => {
    if (isError) {
      setTimeout(() => navigateTo("/"), 4000);
    }

    if (isSuccess) {
      // Start countdown timer
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigateTo("/login"); // Redirect after countdown ends
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [isError, isSuccess, navigateTo]);

  return (
    <div className="grid min-h-svh">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Link to="/">
          <CircleArrowLeft className="size-10 sm:size-12 hover:text-primary transition" />
        </Link>

        <VerifyStatusMessage
          isLoading={isLoading}
          isError={isError}
          error={error}
        />

        {isSuccess && (
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Redirecting to login page in{" "}
              <span className="font-semibold text-primary">{countdown}</span> seconds...
            </p>
            <Link
              to="/login"
              className="inline-block mt-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
            >
              Go to Login Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
