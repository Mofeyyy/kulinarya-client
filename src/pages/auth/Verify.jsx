import { CircleArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import useVerifyEmail from "@/hooks/queries/useVerifyEmail";
import { useEffect } from "react";
import VerifyStatusMessage from "./components/VerifyStatusMessage";
import toast from "react-hot-toast";

// --------------------------------------------------------------------

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigateTo = useNavigate();

  useEffect(() => {
    document.title = "Verify | Kulinarya";

    if (!token) {
      navigateTo("/");
      toast.error("No Token Found!");
    }
  }, [token, navigateTo]);

  const { isLoading, isError, error } = useVerifyEmail(token);

  useEffect(() => {
    if (isError) {
      setTimeout(() => navigateTo("/"), 4000);
    }
  }, [isError, error]);

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
      </div>
    </div>
  );
};

export default Verify;
