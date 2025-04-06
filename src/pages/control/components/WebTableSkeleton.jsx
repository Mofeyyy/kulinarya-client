// Imported Components
import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// ----------------------------------------------------------------------------------

const WebTableSkeleton = ({ tableHead }) => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <TableRow key={index} className="hover:bg-background rounded-lg border-0">
          <TableCell colSpan={tableHead.length}>
            <Skeleton className="h-10 w-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default WebTableSkeleton;
