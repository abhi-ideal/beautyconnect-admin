import {
    ColumnFiltersState,
    PaginationState,
    SortingState,
  } from "@tanstack/react-table";
  
  export interface UseCourseCategoryInput {
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    pagination: PaginationState;
  }
  
  export interface UseCourseCategoryResponse {
    per_page: number;
    page: number;
    count: any;
    counts: any,
    results: CourseCategory[];
  }
  
  export interface CourseCategory {
    image: string;
    id: string;
    title: string;
    description: string;
    status: string;
  }
  