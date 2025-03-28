import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "@/config/axios";
import useThemeStore from "@/hooks/stores/useThemeStore";
import RecipesDisplay from "@/pages/recipe/components/RecipeDisplay";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import useAuthStore from "@/hooks/stores/useAuthStore"; // Assuming you have an auth store

const HomePage = () => {
  const { theme } = useThemeStore();
  const isDarkMode = theme === "dark";
  const { userDetails } = useAuthStore(); // Get the user data
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [topSharers, setTopSharers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [mostViewedRecipes, setMostViewedRecipes] = useState([]);
  const [mostReactedRecipes, setMostReactedRecipes] = useState([]);


useEffect(() => {
  if (!userDetails) {
    // Redirect the user to the login page if they are not logged in
    window.location.href = "/login"; // or use `history.push('/login')` if using react-router
  }
}, [userDetails]); // Runs when `userDetails` changes

useEffect(() => {
  document.title = "Home | Kulinarya";  // Set the document title to "Kulinarya"
}, []);
  
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

    const fetchTopRecipeViews = async () => {
      try {
        const response = await API.get("/post-views/top");
        setMostViewedRecipes((response.data.topViewedPosts || []).slice(0, 3));
      } catch (error) {
        console.error("Error fetching top viewed recipes:", error);
        setMostViewedRecipes([]);
      }
    };

    const fetchMostReactedRecipes = async () => {
      try {
        const response = await API.get("/reactions/top-reacted");
        console.log("API response for top reacted recipes:", response.data);
    
        // Ensure you're accessing the correct property
        const topReactedPosts = response.data.data.topReactedPosts || []; 
    
        setMostReactedRecipes(topReactedPosts.slice(0, 3));
      } catch (error) {
        console.error("Error fetching most reacted recipes:", error);
        setMostReactedRecipes([]);
      }
    };
    
    
    
    const fetchAnnouncements = async () => {
      try {
        const response = await API.get("/announcements/activeAnnouncements");
        setAnnouncements((response.data.announcements || []).slice(0, 5));
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setAnnouncements([]);
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

    fetchTopSharers();
    fetchFeaturedRecipes();
    fetchTopRecipeViews();
    fetchMostReactedRecipes();
    fetchAnnouncements();
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
    
      
      {/* Announcements & Top Recipes Section */}
      <section className="w-full max-w-6xl p-10 flex flex-col md:flex-row gap-8">
        
        {/* Announcements */}
<div className="md:w-1/3">
<h2 className={`text-4xl md:text-3xl font-bold text-left ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>📢 Announcements</h2>
  
  {/* Show create button if user is Admin or Content Creator */}
  {(userDetails?.role === "admin" || userDetails?.role === "creator") && (
    <div className="mt-4">
      <Link 
        to="/announcements/create"
        className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition"
      >
        + Create
      </Link>
    </div>
  )}

  <Swiper
    modules={[Pagination, Autoplay]}
    spaceBetween={10}
    slidesPerView={1}
    autoplay={{ delay: 4000 }}
    pagination={{ clickable: true }}
    className="mt-4"
  >
    {announcements.length > 0 ? (
      announcements.map((announcement) => (
        <SwiperSlide key={announcement._id}>
          <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h3 className="text-lg font-semibold">{announcement.title}</h3>
            <p className="text-sm mt-2">{announcement.content}</p> {/* Show announcement message */}
            <span className="text-xs text-gray-400">{new Date(announcement.createdAt).toLocaleDateString()}</span>
          </div>
        </SwiperSlide>
      ))
    ) : (
      <p className="text-gray-500 mt-4">No announcements available.</p>
    )}
  </Swiper>
</div>



        {/* Most Viewed Recipes */}
        <div className="md:w-2/3 flex flex-col gap-8">
          <div>
          <h2 className={`text-4xl md:text-3xl font-bold text-left ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>🔥 Most Viewed Recipes</h2>
            {mostViewedRecipes.length > 0 ? (
              <RecipesDisplay recipes={mostViewedRecipes} />
            ) : (
              <p className="text-gray-500 mt-4">No most viewed recipes available.</p>
            )}
          </div>
        </div>
      </section>

      {/* Most Reacted Recipes */}
<section className="w-full max-w-6xl p-10">
<h2 className={`text-4xl md:text-3xl font-bold text-left ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>❤️ Most Reacted Recipes</h2>
  {mostReactedRecipes.length > 0 ? (
    <RecipesDisplay recipes={mostReactedRecipes} />
  ) : (
    <p className="text-gray-500 mt-4">No most reacted recipes available.</p>
  )}
</section>

      

      {/* Featured Recipes */}
      <section className="w-full max-w-6xl p-10">
      <h2 className={`text-4xl md:text-3xl font-bold text-left ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>Featured Recipes</h2>
        {featuredRecipes.length > 0 ? (
          <RecipesDisplay recipes={featuredRecipes} />
        ) : (
          <p className="text-gray-500 mt-4">No featured recipes available.</p>
        )}
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
                  src={user.profilePictureUrl || "https://icons.veryicon.com/png/o/business/multi-color-financial-and-business-icons/user-139.png"}
                  alt={user.firstName}
                  className={`w-24 h-24 mx-auto object-cover rounded-full border-2 border-orange-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                />
                <p className={`flex justify-center text-lg mt-2 font-semibold ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>{user.firstName} {user.lastName}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-4">No top sharers available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
