import RecipeDisplayCard from "./recipe/components/RecipeDisplayCard";
import useFeaturedRecipes from "@/hooks/queries/useFeaturedRecipes";
import useTopSharers from "@/hooks/queries/useTopSharers";
import UserCard from "./home/components/UserCard";
import HeroSection from "./home/components/HeroSection";
import FirstSection from "./home/components/FirstSection";
import CarouselSection from "./home/components/CarouselSection";
import ThirdSection from "./home/components/ThirdSection";
import FourthSection from "./home/components/FourthSection";
import useTopEngagedRecipes from "@/hooks/queries/useTopEngagedRecipes";
import AnnouncementFloatingButton from "./home/components/AnnouncementFloatingButton";
import useActiveAnnouncements from "@/hooks/queries/useAnnouncements";

const LandingPage = () => {
  const { data: featuredRecipesData = [] } = useFeaturedRecipes();
  // const featuredRecipes = featuredRecipesData.slice(0, 10);

  const { data: topRecipeSharers = [] } = useTopSharers();
  const { data: topEngagedRecipes = [] } = useTopEngagedRecipes();

  const { data: announcements = [] } = useActiveAnnouncements();

  return (
    <section className="mb-20 flex w-full flex-col items-center justify-center gap-5 overflow-x-hidden sm:gap-10 lg:gap-16">
      <HeroSection />

      {/* Parts that has padding */}
      <div className="mb-10 flex w-full max-w-[80vw] flex-col gap-5 sm:gap-10 lg:gap-16 xl:max-w-[65vw]">
        <FirstSection />

        <hr />

        <CarouselSection
          title="Top Engaged Recipes"
          items={topEngagedRecipes}
          renderItem={(recipe) => <RecipeDisplayCard recipe={recipe} />}
        />

        {/* //? Ask if this is necessary */}
        {/* <CarouselSection
          title="Featured Recipes"
          items={featuredRecipes}
          renderItem={(recipe) => <RecipeDisplayCard recipe={recipe} />}
        /> */}

        <hr className="-mt-5" />

        <ThirdSection />

        <hr />

        <CarouselSection
          title="Top Recipe Sharers"
          description="Meet our top recipe sharers"
          items={topRecipeSharers}
          renderItem={(user) => <UserCard user={user} />}
        />

        <hr className="-mt-5" />

        <FourthSection />

        {/* Floating Announcement Button */}
      <AnnouncementFloatingButton announcements={announcements} />
      </div>
    </section>
  );
};

// ! Components -------------------------------------

export default LandingPage;
