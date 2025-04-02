const NoRecipesFound = () => {
  return (
    <div className="flex h-52 items-center justify-center">
      <p className="text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl">
        No Recipes <span className="text-primary animate-pulse">Found</span>
      </p>
    </div>
  );
};

export default NoRecipesFound;
