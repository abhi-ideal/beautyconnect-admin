import { useQuery } from "@tanstack/react-query";
import { UseFlaggedUsersInput, UseFlaggedUsersResponse } from "../types/FlaggedUsers";
import routes from "./routes";
import { getAccessToken } from "./authToken";

const getAllFlaggedUsersFn: ({
    sorting,
    columnFilters,
    pagination,
  }: UseFlaggedUsersInput) => Promise<UseFlaggedUsersResponse> = async ({ sorting, columnFilters, pagination }: UseFlaggedUsersInput) => {

  // set pagingation
  const accessToken: any = await getAccessToken();

  const page = pagination.pageIndex + 1,
    per_page = pagination.pageSize;

  // set filter
  let reportedBy = "",
   reportedTo = "",
    from= "",
    to = "",
    status = ""

  for (const filter of columnFilters) {
    const id = filter.id,
      value = filter.value;
    switch (id) {
      case "name":
        reportedBy = value as string;
        break;
      case "userData":
        reportedTo = value as string;
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
  const url = routes.USER_REPORT_LIST({
    reportedBy: reportedBy?.trim(),
    reportedTo: reportedTo?.trim(),
    from:from,
    to:to,
    status: status?.toLowerCase(),
    sorting_param: sorting_param,
    direction: direction,
    offset: offset,
    limit: per_page
  })
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

export const useGetFlaggedUsers = ({
  sorting,
  columnFilters,
  pagination
}: UseFlaggedUsersInput) => {

  const { data: allFlaggedUsersData, isLoading: isAllFlaggedUsersDataLoading } = useQuery<
  UseFlaggedUsersResponse
  >({
    queryKey: ["flaggedUsers", sorting, columnFilters, pagination],
    queryFn: () =>
      getAllFlaggedUsersFn({
        sorting,
        columnFilters,
        pagination
      }),
      refetchOnWindowFocus: false, // Disable refetching on window focus
      staleTime: 0, // Set stale time to 5 minutes (optional)
  }); 
  return { allFlaggedUsersData, isAllFlaggedUsersDataLoading };
};