// Imported Libraries
import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// Imported Config
import API from "@/config/axios";

// Imported Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Imported Custom Components
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import SearchInput from "@/pages/recipe/components/SearchInput";
import CustomPagination from "@/components/pagination/CustomPagination";

// Imported Stores
import usePageStore from "@/hooks/stores/usePageStore";
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore";

// ---------------------------------------------------------------------------------------------
const PendingRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const { search, page, limit, setTotalRecipeCount } = useRecipeFilterStore();
  const { setPage, setSubPage } = usePageStore();

  useEffect(() => {
    document.title = "Pending Recipes | Kulinarya";
    setPage({ href: "/admin/dashboard", name: "Admin" });
    setSubPage({ href: "/admin/pending-recipes", name: "Pending Recipes" });

    const fetchPendingRecipes = async () => {
      try {
        const response = await API.get(
          `/recipes/pending?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        );
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
    <div className="container flex w-full flex-col gap-10">
      <div className="p-0">
        <div className="mb-4 flex items-center justify-end">
          <SearchInput />
        </div>

        <Table>
          <TableHeader>
            <TableRow className="group">
              {["Recipe Title", "Submitted By", "Status", "Date", "Actions"].map((head) => (
                <TableHead
                  key={head}
                  className="group-hover:text-primary w-1/5 py-4 text-left transition-colors"
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {recipes.map((recipe) => (
              <TableRow key={recipe._id} className="group">
                <TableCell className="group-hover:text-primary w-1/5 text-left transition-colors">
                  {recipe.title}
                </TableCell>

                <TableCell className="group-hover:text-primary w-1/5 text-left transition-colors">{`${recipe.byUser?.firstName} ${recipe.byUser?.lastName}`}</TableCell>

                <TableCell className="group-hover:text-primary w-1/5 text-left transition-colors">
                  {recipe.status}
                </TableCell>

                <TableCell className="group-hover:text-primary w-1/5 text-left transition-colors">
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="w-1/5 space-x-2 text-left">
                  <NavLink to={`/recipe/${recipe._id}`}>
                    <Button size="sm" className="rounded-sm">
                      View
                    </Button>
                  </NavLink>
                  <Button
                    variant="outline"
                    className="rounded-sm"
                    onClick={() => handleApprove(recipe)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-sm"
                    onClick={() => handleReject(recipe)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* <div className="mt-4"><CustomPagination /></div> */}
      </div>
    </div>
  );
};

export default PendingRecipes;
