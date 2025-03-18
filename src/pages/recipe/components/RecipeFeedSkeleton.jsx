import { Skeleton } from "@/components/ui/skeleton";

// ------------------------------------------------------------

const RecipeFeedSkeleton = () => {
  const skeletonItems = Array.from({ length: 8 });

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {skeletonItems.map((_, index) => (
        <Skeleton
          key={index}
          className="rounded-lg h-60 bg-primary/10 flex flex-col gap-2"
        />
      ))}
    </div>
  );
};

export default RecipeFeedSkeleton;
