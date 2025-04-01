import useImageModalStore from "@/hooks/stores/useImageModalStore";
import useRecipeStore from "@/hooks/stores/useRecipeStore";

// ----------------------------------------------------------------

const RecipeImages = () => {
  const { openImageModal } = useImageModalStore();
  const { recipe } = useRecipeStore();
  const { mainPictureUrl, additionalPicturesUrls } = recipe;

  const handleImageClick = (url) => {
    openImageModal(url);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Main Image */}
      <img
        src={mainPictureUrl}
        alt="Main Recipe"
        className="h-[400px] w-full cursor-zoom-in rounded-lg object-cover shadow-lg transition will-change-[transform,opacity] hover:opacity-80 sm:h-[600px] md:h-[700px] lg:h-[600px] 2xl:h-[700px]"
        onClick={() => handleImageClick(mainPictureUrl)}
        loading="lazy"
      />

      {/* Additional Images */}
      <div className="grid grid-cols-5 gap-2">
        {additionalPicturesUrls.map((url, index) => (
          <div
            key={index}
            className="aspect-square h-16 w-full overflow-hidden rounded-lg shadow-lg min-[500px]:h-20 sm:h-24 md:h-28 lg:h-32"
          >
            <img
              src={url}
              alt={`Additional ${index + 1}`}
              className="h-full w-full cursor-zoom-in object-cover transition will-change-[transform,opacity] hover:opacity-80"
              onClick={() => handleImageClick(url)}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeImages;
