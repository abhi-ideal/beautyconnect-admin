import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export interface UseSkillsInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export interface UseSkillsResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: Skill[];
}

export interface Skill {
  image: string;
  id: string;
  title: string;
  description: string;
  status: string;
}
