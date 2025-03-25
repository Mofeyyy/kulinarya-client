import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/hooks/stores/useAuthStore";
import { useEffect } from "react";
import toast from "react-hot-toast";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to access this page.");
    }
  }, []);

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
