import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.title = "Home | Kulinarya";
  });

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
};

export default Home;
