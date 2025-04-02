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
        <h1 className="text-primary text-[clamp(40px,8vw,80px)] font-bold tracking-[6px] lg:tracking-[8px]">
          Kulinarya
        </h1>

        <p className="-mt-1 text-[clamp(12px,1.8vw,22px)] font-light text-white sm:-mt-2 md:-mt-3">
          Where Flavor Meets Tradition
        </p>

        <Link to="/recipes">
          <Button className="mt-4 rounded-lg text-xs sm:text-sm">Explore Now</Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
