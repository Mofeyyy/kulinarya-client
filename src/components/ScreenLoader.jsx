import { ChefHat } from "lucide-react";

const ScreenLoader = () => {
  return (
    <div className="absolute w-screen h-screen flex items-center justify-center bg-black/90">
      <ChefHat className="font-extrabold text-primary size-40 animate-pulse" />
    </div>
  );
};

export default ScreenLoader;
