import { useState } from "react";
import { cn } from "@/lib/utils";
import defaultFallbackImage from "@/assets/default-fallback-image.png";

const ImageWithFallback = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(src || defaultFallbackImage);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn("object-cover", className)}
      onError={() => setImageSrc(defaultFallbackImage)}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
