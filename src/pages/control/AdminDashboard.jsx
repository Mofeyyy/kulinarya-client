import { useEffect, useState } from "react";
import API from "@/config/axios"; // ✅ Use the configured API instance
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import usePageStore from "@/hooks/stores/usePageStore";
import CustomPagination from "@/components/pagination/CustomPagination";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const { setPage, setSubPage } = usePageStore();

  useEffect(() => {
    document.title = "Admin Dashboard | Kulinarya";
    setPage({ href: "/admin/dashboard", name: "Admin" });
    setSubPage({ href: "/admin/dashboard", name: "Admin Dashboard" });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/users/all");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 30000); // Fetch every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <section className="flex w-full flex-col gap-8 px-5 py-20 min-[400px]:px-10 min-[500px]:px-16 sm:px-12 md:px-16 lg:px-24 xl:px-40">
      <CustomBreadCrumb />
      <div className="container mx-auto p-4">
        {/* Tabs with Active Styling */}
        <div className="mb-4 flex border-b pb-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `mr-4 border-b-2 font-semibold ${
                isActive ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500"
              }`
            }
          >
            Admin Dashboard
          </NavLink>
          <NavLink
            to="/admin/pending-recipes"
            className={({ isActive }) =>
              `mr-4 border-b-2 font-semibold ${
                isActive ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500"
              }`
            }
          >
            Pending Recipe Post
          </NavLink>
          <NavLink
            to="/admin/feature-recipes"
            className={({ isActive }) =>
              `border-b-2 font-semibold ${
                isActive ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500"
              }`
            }
          >
            Feature Recipe
          </NavLink>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex justify-end">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-md border py-2 pr-4 pl-10"
            />
            <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
          </div>
        </div>

        {/* User Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5 text-left">User Name</TableHead>
              <TableHead className="w-1/5 text-left">Email</TableHead>
              <TableHead className="w-1/5 text-left">Role</TableHead>
              <TableHead className="w-1/5 text-left">Date Joined</TableHead>
              <TableHead className="w-1/5 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="w-1/5 text-left">{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell className="w-1/5 text-left">{user.email}</TableCell>
                <TableCell className="w-1/5 text-left">{user.role}</TableCell>
                <TableCell className="w-1/5 text-left">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="w-1/5 text-left">
                  <div className="flex gap-6">
                    <Button className="bg-orange-500">Edit</Button>
                    <Button className="bg-red-500">Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4">{/* <CustomPagination /> */}</div>
      </div>
    </section>
  );
};

export default AdminDashboard;
