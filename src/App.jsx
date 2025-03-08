import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// Imported Context
import { ThemeProvider } from "@/providers/ThemeProvider";
import useAuthStore from "@/stores/useAuthStore.js";

// Imported Layouts
import AppLayout from "@/layouts/AppLayout";

// Imported Components
import ScreenLoader from "@/components/ScreenLoader";

// Imported Pages With Lazy Loading
const HomePage = lazy(() => import("@/pages/home/Home.jsx"));
const LoginPage = lazy(() => import("@/pages/auth/Login.jsx"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage.jsx"));

// --------------------------------------------------------------------

function App() {
  const { fetchUser } = useAuthStore();

  // Initial Login and Test DB Connection
  useEffect(() => {
    axios
      .get("http://localhost:4000/")
      .then((response) => {
        if (response.status === 201) {
          toast.success(response.data.message);
        }
        console.log(response.data);
      })
      .catch((error) => console.log(`Error: ${error}`));
  }, []);

  // Auto Fetch Login Credentials If User Is Already Logged In
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <ThemeProvider>
      <Toaster />

      <Router>
        <Suspense fallback={<ScreenLoader />}>
          <Routes>
            <Route path="login" element={<LoginPage />} />

            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />

              {/* <Route path="recipes" element={<RecipePage />} /> */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
