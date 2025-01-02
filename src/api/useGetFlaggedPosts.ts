import { useQuery } from "@tanstack/react-query";
import { UseFlaggedPostsInput, UseFlaggedPostsResponse } from "../types/FlaggedPosts";
import routes from "./routes";
import { getAccessToken } from "./authToken";

const getAllFlaggedPostsFn: ({
  sorting,
  columnFilters,
  pagination,
}: UseFlaggedPostsInput) => Promise<UseFlaggedPostsResponse> = async ({ sorting, columnFilters, pagination }: UseFlaggedPostsInput) => {

  // set pagingation
  const accessToken: any = await getAccessToken();

  const page = pagination.pageIndex + 1,
    per_page = pagination.pageSize;

  // set filter
  let name = "",
    from = "",
    to = "",
    status = ""

  for (const filter of columnFilters) {
    const id = filter.id,
      value = filter.value;
    switch (id) {
      case "name":
        name = value as string;
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
    sorting_param += id;

    if (i !== sorting.length - 1) {
      sorting_param += ",";
    }
  }
  const offset = (page - 1) * per_page
  const url = routes.FEED_REPORT_LIST({
    name: name?.trim(),
    from: from,
    to: to,
    status: status?.toLowerCase(),
    sorting_param: sorting_param,
    direction: direction,
    offset: offset,
    limit: per_page
  })
  const response: any = (await fetch(
    url, {
    headers: { Authorization: 'Bearer ' + accessToken }
  }
  ));
  const res = await response.json();
  res.status = response?.status;
  res.per_page = page * per_page
  return res;
};

export const useGetFlaggedPosts = ({
  sorting,
  columnFilters,
  pagination
}: UseFlaggedPostsInput) => {

  const { data: allFlaggedPostsData, isLoading: isAllFlaggedPostsDataLoading } = useQuery<
    UseFlaggedPostsResponse
  >({
    queryKey: ["flaggedPosts", sorting, columnFilters, pagination],
    queryFn: () =>
      getAllFlaggedPostsFn({
        sorting,
        columnFilters,
        pagination
      }),
  });
  return { allFlaggedPostsData, isAllFlaggedPostsDataLoading };
};
