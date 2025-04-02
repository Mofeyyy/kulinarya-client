import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

//  ------------------------------------------------------------

const PaginationControl = ({ page, limit, onChange, totalRecipeCount }) => {
  const totalPages = Math.max(1, Math.ceil(totalRecipeCount / limit));

  return (
    <Pagination className="flex sm:justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onChange("page", Number(page) - 1)}
            disabled={page === 1}
            className="hover:text-primary transition hover:bg-transparent"
          />
        </PaginationItem>

        <PaginationItem>
          <p className="bg-primary rounded-lg border px-4 py-2 text-sm font-medium text-white">
            {page} of {totalPages}
          </p>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={() => onChange("page", Number(page) + 1)}
            disabled={page === totalPages}
            className="hover:text-primary transition hover:bg-transparent"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControl;
