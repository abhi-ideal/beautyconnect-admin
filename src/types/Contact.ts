import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export interface UseContactInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export interface UseContactResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: Contact[];
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  description: string;
  createdAt: string;
}
