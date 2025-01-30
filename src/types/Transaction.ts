import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export interface UseTransactionInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export interface UseTransactionResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: Transaction[];
}

export interface Transaction {
  id: string;
  userId: string;
  planId: string;
  payableAmount: number;
  diamond: number;
  paymentStatus:string;
  description: string;
  createdAt: string;
  updatedAt:string;
  userInfo: {
    id: number
    name: string;
    email: string;
    profile: string;
}
}
