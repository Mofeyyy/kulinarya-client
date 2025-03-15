import Logo from "@/components/Logo";
import { LoginForm } from "@/pages/auth/components/LoginForm";
import { CircleArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    document.title = "Login | Kulinarya";
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Link to="/">
          <CircleArrowLeft className="size-10 sm:size-12 hover:text-primary transition" />
        </Link>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[21rem]">
            <LoginForm />
          </div>
        </div>
      </div>

      <div className="relative hidden bg-primary/80 dark:bg-primary lg:flex items-center justify-center">
        <Logo className="size-80" />
      </div>
    </div>
  );
};

export default Login;
