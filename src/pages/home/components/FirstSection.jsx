import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const heroImages = [
  "https://wzevoniotfkqscqmqmiv.supabase.co/storage/v1/object/public/kulinarya-bucket/assets/hero.jpg",
  "https://wzevoniotfkqscqmqmiv.supabase.co/storage/v1/object/public/kulinarya-bucket/assets/sample-food-2.jpg",
  "https://wzevoniotfkqscqmqmiv.supabase.co/storage/v1/object/public/kulinarya-bucket/assets/sample-food-3.jpg",
];

const FirstSection = () => {
  return (
    <div className="grid w-full justify-center gap-10 xl:grid-cols-2 2xl:gap-20">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl leading-tight font-bold sm:text-5xl lg:text-6xl">
          <span className="text-primary">Share, Discover,</span> and{" "}
          <span className="text-primary">Enjoy</span>!
        </h1>

        <p className="text-muted-foreground text-justify text-sm leading-loose sm:text-lg">
          Kulinarya is a community-driven platform where foodies and home cooks can share their
          favorite recipes, explore new dishes, and connect with like-minded individuals. Focused on
          celebrating Filipino gastronomy, Kulinarya showcases the rich flavors, unique cooking
          techniques, and diverse culinary traditions of the Philippines. Whether you're a seasoned
          chef or just starting your culinary journey, Kulinarya offers a space to discover,
          preserve, and share the essence of Filipino cuisine with the world.
        </p>
      </div>

      {/* Swiper.js Slideshow */}
      <div className="hidden items-center justify-center xl:flex">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          className="h-full w-full rounded-lg shadow-lg"
        >
          {heroImages.map((image, index) => (
            <SwiperSlide
              key={index}
              className="flex h-full w-full items-center justify-center rounded-lg"
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="h-full w-full rounded-lg object-cover"
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FirstSection;
