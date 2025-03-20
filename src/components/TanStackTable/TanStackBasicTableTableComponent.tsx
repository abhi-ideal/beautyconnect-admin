import { Header, Table as TableType, flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import Image from "next/image";

interface TanStackBasicTableTableComponentProps<TData> {
  table: TableType<TData>;
  details:any;
  cursorPointer:any;
}

export default function TanStackBasicTableTableComponent<TData>({
  details,
  cursorPointer,
  table
}: TanStackBasicTableTableComponentProps<TData>) {
  const sortToggler = (header: Header<TData, unknown>) => {
    if (header.column.getCanSort()) {
      header.column.toggleSorting(undefined, true);
      //TODO: need to add sorting functionality
      header.column.toggleSorting(undefined, true);
    }
  };

   const getDetail=(data:any)=>{
    data?.column?.id!='actions' && details(data?.row?.original, data?.column?.id);
   }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((header) => (
          <TableRow key={header.id}>
            <TableHead>S.N.</TableHead>
            {header.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : (
                  <div
                    // onClick={() => sortToggler(header)}
                    className="hover:cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
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
        {table.getRowModel().rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={100} className="text-center">
              <div className="inline-block p-20 xl:p-36">
                <Image src="/no-data.svg" alt="Logo" width={320} height={320} priority className="size-[150px]" />
                <span className="font-semibold text-lg">No Record Found</span>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          <>
            {table.getRowModel().rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>
                  {table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    (index + 1)}
                </TableCell>
                {row.getVisibleCells().map((cell: any) => (
                  <TableCell key={cell.id} onClick={()=>getDetail(cell )} className={cursorPointer}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </>
        )}
      </TableBody>
    </Table>
  );
}
