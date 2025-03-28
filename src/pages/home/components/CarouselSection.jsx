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
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {items.length > 0 &&
            items.map((item) => (
              <CarouselItem
                key={item._id}
                className="min-[500px]:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
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
