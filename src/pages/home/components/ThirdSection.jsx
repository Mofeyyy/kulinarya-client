import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/hooks/stores/useAuthStore";
import toast from "react-hot-toast";

const ThirdSection = () => {
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="grid w-full justify-center gap-10 lg:grid-cols-2 2xl:gap-20">
      <div className="hidden overflow-hidden rounded-lg lg:flex">
        <img
          src="https://wzevoniotfkqscqmqmiv.supabase.co/storage/v1/object/public/kulinarya-bucket/assets/chef-cooking.jpg"
          alt="chefCooking"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-3 lg:gap-6">
        <h1 className="text-[clamp(24px,4vw,48px)] leading-tight font-bold">
          <span className="text-primary">Share</span> Your Favorite Recipes
        </h1>

        <p className="text-muted-foreground text-justify text-[clamp(12px,2vw,18px)] leading-loose">
          Join our community and celebrate the rich flavors of Filipino cuisine! Share your favorite
          recipes, cooking tips, and food stories to help preserve and promote our culinary
          heritage. Let’s cook, connect, and savor the taste of home together!
        </p>

        <Link
          to={isLoggedIn ? "/recipes/create" : "/login"}
          onClick={() => {
            if (!isLoggedIn) {
              toast("Please login your account to share a recipe.");
            }
          }}
        >
          <Button className="rounded-lg text-xs sm:text-sm">Share Now</Button>
        </Link>
      </div>
    </div>
  );
};

export default ThirdSection;
