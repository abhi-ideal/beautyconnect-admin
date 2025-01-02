import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

export interface UseCoursesInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export interface UseCoursesResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: Course[];
}

export interface Course {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  courseType: string;
  fromExperience: number;
  toExperience: number;
  createdAt: Date;
  amount: number;
  media: any;
  totalRating: number;
  avgRating: number;
  isFeatured: number;
  category: string[];
  userDetails: {
    id: string;
    image: string;
    name: string;
  }
};