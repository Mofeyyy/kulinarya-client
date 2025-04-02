import RecipeDisplayCard from "./RecipeDisplayCard";

// ------------------------------------------------------------

const RecipesDisplay = ({ recipes }) => {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes?.map((recipe) => (
        <RecipeDisplayCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipesDisplay;
