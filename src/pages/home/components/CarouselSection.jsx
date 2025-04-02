import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CarouselSection = ({ title, description, items, renderItem }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        <h2 className="text-[clamp(20px,3vw,36px)] font-bold">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-[clamp(12px,1.5vw,18px)]">{description}</p>
        )}
      </div>

      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className="pb-5">
          {items.length > 0 &&
            items.map((item) => (
              <CarouselItem
                key={item._id}
                className="min-[550px]:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
              >
                {renderItem(item)}
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="size-16" />
        <CarouselNext className="size-16" />
      </Carousel>
    </div>
  );
};

export default CarouselSection;
