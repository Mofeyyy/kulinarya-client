import { useEffect, Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

// Providers
import { ThemeProvider } from "@/providers/ThemeProvider";

// Layouts
import AppLayout from "@/layouts/AppLayout";

// Imported Icons
import { TriangleAlert } from "lucide-react";

// Components
import ScreenLoader from "@/components/ScreenLoader";
import ProtectedRoute from "@/components/ProtectedRoute";
import ImageModal from "@/components/ImageModal";
import PendingModerationToast from "./components/PendingModerationToast";

// Hooks & Stores
import useFetchUserDetails from "@/hooks/queries/useFetchUserDetails";
import useAuthStore from "@/hooks/stores/useAuthStore";
import useImageModalStore from "@/hooks/stores/useImageModalStore";
import usePendingModerationCount from "./hooks/queries/usePendingModerationCount";

// Imported Config
import { BASE_URL } from "@/config/axios";

// Lazy Loaded Pages
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const HomePage = lazy(() => import("@/pages/home/Home"));
const LoginPage = lazy(() => import("@/pages/auth/Login"));
const SignupPage = lazy(() => import("@/pages/auth/Signup"));
const VerifyPage = lazy(() => import("@/pages/auth/Verify"));
const RecipeFeedPage = lazy(() => import("@/pages/recipe/RecipeFeed"));
const CreateRecipePage = lazy(() => import("@/pages/recipe/CreateRecipe"));
const ViewRecipePage = lazy(() => import("@/pages/recipe/view/ViewRecipe"));
const EditRecipePage = lazy(() => import("@/pages/recipe/EditRecipe"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const PendingRecipePost = lazy(() => import("@/pages/admin/PendingRecipePost"));
const FeatureRecipes = lazy(() => import("@/pages/admin/FeatureRecipes"));
const ProfilePageView = lazy(() => import("@/pages/ProfileView"));
const SpecificUserProfileView = lazy(() => import("@/pages/SpecificUserProfileView"));
const AnnouncementForm = lazy(() => import("@/pages/AnnouncmentForm"));
const AnnouncementView = lazy(() => import("@/pages/AnnouncementView"));
const ModerationPage = lazy(() => import("@/pages/ModerationPage"));

// DEFINED ROUTES
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // Main layout
    errorElement: <NotFoundPage />, // Handles errors inside AppLayout
    children: [
      { index: true, element: <LandingPage /> },
      { path: "home", element: <HomePage /> },
      { path: "admin/dashboard", element: <AdminDashboard /> },
      { path: "admin/pending-recipes", element: <PendingRecipePost /> },
      { path: "admin/feature-recipes", element: <FeatureRecipes /> },
      { path: "profile", element: <ProfilePageView /> },
      { path: "profile/:userId", element: <SpecificUserProfileView /> },
      { path: "announcements/create", element: <AnnouncementForm /> },
      { path: "announcements/:announcementId", element: <AnnouncementView /> },
      { path: "recipes", element: <RecipeFeedPage /> },
      { path: "recipes/:recipeId", element: <ViewRecipePage /> },

      {
        element: <ProtectedRoute />, // Protects routes under this wrapper
        children: [
          { path: "recipes/create", element: <CreateRecipePage /> },
          { path: "recipes/:recipeId/edit", element: <EditRecipePage /> },
          { path: "moderation/:recipeId", element: <ModerationPage /> },
        ],
      },
    ],
  },

  // Auth Routes (Outside AppLayout)
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignupPage /> },
  { path: "verify-email", element: <VerifyPage /> },

  // Catch-all for 404 pages
  { path: "*", element: <NotFoundPage className="h-screen" /> },
]);

// --------------------------------------------------------------------

const App = () => {
  const { isImageModalOpen } = useImageModalStore();
  const setUserDetails = useAuthStore((state) => state.setUserDetails);
  const userDetails = useAuthStore((state) => state.userDetails);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { data: fetchedUserData } = useFetchUserDetails(isLoggedIn);

  const isAuthorized = userDetails?.role === "admin" || userDetails?.role === "creator";
  const { data: pendingModerationCount } = usePendingModerationCount(isAuthorized);

  // Initial DB Connection Check
  useEffect(() => {
    const checkDBConnection = async () => {
      try {
        const response = await axios.get(BASE_URL);
        if (response.status === 201) {
          toast.success(response.data.message);
        }
        console.log(response.data);
      } catch (err) {
        console.log(`Error: ${err}`);
      }
    };
    checkDBConnection();
  }, []);

  // Fetch User Details
  useEffect(() => {
    if (fetchedUserData) {
      setUserDetails(fetchedUserData.user);
    }
  }, [fetchedUserData, setUserDetails]);

  // Pending Moderation Toast
  useEffect(() => {
    if (!pendingModerationCount) return;

    const toastId = toast.custom(
      (t) => (
        <PendingModerationToast
          toastId={t}
          pendingModerationCount={pendingModerationCount}
          onViewClick={() => {
            toast.dismiss(toastId);
            router.navigate("/recipes/");
          }}
        />
      ),
      {
        duration: 5000,
      },
    );

    return () => {
      toast.dismiss(toastId);
    };
  }, [pendingModerationCount]);

  return (
    <ThemeProvider>
      <Toaster />
      {isImageModalOpen && <ImageModal />}
      <Suspense fallback={<ScreenLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
