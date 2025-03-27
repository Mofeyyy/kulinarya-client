import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/hooks/stores/useAuthStore";
import toast from "react-hot-toast";

const ThirdSection = () => {
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="grid w-full justify-center gap-10 xl:grid-cols-2 2xl:gap-20">
      <div className="hidden overflow-hidden rounded-lg xl:flex">
        <img
          src="https://wzevoniotfkqscqmqmiv.supabase.co/storage/v1/object/public/kulinarya-bucket/assets/chef-cooking.jpg"
          alt="chefCooking"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-6">
        <h1 className="text-3xl leading-tight font-bold sm:text-5xl lg:text-6xl">
          <span className="text-primary">Share</span> Your Favorite Recipes
        </h1>

        <p className="text-muted-foreground text-justify text-sm leading-loose sm:text-lg">
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
          <Button className="rounded-lg lg:px-6 lg:py-5 lg:text-lg">Share Now</Button>
        </Link>
      </div>
    </div>
  );
};

export default ThirdSection;
