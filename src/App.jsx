import { useEffect } from "react";
import axios from "axios";

function App() {
  // Test DB Connection
  useEffect(() => {
    axios
      .get("http://localhost:4000/")
      .then((response) => console.log(response.data))
      .catch((error) => console.log(`Error: ${error}`));
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-900 flex justify-center items-center">
      <p className="text-5xl font-bold text-white">Kulinarya Frontend</p>
    </div>
  );
}

export default App;
