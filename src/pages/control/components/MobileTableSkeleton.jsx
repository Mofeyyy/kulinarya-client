// Imported Components
import { Skeleton } from "@/components/ui/skeleton";

// ----------------------------------------------------------------------------------

const MobileTableSkeleton = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton key={index} className="h-96 w-full" />
      ))}
    </>
  );
};

export default MobileTableSkeleton;
