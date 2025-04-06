// Improted Libraries
import { cn } from "@/lib/utils";

// Imported Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Imported Custom Components
import TableAvatar from "./TableAvatar";
import WebTableSkeleton from "./WebTableSkeleton";

// ----------------------------------------------------------------------------------

const TableWebView = ({ tableHead, tableRows, isLoading, hasPendingMutation, columnWidth }) => {
  return (
    <Table className="hidden overflow-x-scroll lg:table">
      <TableHeader>
        <TableRow>
          {tableHead.map((head) => (
            <TableHead key={head} className="text-primary py-4 text-center">
              {head}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody className="border-b capitalize">
        {isLoading ? (
          <WebTableSkeleton tableHead={tableHead} />
        ) : (
          tableRows.map((row, rowIndex) => (
            <TableRow key={row.key || rowIndex} className="group border-b">
              {row.data.map((cell) => (
                <TableCell
                  key={`${cell.key}`}
                  className={cn(
                    "group-hover:text-primary border-r py-3 transition-colors",
                    columnWidth,
                    cell.className,
                  )}
                >
                  {cell.avatarUrl || cell.avatarUrl === "" ? (
                    // Cell With Avatar ->
                    <div className="flex items-center gap-2">
                      <TableAvatar
                        avatarUrl={cell.avatarUrl}
                        avatarFallback={cell.avatarFallback}
                      />
                      <span>{cell.value}</span>
                    </div>
                  ) : (
                    // Normal Cell ->
                    <span>{cell.value}</span>
                  )}
                </TableCell>
              ))}

              {/* Action Buttons */}
              {row.actions && (
                <TableCell className={cn("space-x-2 text-center", columnWidth)}>
                  {row.actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant={action.variant}
                      size={action.size}
                      onClick={action.onClick}
                      disabled={hasPendingMutation}
                    >
                      {action.label}
                    </Button>
                  ))}
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TableWebView;
