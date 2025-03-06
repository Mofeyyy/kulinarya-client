import { useEffect } from "react";
import { ThemeProvider } from "@/context/theme-provider";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ModeToggle } from "./components/mode-toggle";

function App() {
  // Test DB Connection
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

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="h-screen w-screen bg-background flex justify-center items-center">
        <Toaster />
        <ModeToggle />
      </div>
    </ThemeProvider>
  );
}

export default App;
