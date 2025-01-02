import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

export interface UsePostsInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export interface UsePostsResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: Post[];
}

export interface Post {
  feedId: string;
  userId: string;
  createdAt: Date; 
  id: string;
  title: string;
  description: string;
  status: string;
  totalLike: number;
  totalComment: number;
  totalShare: number;
  users: { userId: string; image: string; name: string; },
  contents: Content[];
}

export interface Content {
  id: string;
  file: string;
  mimeType: string;
  poster: string;
  ratio: string;
}