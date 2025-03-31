import { Outlet } from "react-router-dom";

// Imported Components
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import GlobalNavigationBlocker from "@/components/GlobalNavigationBlocker";

// -------------------------------------------------------------------

const AppLayout = () => {
  return (
    <div className="bg-background flex h-screen w-screen flex-col">
      <Header />

      <main className="w-full flex-1 overflow-y-auto">
        <Outlet />

        {/* <Footer /> */}
      </main>

      <GlobalNavigationBlocker />
    </div>
  );
};

export default AppLayout;
