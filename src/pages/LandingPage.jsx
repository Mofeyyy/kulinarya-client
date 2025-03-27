import RecipeDisplayCard from "./recipe/components/RecipeDisplayCard";
import useFeaturedRecipes from "@/hooks/queries/useFeaturedRecipes";
import useTopSharers from "@/hooks/queries/useTopSharers";

import UserCard from "./home/components/UserCard";
import HeroSection from "./home/components/HeroSection";
import FirstSection from "./home/components/FirstSection";
import CarouselSection from "./home/components/CarouselSection";
import ThirdSection from "./home/components/ThirdSection";
import FourthSection from "./home/components/FourthSection";

const LandingPage = () => {
  const { data: featuredRecipesData = [] } = useFeaturedRecipes();
  const featuredRecipes = featuredRecipesData.slice(0, 10); // Limit to 10
  const { data: topSharers = [] } = useTopSharers();

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

        <FourthSection />
      </div>
    </section>
  );
};

// ! Components -------------------------------------

export default LandingPage;
