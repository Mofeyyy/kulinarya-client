import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import useRecipeFilterStore from "@/hooks/stores/useRecipeFilterStore";

//  ------------------------------------------------------------

const PaginationControl = () => {
  const { page, setPage, limit, totalRecipeCount } = useRecipeFilterStore();

  const totalPages = Math.ceil(totalRecipeCount / limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Pagination className="flex sm:justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="hover:bg-transparent hover:text-primary transition"
          />
        </PaginationItem>

        <PaginationItem>
          <p className="px-4 py-2 text-sm font-medium border rounded-lg bg-primary text-white">
            {page} of {totalPages}
          </p>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="hover:bg-transparent hover:text-primary transition"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControl;
