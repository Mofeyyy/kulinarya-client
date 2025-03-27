import { Outlet } from "react-router-dom";

// Imported Components
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";

// -------------------------------------------------------------------

const AppLayout = () => {
  return (
    <div className="bg-background flex h-screen w-screen flex-col">
      <Header />

      <main className="w-full flex-1 overflow-y-auto">
        <Outlet />

        <Footer />
      </main>
    </div>
  );
};

export default AppLayout;
