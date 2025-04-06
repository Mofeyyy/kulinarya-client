import PaginationControl from "@/components/pagination/PaginationControl";
import LimitSelect from "@/components/pagination/LimitSelect";
import SortOrderSelect from "@/components/pagination/SortOrderSelect";

const CustomPagination = ({ filters, updateFilters, totalCount, totalPages, hasNextPage }) => {
  return (
    <div className="flex w-full flex-col-reverse items-center gap-5 sm:grid sm:grid-cols-2">
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <LimitSelect
          value={filters.limit}
          onChange={(val) => updateFilters("limit", Number(val))}
        />
        <SortOrderSelect
          value={filters.sortOrder}
          onChange={(val) => updateFilters("sortOrder", val)}
        />
      </div>

      <PaginationControl
        page={filters.page}
        onChange={updateFilters}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
      />
    </div>
  );
};

export default CustomPagination;
