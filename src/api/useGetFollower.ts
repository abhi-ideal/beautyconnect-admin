import { useQuery } from "@tanstack/react-query";
import { UseFollowersInput, UseFollowersResponse } from "../types/Follower";
import routes from "./routes";
import { getAccessToken } from "./authToken";

const getAllFollowersFn: ({
    sorting,
    columnFilters,
    pagination,
    type
  }: UseFollowersInput) => Promise<UseFollowersResponse> = async ({ sorting, columnFilters, pagination,type }: UseFollowersInput) => {

  // set pagingation
  const accessToken: any = await getAccessToken();

  const page = pagination.pageIndex + 1,
    per_page = pagination.pageSize;

  // set filter
  let name = "",
    email = "",
    from= "",
    to = "",
    userId = "",
    status = ""

  for (const filter of columnFilters) {
    const id = filter.id,
      value = filter.value;
    switch (id) {
      case "userId":
        userId = value as string;
        break;
      // case "type":
      //   type = value as string;
      //   break;
      case "name":
        name = value as string;
        break;
      case "email":
        email = value as string;
        break;
      case "from":
        from = value as string;
        break;
      case "to":
        to = value as string;
        break;
      case "status":
        status = value as string;
        break;
    }
  }

  // set sorting
  let sorting_param = "";
  let direction = ""

  for (let i = 0; i < sorting.length; i++) {
    const id = sorting[i].id;
    direction = sorting[i].desc ? "desc" : "asc";
    sorting_param += id ;

    if (i !== sorting.length - 1) {
      sorting_param += ",";
    }
  }
  const offset = (page - 1) * per_page
  const url = routes.FOLLOWER_LIST({
    name: name,
    email: email,
    userId:userId,
    // type:type,
    from:from,
    to:to,
    status: status,
    sorting_param: sorting_param,
    direction: direction,
    offset: offset,
    limit: per_page
  }, type)
  const response :any = (await fetch(
    url, {
    headers: { Authorization: 'Bearer ' + accessToken }
  }
  ));
  const res= await response.json();
  res.status= response?.status;
  res.per_page = page * per_page
  return res;
};

export const useGetFollowers = ({
  sorting,
  columnFilters,
  pagination,
  type
}: UseFollowersInput) => {

  const { data: allFollowersData, isLoading: isAllFollowersDataLoading } = useQuery<
  UseFollowersResponse
  >({
    queryKey: ["users", sorting, columnFilters, pagination, type ],
    queryFn: () =>
      getAllFollowersFn({
        sorting,
        columnFilters,
        pagination,
        type
      }),
      refetchOnWindowFocus: false, // Disable refetching on window focus
      staleTime: 300000, // Set stale time to 5 minutes (optional)
  }); 
  return { allFollowersData, isAllFollowersDataLoading };
};
