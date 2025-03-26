import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "@/config/axios";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import usePageStore from "@/hooks/stores/usePageStore";
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore";
import RecipesDisplay from "@/pages/recipe/components/RecipeDisplay";
import CustomPagination from "@/components/pagination/CustomPagination";
import RecipeFilters from "@/pages/recipe/components/RecipeFilters";

const SpecificUserProfileView = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const {
    page,
    limit,
    setTotalRecipeCount,
    search,
    origin,
    category,
    sortOrder,
  } = useRecipeFilterStore();

  const { setPage: setNavPage, setSubPage } = usePageStore();

  useEffect(() => {
    document.title = "Profile | Kulinarya";
    setNavPage({ href: "/profile", name: "Profile" });
  
    if (user) {
      setSubPage({ href: `/profile/${userId}`, name: `${user.firstName} ${user.lastName}` });
    }
  }, [user, userId, setNavPage, setSubPage]);
  

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const userResponse = await API.get(`/users/${userId}`);
        setUser(userResponse.data.userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserRecipes = async () => {
      try {
        const response = await API.get(`/users/${userId}/recipes`, {
          params: { search, origin, category, sortOrder, page, limit },
        });

        setRecipes(response.data.userRecipes || []);
        setTotalRecipeCount(response.data.totalRecipes || 0);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchUserData();
    fetchUserRecipes();
  }, [userId, search, origin, category, sortOrder, page, limit, setTotalRecipeCount]);

  if (!user) return <div>Loading...</div>;

  return (
    <section className="w-full px-5 sm:px-12 md:px-16 lg:px-24 xl:px-40 py-20 flex flex-col gap-8">
      <CustomBreadCrumb />
      <div className="max-w-4xl mx-auto p-4">
        {/* Profile Header */}
        <div className="flex items-start gap-8 mb-8">
          {/* Profile Picture */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-300">
            <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
          {/* Name & Bio */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">{user.bio}</p>
          </div>
        </div>

        {/* Recipes Posted */}
        <h2 className="text-xl font-semibold mb-4">Recipes Posted</h2>

        {/* Recipe Filters */}
        <div className="mb-6">
          <RecipeFilters />
        </div>

        {/* Recipe Display */}
        {recipes.length === 0 ? (
          <div className="h-52 flex justify-center items-center">
            <p className="text-xl font-bold">
              No Recipes <span className="text-primary animate-pulse">Found</span>
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <RecipesDisplay recipes={recipes} />
            </div>

            <div className="mt-8">
              <CustomPagination />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SpecificUserProfileView;
