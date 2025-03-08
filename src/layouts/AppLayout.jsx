import { Outlet } from "react-router-dom";

// Imported Components
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";

// -------------------------------------------------------------------

const AppLayout = () => {
  return (
    <div className="w-screen h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto">
        <Outlet />

        <Footer />
      </main>
    </div>
  );
};

export default AppLayout;
