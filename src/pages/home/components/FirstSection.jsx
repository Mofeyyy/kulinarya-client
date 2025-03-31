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
    <div className="grid w-full justify-center gap-10 lg:grid-cols-2 2xl:gap-20">
      <div className="flex flex-col gap-3 lg:gap-6">
        <h1 className="text-[clamp(24px,4vw,48px)] leading-tight font-bold">
          <span className="text-primary">Share, Discover,</span> and{" "}
          <span className="text-primary">Enjoy</span>!
        </h1>

        <p className="text-muted-foreground text-justify text-[clamp(12px,2vw,18px)] leading-loose">
          Kulinarya is a community-driven platform for food lovers to share recipes, explore new
          dishes, and connect. Celebrating Filipino gastronomy, it highlights rich flavors, unique
          techniques, and diverse traditions. Whether you're a seasoned chef or a beginner,
          Kulinarya is your space to discover, preserve, and share Filipino cuisine with the world.
        </p>
      </div>

      {/* Swiper.js Slideshow */}
      <div className="hidden items-center justify-center lg:flex">
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
