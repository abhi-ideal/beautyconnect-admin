import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export interface UseTransactionHistoryInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
  userId: any;
}

export interface UseTransactionHistoryResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: TransactionHistory[];
}

export interface TransactionHistory {
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
