import { useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

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
    <div className="h-screen w-screen bg-gray-900 flex justify-center items-center">
      <Toaster />

      <p className="text-5xl font-bold text-white">Kulinarya Frontend</p>
    </div>
  );
}

export default App;
