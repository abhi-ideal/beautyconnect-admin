import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export interface UsePurchaseUserInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
  courseId:any
}

export interface UsePurchaseUserResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: PurchaseUser[];
}

export interface PurchaseUser {
    id: number
    name: string;
    email: string;
    profile: string;
}
