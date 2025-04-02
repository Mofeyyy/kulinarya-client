import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const NotFoundPage = ({ className }) => {
  return (
    <div
      className={cn(
        "bg-background flex h-full w-full flex-col items-center justify-center gap-5",
        className,
      )}
    >
      <h1 className="text-6xl font-bold">
        PAGE NOT <span className="text-primary animate-pulse">FOUND</span>
      </h1>

      <Link to="/">
        <Button>Return to Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
