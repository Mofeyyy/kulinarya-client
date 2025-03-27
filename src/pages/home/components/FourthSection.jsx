const FourthSection = () => {
  return (
    <div className="grid w-full justify-center gap-10 xl:grid-cols-2 2xl:gap-20">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl leading-tight font-bold sm:text-5xl lg:text-6xl">
          About <span className="text-primary">Us</span>
        </h1>

        <p className="text-muted-foreground text-justify text-sm leading-loose sm:text-lg">
          Kulinarya is dedicated to showcasing and celebrating the rich flavors of Filipino cuisine.
          Our mission is to preserve and promote our gastronomic heritage by bringing together food
          lovers to share authentic recipes, cooking tips, and food stories. Through this platform,
          we aim to inspire a deeper appreciation for the diverse and vibrant culinary traditions of
          the Philippines
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-lg xl:flex">
        <img
          src="https://wzevoniotfkqscqmqmiv.supabase.co/storage/v1/object/public/kulinarya-bucket/assets/chef-cooking.jpg"
          alt="chefCooking"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default FourthSection;
