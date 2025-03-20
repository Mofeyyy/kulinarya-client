import { useEffect, useState } from "react";
import API from "@/config/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import usePageStore from "@/hooks/stores/usePageStore";
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import SearchInput from "@/pages/recipe/components/SearchInput"; 
import CustomPagination from "@/components/pagination/CustomPagination";

const AdminDashboardRecipes = ({ type }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reactions, setReactions] = useState({});
  const [comments, setComments] = useState({});
  const { setPage, setSubPage } = usePageStore();
  const { search, page, limit, setTotalRecipeCount } = useRecipeFilterStore();

  useEffect(() => {
    document.title = "Featured Recipes | Kulinarya";
    setPage({ href: "/recipes", name: "Recipes" });
    setSubPage({ href: "/recipes", name: "Featured Recipes" });
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await API.get(
          `/recipes/approved?sortOrder=newest&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
        );
  
        const fetchedRecipes = response.data.recipes || [];
        setRecipes(fetchedRecipes);
        setTotalRecipeCount(response.data.totalApprovedRecipes || 0);
        fetchedRecipes.sort((a, b) =>
          a.isFeatured === b.isFeatured ? new Date(b.createdAt) - new Date(a.createdAt) : a.isFeatured ? 1 : -1
        );
  
        // Fetch reactions and comments for each recipe
        fetchedRecipes.forEach((recipe) => {
          fetchReactionsForRecipe(recipe._id);
          fetchCommentsForRecipe(recipe._id);
        });
  
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRecipes();
  }, [page, limit, search]); // <-- Now re-fetches when `search` changes
  
    

  const handleToggleFeatureRecipe = async (recipeId, isFeatured) => {
    try {
      setLoading(true);
      await API.patch(`/recipes/${recipeId}/toggle-feature`);
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe._id === recipeId ? { ...recipe, isFeatured: !isFeatured } : recipe
        )
      );
    } catch (error) {
      console.error("Error toggling feature status:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReactionsForRecipe = async (recipeId) => {
    try {
      const response = await API.get(`/reactions/${recipeId}`);
      setReactions((prevReactions) => ({
        ...prevReactions,
        [recipeId]: response.data.reactions.length,
      }));
    } catch (error) {
      console.error(`Error fetching reactions for recipe ${recipeId}:`, error);
    }
  };

  const fetchCommentsForRecipe = async (recipeId) => {
    try {
      const response = await API.get(`/comments/${recipeId}`);
      setComments((prevComments) => ({
        ...prevComments,
        [recipeId]: response.data.comments.length,
      }));
    } catch (error) {
      console.error(`Error fetching comments for recipe ${recipeId}:`, error);
    }
    };
  

  return (
    <section className="w-full px-5 min-[400px]:px-10 min-[500px]:px-16 sm:px-12 md:px-16 lg:px-24 xl:px-40 py-20 flex flex-col gap-8">
      <CustomBreadCrumb />
    <div className="container mx-auto p-4">
      <div className="flex border-b pb-2 mb-4">
      <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `mr-4 font-semibold border-b-2 ${
              isActive ? "text-orange-500 border-orange-500" : "text-gray-500 border-transparent"
            }`
          }
        >
          Admin Dashboard
        </NavLink>
        <NavLink
          to="/admin/pending-recipes"
          className={({ isActive }) =>
            `mr-4 font-semibold border-b-2 ${
              isActive ? "text-orange-500 border-orange-500" : "text-gray-500 border-transparent"
            }`
          }
        >
          Pending Recipe Post
        </NavLink>
        <NavLink
          to="/admin/feature-recipes"
          className={({ isActive }) =>
            `font-semibold border-b-2 ${
              isActive ? "text-orange-500 border-orange-500" : "text-gray-500 border-transparent"
            }`
          }
        >
          Feature Recipe
        </NavLink>
      </div>

      <div className="container mx-auto p-0">
        <div className="flex justify-end items-center mb-4">
          <SearchInput />
        </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-1/5 text-left">Recipe Name</TableHead>
            <TableHead className="w-1/5 text-left">Submitted By</TableHead>
            <TableHead className="w-1/5 text-center">Likes</TableHead>
            <TableHead className="w-1/5 text-center">Comments</TableHead>
            <TableHead className="w-1/5 text-center">Feature</TableHead>
            <TableHead className="w-1/5 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes.map((recipe) => (
            <TableRow key={recipe._id} className="border-b hover:bg-gray-50">
              <TableCell className="w-1/4">{recipe.title}</TableCell>
              <TableCell className="w-1/5">{`${recipe.byUser?.firstName} ${recipe.byUser?.lastName}`}</TableCell>
              <TableCell className="w-1/6 text-center">
                {reactions[recipe._id] !== undefined ? reactions[recipe._id] : "Loading..."}
              </TableCell>
              <TableCell className="w-1/6 text-center">
                {comments[recipe._id] !== undefined ? comments[recipe._id] : "Loading..."}
              </TableCell>
              <TableCell className="w-1/6 text-center">{recipe.isFeatured ? "Yes" : "No"}</TableCell>
              <TableCell className="w-1/6 text-center">
                <Button
                  className={`px-4 py-1 ${recipe.isFeatured ? "bg-gray-400 text-white" : "bg-orange-500 text-white"}`}
                  onClick={() => handleToggleFeatureRecipe(recipe._id, recipe.isFeatured)}
                  disabled={loading}
                >
                  {loading ? "Updating..." : recipe.isFeatured ? "Unfeature" : "Feature"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
          <CustomPagination />
        </div>
      </div>
      </div>
    </section>
  );
};

  

export default AdminDashboardRecipes;
