import Logo from "@/components/Logo";
import SignupForm from "@/pages/auth/components/SignupForm";
import { CircleArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Signup | Kulinarya";
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-primary/80 dark:bg-primary lg:flex items-center justify-center">
        <Logo className="size-80" />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <CircleArrowLeft
          className="size-10 sm:size-12 cursor-pointer hover:text-primary transition"
          onClick={() => navigate("/")}
        />

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[21rem]">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
