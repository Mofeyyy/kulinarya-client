import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// Imported Context
import { ThemeProvider } from "@/providers/ThemeProvider";

// Imported Layouts
import AppLayout from "@/layouts/AppLayout";

// Imported Components
import ScreenLoader from "@/components/ScreenLoader";

// Imported Pages With Lazy Loading
const LandingPage = lazy(() => import("@/pages/LandingPage.jsx"));
const HomePage = lazy(() => import("@/pages/home/Home.jsx"));
const LoginPage = lazy(() => import("@/pages/auth/Login.jsx"));
const SignupPage = lazy(() => import("@/pages/auth/Signup.jsx"));
const VerifyPage = lazy(() => import("@/pages/auth/Verify.jsx"));
const RecipePage = lazy(() => import("@/pages/recipe/Recipe.jsx"));
const CreateRecipePage = lazy(() => import("@/pages/recipe/CreateRecipe.jsx"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage.jsx"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard.jsx"));
const PendingRecipePost = lazy(() => import("@/pages/admin/PendingRecipePost.jsx"));
const FeatureRecipes = lazy(() => import("@/pages/admin/FeatureRecipes.jsx"));

// Imported Hooks
import useFetchUserDetails from "./hooks/queries/useFetchUserDetails";
import useAuthStore from "./hooks/stores/useAuthStore";

// --------------------------------------------------------------------

function App() {
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

  // Fetching the user details on page load
  const { setUserDetails, isLoggedIn } = useAuthStore();
  const { data: fetchedUserData } = useFetchUserDetails(isLoggedIn);
  useEffect(() => {
    if (fetchedUserData) {
      const { user } = fetchedUserData;
      setUserDetails(user);
    }
  }, [fetchedUserData, setUserDetails]);

  return (
    <ThemeProvider>
      <Toaster />

      <Router>
        <Suspense fallback={<ScreenLoader />}>
          <Routes>
            {/* Routes With No Layout */}
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="verify-email" element={<VerifyPage />} />

            {/* Routes With App Layout  */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="home" element={<HomePage />} />
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/pending-recipes" element={<PendingRecipePost />} />
              <Route path="admin/feature-recipes" element={<FeatureRecipes />} />
              <Route index element={<HomePage />} />

              {/* Recipes Routes */}
              <Route path="recipes" element={<RecipePage />} />
              <Route path="recipes/create" element={<CreateRecipePage />} />

              {/* Not Found Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
