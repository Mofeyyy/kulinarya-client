// Imported Custom Components
import MobileTableActions from "./MobileTableActions";
import TableAvatar from "./TableAvatar";
import MobileTableSkeleton from "./MobileTableSkeleton";

// ----------------------------------------------------------------------------------

const TableMobileView = ({ tableHead, tableRows, isLoading, hasPendingMutation }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 lg:hidden">
      {isLoading ? (
        <MobileTableSkeleton />
      ) : (
        <>
          {tableRows.map((row) => (
            <div
              key={row.key}
              className="flex w-full max-w-lg flex-col gap-3 rounded-lg border p-4 capitalize shadow-lg"
            >
              <div className="flex justify-end">
                <MobileTableActions actions={row.actions} hasPendingMutation={hasPendingMutation} />
              </div>

              <div className="flex overflow-hidden rounded-[8px] border">
                {/* Headers */}
                <div className="flex w-full max-w-[160px] min-w-fit flex-col">
                  {tableHead.map((header) => (
                    <span
                      key={header}
                      className={`bg-primary/90 dark:bg-primary py-6 text-center font-medium text-white ${header === "Actions" && "hidden"}`}
                    >
                      {header}:
                    </span>
                  ))}
                </div>

                {/* Cells */}
                <div className="flex w-full flex-col">
                  {row.data.map((cell) => {
                    return cell.avatarUrl || cell.avatarUrl === "" ? (
                      // Cell With Avatar ->
                      <div key={cell.key} className="flex items-center justify-center gap-2 py-5">
                        <TableAvatar
                          avatarUrl={cell.avatarUrl}
                          avatarFallback={cell.avatarFallback}
                        />
                        <span>{cell.value}</span>
                      </div>
                    ) : (
                      // Normal Cell ->
                      <span key={cell.key} className="py-6 text-center">
                        {cell.value}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default TableMobileView;
