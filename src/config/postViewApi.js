import API from "./axios";

// Track a post view
export const trackPostView = async (recipeId) => {
  try {
    const response = await API.post("/post-views", { fromPost: recipeId });
    return response.data;
  } catch (error) {
    console.error("Error tracking post view:", error.response?.data || error);
    return null;
  }
};

// Get most viewed recipes
export const getTopViewedRecipes = async () => {
  try {
    const response = await API.get("/post-views/top");
    return response.data.topViewedPosts;
  } catch (error) {
    console.error("Error fetching top viewed recipes:", error.response?.data || error);
    return [];
  }
};
