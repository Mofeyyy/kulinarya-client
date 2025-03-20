import { useEffect, useState } from "react";
import API from "@/config/axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import usePageStore from "@/hooks/stores/usePageStore";  
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore"; 
import SearchInput from "@/pages/recipe/components/SearchInput"; 
import CustomPagination from "@/components/pagination/CustomPagination";

const PendingRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const { search, page, limit, setTotalRecipeCount } = useRecipeFilterStore();
  const { setPage, setSubPage } = usePageStore();

  useEffect(() => {
    document.title = "Pending Recipes | Kulinarya";
    setPage({ href: "/recipes", name: "Recipes" });
    setSubPage({ href: "/recipes", name: "Pending Recipes" });

    const fetchPendingRecipes = async () => {
      try {
        const response = await API.get(`/recipes/pending?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
        setRecipes(response.data.pendingRecipesData || []);
        setTotalRecipeCount(response.data.totalPendingRecipes || 0);
      } catch (error) {
        console.error("Error fetching pending recipes:", error);
      }
    };

    fetchPendingRecipes();
    const interval = setInterval(fetchPendingRecipes, 3000);
    return () => clearInterval(interval);
  }, [search, page, limit, setPage, setSubPage, setTotalRecipeCount]);

  const updateRecipeStatus = async (recipe, action) => {
    try {
      const newStatus = action === "approve" ? "approved" : "rejected";
      await API.patch(`/moderations/${recipe.moderationInfo._id}`, { status: newStatus });
  
      // Remove the recipe from the list after approving or rejecting
      setRecipes((prevRecipes) => prevRecipes.filter((r) => r._id !== recipe._id));
  
      toast.success(`Recipe ${newStatus}!`);
    } catch (error) {
      console.error("Error updating recipe status:", error?.response?.data || error.message);
      toast.error("Failed to update recipe status.");
    }
  };
  

  const handleApprove = (recipe) => updateRecipeStatus(recipe, "approve");
  const handleReject = (recipe) => updateRecipeStatus(recipe, "reject");

  return (
    <section className="w-full px-5 min-[400px]:px-10 min-[500px]:px-16 sm:px-12 md:px-16 lg:px-24 xl:px-40 py-20 flex flex-col gap-8">
      <CustomBreadCrumb />
      <div className="flex border-b pb-0 mb-0">
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
              <TableHead className="w-1/5 text-left">Recipe Title</TableHead>
              <TableHead className="w-1/5 text-left">Submitted By</TableHead>
              <TableHead className="w-1/5 text-left">Status</TableHead>
              <TableHead className="w-1/5 text-left">Date</TableHead>
              <TableHead className="w-1/5 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes.map((recipe) => (
              <TableRow key={recipe._id} className="border-b hover:bg-gray-50">
                <TableCell className="w-1/5 text-left">{recipe.title}</TableCell>
                <TableCell className="w-1/5 text-left">{`${recipe.byUser?.firstName} ${recipe.byUser?.lastName}`}</TableCell>
                <TableCell className="w-1/5 text-left">{recipe.status}</TableCell>
                <TableCell className="w-1/5 text-left">{new Date(recipe.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="w-1/5 text-left">
                  <NavLink to={`/recipe/${recipe._id}`} className="mr-2">
                    <Button className="bg-blue-500">View</Button>
                  </NavLink>
                  <Button className="mr-2 bg-green-500" onClick={() => handleApprove(recipe)}>Approve</Button>
                  <Button className="bg-red-500" onClick={() => handleReject(recipe)}>Reject</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4">
          <CustomPagination />
        </div>
      </div>
    </section>
  );
};

export default PendingRecipes;
