// Imported  Libraries
import { Outlet, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Imported Components
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";

// Imported Icons
import { ChevronLeft } from "lucide-react";

// Imported Custom Components
import ToggleThemeIconButton from "@/components/header/ToggleThemeIconButton";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import ControlSidebar from "@/components/control/ControlSidebar";

// Import Stores
import useAuthStore from "@/hooks/stores/useAuthStore";
import { useEffect } from "react";

// --------------------------------------------------------------

const ControlLayout = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userDetails = useAuthStore((state) => state.userDetails);
  const navigateTo = useNavigate();

  // Secure Route: For Admin and Creator Only
  useEffect(() => {
    if (!isLoggedIn && userDetails?.role !== "admin" && userDetails?.role !== "creator") {
      toast.error("Unauthorized Access", {
        duration: 5000,
      });
      navigateTo("/");
    }
  }, [isLoggedIn, userDetails]);
  return (
    <SidebarProvider>
      <ControlSidebar />

      <main className="bg-background flex h-screen w-screen flex-col overflow-hidden">
        {/* Header Section */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b px-10">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button className="!pr-5 shadow-lg">
                <ChevronLeft />
                <span>Home</span>
              </Button>
            </Link>

            <SidebarTrigger className="hover:bg-background bg-gradient-to-r from-orange-500 to-orange-600 !p-2 text-white shadow-lg transition-transform hover:scale-110" />
          </div>

          <ToggleThemeIconButton className="flex" />
        </header>

        {/* Content Section */}
        <section className="flex flex-1 flex-col overflow-hidden">
          {/* Breadcrumb Row */}
          <div className="flex h-20 w-full shrink-0 items-center px-10">
            <CustomBreadCrumb />
          </div>

          {/* Scrollable Outlet */}
          <div className="no-scrollbar flex flex-1 justify-center overflow-y-auto pb-5">
            <Outlet />
          </div>
        </section>
      </main>
    </SidebarProvider>
  );
};

export default ControlLayout;
