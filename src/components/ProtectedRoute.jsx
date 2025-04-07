import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/hooks/stores/useAuthStore";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const ProtectedRoute = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userDetails = useAuthStore((state) => state.userDetails);
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!isLoggedIn || !userDetails) {
      if (!hasShownToast.current) {
        toast.error("Unauthorized Access!", {
          duration: 5000,
        });
        hasShownToast.current = true;
      }
    }
  }, []);

  return isLoggedIn && userDetails ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
