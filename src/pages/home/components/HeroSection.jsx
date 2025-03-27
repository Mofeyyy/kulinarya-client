import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative flex h-[50vh] w-full flex-col items-center justify-center p-4 text-center sm:h-[60vh] md:p-0 lg:h-[80vh]">
      {/* Big Picture */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[25%]"
        style={{
          backgroundImage: `url(https://wzevoniotfkqscqmqmiv.supabase.co/storage/v1/object/public/kulinarya-bucket/assets/hero.jpg)`,
        }}
      />

      {/* Text Content */}
      <div className="z-10">
        <h1 className="text-primary text-4xl font-bold tracking-[6px] sm:text-5xl lg:text-7xl lg:tracking-[8px]">
          Kulinarya
        </h1>

        <p className="mt-1 text-xs font-light text-white sm:text-sm lg:mt-2 lg:text-xl">
          Where Flavor Meets Tradition
        </p>

        <Link to="/recipes">
          <Button className="mt-4 rounded-lg lg:px-6 lg:py-5 lg:text-lg">Explore Now</Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
