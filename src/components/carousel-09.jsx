"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import ImageWithFallback from "./ImageWithFallback";

// ------------------------------------------------------------------------------

export default function CarouselWithThumbs({ recipeImages }) {
  const [api, setApi] = React.useState();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleThumbClick = React.useCallback(
    (index) => {
      api?.scrollTo(index);
    },
    [api],
  );

  return (
    <div className="w-full">
      {" "}
      {/* Ensure parent allows shadows to be visible */}
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent className="px-[4px] pb-[18px]">
          {recipeImages.map((url, index) => (
            <CarouselItem key={index}>
              <ImageWithFallback src={url} className="aspect-square w-full rounded-lg shadow-lg" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* Thumbnail Carousel */}
      <Carousel className="w-full">
        <CarouselContent className="flex">
          {recipeImages.map((url, index) => (
            <CarouselItem
              key={index}
              className={cn(
                "basis-1/3 cursor-pointer pb-4 sm:basis-1/4 md:basis-1/5 lg:max-xl:basis-1/4",
                current === index + 1 ? "opacity-100" : "opacity-50",
              )}
              onClick={() => handleThumbClick(index)}
            >
              <ImageWithFallback
                src={url}
                className="aspect-square h-full w-full rounded-lg shadow-lg"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="sm:size-12 md:max-lg:hidden xl:hidden" />
        <CarouselNext className="sm:size-12 md:max-lg:hidden xl:hidden" />
      </Carousel>
    </div>
  );
}
