import { Table } from "@tanstack/react-table";
import TanStackBasicTablePaginationNavigationComponent from "./TanStackBasicTablePaginationNavigationComponent";

interface TanStackBasicTablePaginationComponentProps<TData> {
  table: Table<TData>;
}

export default function TanStackBasicTablePaginationComponent<TData>({
  table
}: TanStackBasicTablePaginationComponentProps<TData>) {
  return (
    <div className=" flex flex-wrap justify-center sm:justify-between items-center space-y-2 sticky bottom-0 bg-background px-3 py-2">
       <div className="flex flex-row gap-4 justify-center">
        <p className="whitespace-nowrap">Items per page</p>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="border"
        >
          {[10, 20, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        <p className="whitespace-nowrap">
          {`Page ${
            table.getState().pagination.pageIndex + 1
          } of ${table?.getPageCount()}`}
        </p>
      </div>
      <TanStackBasicTablePaginationNavigationComponent table={table} />
     
    </div>
  );
}
