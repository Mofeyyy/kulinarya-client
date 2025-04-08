import { useEffect, Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

// Providers
import { ThemeProvider } from "@/providers/ThemeProvider";

// Components
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
const AdminDashboard = lazy(() => import("@/pages/control/AdminDashboard"));
const PendingRecipePage = lazy(() => import("@/pages/control/PendingRecipePage"));
const FeatureRecipes = lazy(() => import("@/pages/control/FeatureRecipes"));
const ProfilePageView = lazy(() => import("@/pages/ProfileView"));
const SpecificUserProfileView = lazy(() => import("@/pages/SpecificUserProfileView"));
const ModerationPage = lazy(() => import("@/pages/ModerationPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const AnnouncementCreateView = lazy(
  () => import("@/pages/home/AnnouncementModal/views/AnnouncementCreateView"),
);
const AnnouncementFullView = lazy(
  () => import("@/pages/home/AnnouncementModal/views/AnnouncementFullView"),
);
const ProfileEditPage = lazy(() => import("@/pages/profile/ProfileEditPage"));
const ResendVerificationPage = lazy(() => import("@/pages/auth/ResendVerificationPage"));
const RecipeRankings = lazy(() => import("@/pages/control/RecipeRankings"));

// Layouts
const ControlLayout = lazy(() => import("@/layouts/ControlLayout"));
const AppLayout = lazy(() => import("@/layouts/AppLayout"));
const ScreenLoader = lazy(() => import("@/components/ScreenLoader"));
const ProtectedRoute = lazy(() => import("@/components/ProtectedRoute"));
const AdminAnalyticsDashboard = lazy(() => import("@/pages/control/AnalyticsDashboard"));

// DEFINED ROUTES
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // Main layout
    errorElement: <NotFoundPage />, // Handles errors inside AppLayout
    children: [
      { index: true, element: <LandingPage /> },
      { path: "home", element: <HomePage /> },
      // { path: "profile", element: <ProfilePageView /> },
      // { path: "profile/:userId", element: <SpecificUserProfileView /> },
      { path: "announcements/create", element: <AnnouncementCreateView /> },
      { path: "announcements/:announcementId", element: <AnnouncementFullView /> },
      { path: "recipes", element: <RecipeFeedPage /> },
      { path: "recipes/:recipeId", element: <ViewRecipePage /> },

      {
        element: <ProtectedRoute />, // Protects routes under this wrapper
        children: [
          // Login Protected Recipe Routes
          { path: "recipes/create", element: <CreateRecipePage /> },
          { path: "recipes/:recipeId/edit", element: <EditRecipePage /> },

          // Login Protected Moderation Route
          { path: "moderation/:recipeId", element: <ModerationPage /> },

          // Login Protected Profile Routes
          { path: "profile/:userId", element: <ProfilePageView /> },
          // { path: "profile/:userId", element: <SpecificUserProfileView /> },
          { path: "profile/edit", element: <ProfileEditPage /> },
        ],
      },
    ],
  },

  // Login Protected Control Routes
  {
    path: "control",
    element: <ControlLayout />,
    errorElement: <NotFoundPage />, // Handles errors inside ControlLayout
    children: [
      { path: "dashboard", element: <AdminAnalyticsDashboard /> },
      { path: "pending-recipes", element: <PendingRecipePage /> },
      { path: "feature-recipes", element: <FeatureRecipes /> },
      { path: "users", element: <AdminDashboard /> },
      { path: "announcements/create", element: <AnnouncementCreateView /> },
      { path: "ranked-recipes", element: <RecipeRankings /> },
    ],
  },

  // Auth Routes (Outside AppLayout and ControlLayout)
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignupPage /> },
  { path: "verify-email", element: <VerifyPage /> },
  { path: "resend-verification", element: <ResendVerificationPage /> },
  { path: "forgot-password", element: <ForgotPasswordPage /> },
  { path: "reset-password", element: <ResetPasswordPage /> },

  // Catch-all for 404 pages
  {
    path: "*",
    element: <NotFoundPage className="h-screen" />,
  },
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
    if (fetchedUserData?.user) {
      const user = fetchedUserData.user;
      const canPostRecipe = fetchedUserData.canPostRecipe;
      setUserDetails({ ...user, canPostRecipe });

      if (user.isEmailVerified === false) {
        useAuthStore.getState().logout();
        router.navigate("/resend-verification");
      }
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
            router.navigate("/control/pending-recipes");
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
