import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

export interface UseLessonsInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
  courseId:string;
}

export interface UseLessonsResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  status: string;
  totalChapter: number;
  image: null,
};