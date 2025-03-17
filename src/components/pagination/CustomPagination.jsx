import PaginationControl from "@/components/pagination/PaginationControl";
import LimitSelect from "@/components/pagination/LimitSelect";
import SortOrderSelect from "@/components/pagination/SortOrderSelect";

//  ------------------------------------------------------------

const CustomPagination = () => {
  return (
    <div className="w-full flex flex-col-reverse gap-5 sm:grid sm:grid-cols-2 items-center">
      <div className="flex gap-3">
        <LimitSelect />
        <SortOrderSelect />
      </div>

      <PaginationControl />
    </div>
  );
};

export default CustomPagination;
