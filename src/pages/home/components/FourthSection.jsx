const FourthSection = () => {
  return (
    <div className="grid w-full justify-center gap-10 lg:grid-cols-2 2xl:gap-20">
      <div className="flex flex-col gap-3 lg:gap-6">
        <h1 className="text-[clamp(24px,4vw,48px)] leading-tight font-bold">
          About <span className="text-primary">Us</span>
        </h1>

        <p className="text-muted-foreground text-justify text-[clamp(12px,2vw,18px)] leading-loose">
          Kulinarya is dedicated to showcasing and celebrating the rich flavors of Filipino cuisine.
          Our mission is to preserve and promote our gastronomic heritage by bringing together food
          lovers to share authentic recipes, cooking tips, and food stories. Through this platform,
          we aim to inspire a deeper appreciation for the diverse and vibrant culinary traditions of
          the Philippines
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-lg lg:flex">
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
