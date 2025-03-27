import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "@/config/axios";
import useThemeStore from "@/hooks/stores/useThemeStore";
import RecipesDisplay from "./recipe/components/RecipeDisplay";
import landingPagePicture from "../assets/landing-page-food.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import RecipeDisplayCard from "./recipe/components/RecipeDisplayCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import Swiper.js
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import useAuthStore from "@/hooks/stores/useAuthStore";
import toast from "react-hot-toast";

// Images for the slideshow
const heroImages = [
  "/src/assets/landing-page-food.jpg",
  "/src/assets/landing-page-food2.jpg",
  "/src/assets/landing-page-food3.jpg",
];

const LandingPage = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [topSharers, setTopSharers] = useState([]);

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        const response = await API.get("/recipes/featured");
        setFeaturedRecipes((response.data.featuredRecipesData || []).slice(0, 8));
      } catch (error) {
        console.error("Error fetching featured recipes:", error);
        setFeaturedRecipes([]);
      }
    };

    const fetchTopSharers = async () => {
      try {
        const response = await API.get("/users/top-sharers");
        setTopSharers((response.data.topSharers || []).slice(0, 4));
      } catch (error) {
        console.error("Error fetching top sharers:", error);
        setTopSharers([]);
      }
    };

    fetchFeaturedRecipes();
    fetchTopSharers();

    // Fetch data every 10 seconds
    const interval = setInterval(() => {
      fetchFeaturedRecipes();
      fetchTopSharers();
    }, 10000); // 10000ms = 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mb-20 flex w-full flex-col items-center justify-center gap-5 overflow-x-hidden sm:gap-10 lg:gap-16">
      <HeroSection />

      {/* Parts that has padding */}
      <div className="mb-10 flex w-full max-w-[90vw] flex-col gap-5 sm:gap-10 lg:gap-16">
        <FirstSection />

        <hr />

        <CarouselSection
          title="Featured Recipes"
          items={featuredRecipes}
          renderItem={(recipe) => <RecipeDisplayCard recipe={recipe} />}
        />

        <hr />

        <ThirdSection />

        <hr />

        <CarouselSection
          title="Top Recipe Sharers"
          description="Meet our top recipe sharers"
          items={topSharers}
          renderItem={(user) => <UserCard user={user} />}
        />

        <hr />

        <div className="grid w-full justify-center gap-10 xl:grid-cols-2 2xl:gap-20">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl leading-tight font-bold sm:text-5xl lg:text-6xl">
              About <span className="text-primary">Us</span>
            </h1>

            <p className="text-muted-foreground text-justify text-sm leading-loose sm:text-lg">
              Kulinarya is dedicated to showcasing and celebrating the rich flavors of Filipino
              cuisine. Our mission is to preserve and promote our gastronomic heritage by bringing
              together food lovers to share authentic recipes, cooking tips, and food stories.
              Through this platform, we aim to inspire a deeper appreciation for the diverse and
              vibrant culinary traditions of the Philippines
            </p>
          </div>

          <div className="hidden overflow-hidden rounded-lg xl:flex">
            <img
              src="https://wzevoniotfkqscqmqmiv.supabase.co/storage/v1/object/public/kulinarya-bucket/assets/chef-cooking.jpg"
              alt="chefCooking"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// ! Components -------------------------------------

const UserCard = ({ user }) => {
  return (
    <div key={user._id} className="flex flex-col items-center justify-center gap-5 border py-5">
      <Avatar className="size-40">
        <AvatarImage
          src={
            user.profilePictureUrl ||
            "https://icons.veryicon.com/png/o/business/multi-color-financial-and-business-icons/user-139.png"
          }
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <p className="flex justify-center text-lg font-semibold group-hover:text-orange-500">
        {user.firstName} {user.lastName}
      </p>

      <Link to={`/users/${user._id}`}>
        <Button size="lg" className="bg-card/80 hover:bg-card/60">
          View Profile
        </Button>
      </Link>
    </div>
  );
};

const HeroSection = () => {
  return (
    <div className="relative flex h-[50vh] w-full flex-col items-center justify-center p-4 text-center sm:h-[60vh] md:p-0 lg:h-[80vh]">
      {/* Big Picture */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[25%]"
        style={{
          backgroundImage: `url(/src/assets/landing-page-food.jpg)`,
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

const FirstSection = () => {
  return (
    <div className="grid w-full justify-center gap-10 xl:grid-cols-2 2xl:gap-20">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl leading-tight font-bold sm:text-5xl lg:text-6xl">
          <span className="text-primary">Share, Discover,</span> and{" "}
          <span className="text-primary">Enjoy</span>!
        </h1>

        <p className="text-muted-foreground text-justify text-sm leading-loose sm:text-lg">
          Kulinarya is a community-driven platform where foodies and home cooks can share their
          favorite recipes, explore new dishes, and connect with like-minded individuals. Focused on
          celebrating Filipino gastronomy, Kulinarya showcases the rich flavors, unique cooking
          techniques, and diverse culinary traditions of the Philippines. Whether you're a seasoned
          chef or just starting your culinary journey, Kulinarya offers a space to discover,
          preserve, and share the essence of Filipino cuisine with the world.
        </p>
      </div>

      {/* Swiper.js Slideshow */}
      <div className="hidden items-center justify-center xl:flex">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          className="h-full w-full rounded-lg shadow-lg"
        >
          {heroImages.map((image, index) => (
            <SwiperSlide
              key={index}
              className="flex h-full w-full items-center justify-center rounded-lg"
            >
              <img src={image} alt={`Slide ${index + 1}`} className="h-full w-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

const CarouselSection = ({ title, description, items, renderItem }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {items.length > 0 &&
            items.map((item) => (
              <CarouselItem
                key={item._id}
                className="min-[500px]:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
              >
                {renderItem(item)}
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="size-16" />
        <CarouselNext className="size-16" />
      </Carousel>
    </div>
  );
};

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

export default LandingPage;
