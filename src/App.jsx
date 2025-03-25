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
const HomePage = lazy(() => import("@/pages/home/Home.jsx"));
const LoginPage = lazy(() => import("@/pages/auth/Login.jsx"));
const SignupPage = lazy(() => import("@/pages/auth/Signup.jsx"));
const VerifyPage = lazy(() => import("@/pages/auth/Verify.jsx"));
const RecipePage = lazy(() => import("@/pages/recipe/Recipe.jsx"));
const CreateRecipePage = lazy(() => import("@/pages/recipe/CreateRecipe.jsx"));
const ViewRecipePage = lazy(() => import("@/pages/recipe/ViewRecipe.jsx"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage.jsx"));

// Imported Hooks
import useFetchUserDetails from "./hooks/queries/useFetchUserDetails";
import useAuthStore from "./hooks/stores/useAuthStore";

// For Image Modal
import useImageModalStore from "./hooks/stores/useImageModalStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --------------------------------------------------------------------

function App() {
  const { isImageModalOpen } = useImageModalStore();

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
      {isImageModalOpen && <ImageModal />}

      <Router>
        <Suspense fallback={<ScreenLoader />}>
          <Routes>
            {/* Routes With No Layout */}
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="verify-email" element={<VerifyPage />} />

            {/* Routes With App Layout  */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />

              {/* Recipes Routes */}
              <Route path="recipes" element={<RecipePage />} />
              <Route path="recipes/create" element={<CreateRecipePage />} />
              <Route path="recipes/:recipeId" element={<ViewRecipePage />} />

              {/* Not Found Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

// ! Custom Components TO BE MOVED SOON -------------------------------
const ImageModal = () => {
  const { isImageModalOpen, imageSrc, closeImageModal } = useImageModalStore();

  return (
    <Dialog open={isImageModalOpen} onOpenChange={closeImageModal}>
      <DialogContent
        className="p-0 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[95vh] overflow-hidden outline-none"
        hasCloseButton={false}
      >
        <DialogHeader className="hidden">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>

        <img
          src={imageSrc}
          alt="imagePreview"
          className="rounded-lg object-cover w-full h-full cursor-zoom-out hover:opacity-80 transition"
          onClick={closeImageModal}
        />
      </DialogContent>
    </Dialog>
  );
};

export default App;
