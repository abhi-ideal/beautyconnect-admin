import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";

export interface TableProps<TData, TValue> {
  isTableDataLoading: boolean;
  paginatedTableData?: UseGetTableResponseType<TData>;
  columns: ColumnDef<TData, TValue>[];
  details:any;
  statusFilter: string[];
  pagination?: PaginationState;
  setPagination?: Dispatch<SetStateAction<PaginationState>>;
  sorting?: SortingState;
  setSorting?: Dispatch<SetStateAction<SortingState>>;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: any;

  //Dispatch<SetStateAction<ColumnFiltersState>>;
}

export interface UseGetTableResponseType<TData> {
  per_page: number;
  page: number;
  counts: any;
  count:any;
  results: TData[];
}
