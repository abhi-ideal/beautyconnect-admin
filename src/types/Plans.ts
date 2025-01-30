import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export interface UsePlansInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export interface UsePlansResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: Plans[];
}

export interface Plans {
  id: string;
  name: string;
  email: string;
  description: string;
  createdAt: string;
}
