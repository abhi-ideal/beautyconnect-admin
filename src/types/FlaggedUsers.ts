import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

export interface UseFlaggedUsersInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export interface UseFlaggedUsersResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: flaggedUser[];
}

export interface flaggedUser {
  actionId: number,
  userData: {
      status: string;
      id: number,
      image: string,
      name: string
  },
  reportedUser: reportedUser[]
}

export interface reportedUser {
  reasonId: number,
  reportedBy: number,
  createdAt: Date,
  users: {
      id: number,
      image: string,
      name: string
  }
}