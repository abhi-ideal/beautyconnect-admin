import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { reportedUser } from "./FlaggedUsers";
import { Post } from "./Posts";

export interface UseFlaggedPostsInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export interface UseFlaggedPostsResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: flaggedPost[];
}

export interface flaggedPost {
  actionId: number,
  feedData: Post,
  reportedUser: reportedUser[]
}
