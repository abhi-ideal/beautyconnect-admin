import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export interface UseUsersInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export interface UseUsersResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: User[];
}

export interface User {
  jobType: string;
  image: string;
  id: string;
  name: string;
  email: string;
  status: string;
  last_name: string;
  profile:string;
  userGalleries: { image: string; type: string }[];
}

export interface userList {
  blockTo: number;
  createdAt: Date;
  id: string;
  isFollower: number;
  isFollowing: number;
  status: string;
  userId: string;
  userInfo: {
    totalFollowing: any;
    totalFollowers: unknown;
    jobType: string;
    image: string;
    id: string;
    name: string;
    email: string;
    status: string;
    last_name: string;
    profile: string;
  }
}