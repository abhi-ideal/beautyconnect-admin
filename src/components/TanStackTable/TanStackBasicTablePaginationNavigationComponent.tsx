import { Table } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface TanStackBasicTablePaginationNavigationComponentProps<TData> {
  table: Table<TData>;
}

export default function TanStackBasicTablePaginationNavigationComponent<TData>({
  table,
}: TanStackBasicTablePaginationNavigationComponentProps<TData>) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className=" rounded-md hover:cursor-pointer">
          <PaginationPrevious onClick={() => table.previousPage()} />
        </PaginationItem>
        {table.getState().pagination.pageIndex + 1 >= 4 && (
          <PaginationItem className=" rounded-md hover:cursor-pointer">
            <PaginationLink onClick={() => table.setPageIndex(0)}>
            </PaginationLink>
          </PaginationItem>
        )}
        {table.getState().pagination.pageIndex + 1 >= 5 && (
          <PaginationItem className=" rounded-md hover:cursor-pointer">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {/* 2 pages before */}
        {table.getState().pagination.pageIndex + 1 - 2 > 0 && (
          <PaginationItem className=" rounded-md hover:cursor-pointer">
            <PaginationLink
              onClick={() =>
                table.setPageIndex(table.getState().pagination.pageIndex - 2)
              }
            >
              {table.getState().pagination.pageIndex + 1 - 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {/* 1 page before */}
        {table.getState().pagination.pageIndex + 1 - 1 > 0 && (
          <PaginationItem className=" rounded-md hover:cursor-pointer">
            <PaginationLink
              onClick={() =>
                table.setPageIndex(table.getState().pagination.pageIndex - 1)
              }
            >
              {table.getState().pagination.pageIndex + 1 - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {/* Current page */}
        <PaginationItem className="bg-violet-100 dark:bg-stone-700 rounded-md">
          <PaginationLink className="text-black dark:text-white">
            {table.getState().pagination.pageIndex + 1}
          </PaginationLink>
        </PaginationItem>
        {/* 1 page after */}
        {table.getState().pagination.pageIndex + 1 + 1 <=
          table?.getPageCount() && (
          <PaginationItem className=" rounded-md hover:cursor-pointer">
            <PaginationLink
              onClick={() =>
                table.setPageIndex(table.getState().pagination.pageIndex + 1)
              }
            >
              {table.getState().pagination.pageIndex + 1 + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {/* 2 page after */}
        {table.getState().pagination.pageIndex + 1 + 2 <=
          table?.getPageCount() && (
          <PaginationItem className=" rounded-md hover:cursor-pointer">
            <PaginationLink
              onClick={() =>
                table.setPageIndex(table.getState().pagination.pageIndex + 2)
              }
            >
              {table.getState().pagination.pageIndex + 1 + 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {table.getState().pagination.pageIndex + 1 + 2 <
          table?.getPageCount() - 1 && (
          <PaginationItem className=" rounded-md">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {table.getState().pagination.pageIndex + 1 + 2 <
          table?.getPageCount() && (
          <>
            <PaginationItem className=" rounded-md hover:cursor-pointer">
              <PaginationLink
                onClick={() => table.setPageIndex(table?.getPageCount())}
              >
                {table?.getPageCount()}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem className=" rounded-md hover:cursor-pointer">
          <PaginationNext onClick={() => table.nextPage()} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
