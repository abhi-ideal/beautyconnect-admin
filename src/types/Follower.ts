import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

export interface UseFollowersInput { sorting: SortingState; columnFilters: ColumnFiltersState; pagination: PaginationState; type : string;}

export interface UseFollowersResponse {
  per_page: number;
  page: number;
  count: any;
  counts: any,
  results: Follower[];
}

export interface Follower {
    status: string;
    createdAt: Date;
    userInfo: {
        uId: string;
        name: string;
        email: string;
        countryCode: string;
        dob: string;
        gender: string;
        bio: string;
        city: string;
        role: string;
        totalFollowing: number;
        totalFollowers: number;
        professionType: string;
        gdcNumber: number;
        image: string;
        coverImage: string;
        jobType: string;
        latitude: number;
        longitude: number;
        address: number;
        status: string;
        lastReadNotification: string;
        createdAt: Date;
        id: number;
    },
    id: number;
    userId: number;
    isFollower: number;
    isFollowing: number;
    blockTo: number;
}
