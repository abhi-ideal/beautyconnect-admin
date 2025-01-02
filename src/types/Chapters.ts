import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

export interface UseChaptersInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
  lessonId: string;
}

export interface UseChaptersResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: Chapter[];
}

export interface Chapter {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  userDetails: {
    id: string;
    image: string;
    name: string;
  },
  lessonId: number,
  sequence: number,
  docFile: string;
  mediaFile: {
    path: string;
    type: string;
    ratio: string;
    poster: string;
    mimeType: number;
  }[]
};