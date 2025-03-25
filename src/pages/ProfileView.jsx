import React, { useEffect, useState } from "react";
import API from "@/config/axios";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import usePageStore from "@/hooks/stores/usePageStore";
import useAuthStore from "@/hooks/stores/useAuthStore";
import RecipeFilters from "@/pages/recipe/components/RecipeFilters";
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore";
import RecipesDisplay from "@/pages/recipe/components/RecipeDisplay";
import CustomPagination from "@/components/pagination/CustomPagination";


const ProfilePage = () => {
  const { userDetails, updateProfilePicture  } = useAuthStore((state) => state);
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState(userDetails?.profilePictureUrl || "");
 

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
    setSubPage({ href: "/profile", name: "Profile" });
  }, [setNavPage, setSubPage]);

  useEffect(() => {
    if (!userDetails?._id) return;

    const fetchUserData = async () => {
      try {
        const userResponse = await API.get(`/users/${userDetails._id}`);
        setUser(userResponse.data.userData);
        setNewFirstName(userResponse.data.userData.firstName);
        setNewLastName(userResponse.data.userData.lastName);
        setNewBio(userResponse.data.userData.bio || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserRecipes = async () => {
      try {
        const response = await API.get(`/users/${userDetails._id}/recipes`, {
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
  }, [userDetails, search, origin, category, sortOrder, page, limit, setTotalRecipeCount]);

  useEffect(() => {
    setProfilePictureUrl(userDetails?.profilePictureUrl); // Sync profile picture when user updates
  }, [userDetails?.profilePictureUrl]);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await API.patch(`/users/${userDetails._id}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newProfilePic = response.data.profilePictureUrl;

      updateProfilePicture(newProfilePic); // Update Zustand store
      setProfilePictureUrl(newProfilePic); // Update local state to trigger re-render
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const handleEditProfile = async () => {
    if (isEditing) {
      const updatedFields = {};

      // Only include fields that have changed
      if (newFirstName !== user.firstName) updatedFields.firstName = newFirstName;
      if (newLastName !== user.lastName) updatedFields.lastName = newLastName;
      if (newBio !== user.bio) updatedFields.bio = newBio;

      // Only send request if there's something to update
      if (Object.keys(updatedFields).length > 0) {
        try {
          await API.patch(`/users/${userDetails._id}/update`, updatedFields);
          setUser((prevUser) => ({
            ...prevUser,
            ...updatedFields,
          }));
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      }
    }
    setIsEditing(!isEditing);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <section className="w-full px-5 sm:px-12 md:px-16 lg:px-24 xl:px-40 py-20 flex flex-col gap-8">
      <CustomBreadCrumb />
      <div className="max-w-4xl mx-auto p-4">
        
        {/* Profile Header */}
        <div className="flex items-start gap-8 mb-8">
          {/* Profile Picture Edit */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-300">
          <img src={userDetails?.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />

            <label htmlFor="profilePic" className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 cursor-pointer text-xs">
              Change
            </label>
            <input id="profilePic" type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
          </div>

          {/* Name & Bio Edit */}
          <div className="flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input type="text" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} className="border p-1 rounded w-1/2" />
                  <input type="text" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} className="border p-1 rounded w-1/2" />
                </div>
                <textarea value={newBio} onChange={(e) => setNewBio(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Update your bio" />
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-semibold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">{user.bio}</p>
              </div>
            )}

            {/* Single Edit Button */}
            <button className="mt-2 text-blue-500 text-sm" onClick={handleEditProfile}>
              {isEditing ? 'Save' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Recipes Posted */}
        <h2 className="text-xl font-semibold mb-4">Recipes Posted</h2>

        {/* Recipe Filters with bottom margin */}
        <div className="mb-6">
          <RecipeFilters />
        </div>

        {/* Recipe Display Section with top margin */}
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

export default ProfilePage;
