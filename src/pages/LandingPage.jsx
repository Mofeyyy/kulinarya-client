import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useThemeStore from "@/hooks/stores/useThemeStore";


// Import Swiper.js
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const LandingPage = () => {
  const { theme } = useThemeStore();
  const isDarkMode = theme === "dark";

  
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  
  
  const [topSharers, setTopSharers] = useState([]);

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/recipes/featured");
        setFeaturedRecipes((response.data.featuredRecipesData || []).slice(0, 8));
      } catch (error) {
        console.error("Error fetching featured recipes:", error);
        setFeaturedRecipes([]);
      }
    };
    

    const fetchTopSharers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users/top-sharers");
        console.log("Top Sharers API Response:", response.data);
        setTopSharers((response.data.topSharers || []).slice(0, 4)); // Limit to 4 sharers
      } catch (error) {
        console.error("Error fetching top sharers:", error);
        setTopSharers([]);
      }
    };

    fetchTopSharers();
    fetchFeaturedRecipes();

    // Set interval to refresh every 30 seconds
  const intervalId = setInterval(fetchTopSharers, fetchFeaturedRecipes, 30000); 

  // Cleanup function to clear interval when the component unmounts
  return () => clearInterval(intervalId);
  }, []);

  // Images for the slideshow
  const heroImages = [
    "/src/assets/landing-page-food.jpg",
    "/src/assets/landing-page-food2.jpg",
    "/src/assets/landing-page-food3.jpg"
  ];

  return (
    <div className={`w-full min-h-screen flex flex-col items-center ${isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-white'}`}>
      
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex flex-col items-center justify-center text-center p-4 md:p-0">
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `url(/src/assets/landing-page-food.jpg)`,
      filter: "brightness(40%)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  ></div>

  {/* Content */}
  <div className="relative z-10 max-w-md md:max-w-lg lg:max-w-2xl px-4">
    <h1 className="text-4xl sm:text-5xl font-bold">Kulinarya</h1>
    <p className="text-lg mt-2">Where Flavor Meets Tradition</p>
    <Link 
      to="/recipes"
      className="mt-4 inline-block bg-orange-500 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:opacity-80 transition-all"
    >
      Start Cooking Today!
    </Link>
  </div>
</section>


      {/* Swiper.js Slideshow */}
      <section className="w-full h-auto flex flex-col md:flex-row items-center justify-center p-4 md:p-10">
  <div className="md:w-1/2 text-center md:text-left">
    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-orange-500">Share, Discover, and Enjoy!</h1>
    <p className={`text-lg md:text-xl mt-4 max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      Kulinarya is a community-driven platform where foodies and home cooks can share their favorite recipes, explore new dishes, and connect with like-minded individuals.
    </p>
    <Link to="/about-us" className="mt-4 inline-block bg-orange-500 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:opacity-80">Our Purpose</Link>
  </div>
  <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
      className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto"
    >
      {heroImages.map((image, index) => (
        <SwiperSlide key={index} className="flex justify-center items-center">
          <img 
            src={image} 
            alt={`Slide ${index + 1}`} 
            className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover rounded-lg"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section>


      {/* Featured Recipes */}
      <section className="w-full max-w-6xl p-10">
        <h2 className={`text-4xl md:text-3xl font-bold text-left ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>Featured Recipes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {featuredRecipes.length > 0 ? (
            featuredRecipes.map((recipe) => (
              <Link key={recipe._id} to={`/recipe/${recipe._id}`} className="group">
                <div className={`p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <img src={recipe.picture} alt={recipe.title} className={`w-full h-40 object-cover rounded-lg ${isDarkMode ? 'text-gray-400' : 'text-black'}`} />
                  <p className={`text-lg mt-2 font-semibold group-hover:text-orange-500 ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>{recipe.title}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-4`}>No featured recipes available.</p>
          )}
        </div>
      </section>

      {/* Top Sharers */}
      <section className="w-full max-w-6xl p-10">
        <h2 className={`text-3xl font-bold text-left ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>Top Sharers</h2>
        <p className={`text-lg mt-2 text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Meet our most active contributors!</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
          {topSharers.length > 0 ? (
            topSharers.map((user) => (
              <div key={user._id} className={`p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <img 
                  src={user.picture || "/images/default-avatar.png"}
                  alt={user.firstName}
                  className={`w-24 h-24 mx-auto object-cover rounded-full border-2 border-orange-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                />
                <p className={`flex justify-center text-lg mt-2 font-semibold group-hover:text-orange-500 ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>{user.firstName} {user.lastName}</p>
                <Link 
                  to={`/users/${user._id}`} 
                  className="mt-3 block bg-orange-500 text-white w-full px-6 py-2 text-sm font-medium text-center rounded-md shadow-sm hover:bg-orange-600 transition-all"
                >
                  View Profile
                </Link>
              </div>
            ))
          ) : (
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-4`}>No top sharers available.</p>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
<section className="w-full max-w-6xl mx-auto p-10 flex flex-col md:flex-row items-center gap-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
  {/* Left Side - Image */}
  <div className="w-full md:w-1/2">
    <img 
      src="/src/assets/landing-page-food.jpg" 
      alt="Delicious Filipino Dish" 
      className="w-full h-auto rounded-lg shadow-lg"
    />
  </div>

  {/* Right Side - Text Content */}
  <div className="w-full md:w-1/2 text-center md:text-left">
    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
      <span className="text-orange-500">Share</span> Your Favorite Recipes
    </h2>
    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-4`}>
      Join our community and share your own recipes, cooking tips, and food stories!
    </p>

    {/* CTA Button */}
    <Link 
            to="/recipes"
            className="mt-4 inline-block bg-orange-500 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:opacity-80 transition-all"
          >
            Share Now!
          </Link>
  </div>
</section>

{/* Call to Action Section */}
<section className="w-full max-w-6xl mx-auto p-10 flex flex-col md:flex-row items-center gap-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
  {/* Left Side - Image */}
  <div className="w-full md:w-1/2">
    <img 
      src="/src/assets/landing-page-food.jpg" 
      alt="Delicious Filipino Dish" 
      className="w-full h-auto rounded-lg shadow-lg"
    />
  </div>

  {/* Right Side - Text Content */}
  <div className="w-full md:w-1/2 text-center md:text-left">
    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
      <span className="text-orange-500">Come</span> & Join Us!
    </h2>
    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-4`}>
      Kulinarya is a labor of love created by food enthusiasts who want to celebrate the diversity and richness of Filipino cuisine.
    </p>

    {/* CTA Button */}
    <Link 
            to="/signup"
            className="mt-4 inline-block bg-orange-500 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:opacity-80 transition-all"
          >
            Join Us!
          </Link>
  </div>
</section>

    </div>
  );
};

export default LandingPage;
