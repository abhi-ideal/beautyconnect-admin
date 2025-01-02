import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { useEffect } from "react";
import TanStackBasicTablePaginationComponent from "./TanStackBasicTablePaginationComponent";
import TanStackBasicTableFilterComponent from "./TanStackBasicTableFilterComponent";
import TanStackBasicTableTableComponent from "./TanStackBasicTableTableComponent";
import { TableProps } from "@/types/Table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";

export default function TanStackBasicTable<TData, TValue>({
  isTableDataLoading,
  paginatedTableData,
  columns,
  pagination = {
    pageIndex: 0,
    pageSize: 2
  },
  sorting = [],
  setSorting,
  setPagination,
  columnFilters = [],
  statusFilter,
  details,
  setColumnFilters
}: TableProps<TData, TValue>) {
  const table = useReactTable({
    data: paginatedTableData?.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // sort config
    onSortingChange: setSorting,
    // enableMultiSort: false,
    // manualSorting: true,
    sortDescFirst: true,
    // enableSortingRemoval: true,
    // filter config
    // getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    manualFiltering: true,
    // pagination config
    // getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    // rowCount: paginatedTableData?.total_filtered,
    // pageCount: Math.ceil(
    //   (paginatedTableData?.count || 0) / (paginatedTableData?.per_page || 1)
    // ),
    pageCount: Math.ceil(
      (paginatedTableData?.counts || paginatedTableData?.count || 0) /
        (pagination?.pageSize || 1)
    ),
    manualPagination: true,
    state: {
      sorting,
      pagination,
      columnFilters
    }
  });

  // console.log(columnFilters, "columnFilters");

  // to reset page index to first page
  useEffect(() => {
    if (setPagination) {
      setPagination((pagination) => ({
        pageIndex: 0,
        pageSize: pagination.pageSize
      }));
    }
  }, [columnFilters, setPagination]);

  const shimmer = [...Array(20)];
  return (
    <div className="p-8">
      <TanStackBasicTableFilterComponent
        table={table}
        setColumnFilters={setColumnFilters}
        statusFilter={statusFilter}
      />

      {isTableDataLoading ? (
        <div className="flex flex-col space-y-3 border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((header) => (
                <TableRow key={header.id}>
                  <TableHead>S.N.</TableHead>
                  {header.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div className="hover:cursor-pointer">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {(header.column.getIsSorted() === "asc" ||
                            header.column.getIsSorted() === "desc") && (
                            <span>
                              {header.column.getIsSorted() === "asc" && "↑"}
                              {header.column.getIsSorted() === "desc" && "↓"}
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {shimmer.map((index, i) => (
                <TableRow key={i}>
                  {table.getFlatHeaders().map((i: any) => (
                    <TableCell key={i.id}>
                      <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Skeleton className="h-4 w-[50px]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          <div className="rounded-md border p-4">
            <div>
            {/* className="mb-8" */}
              <TanStackBasicTableTableComponent table={table} details={details}/>
            </div>
            {(paginatedTableData?.counts > 10 ||
              paginatedTableData?.count > 10) && (
              <TanStackBasicTablePaginationComponent table={table} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
