import { useQuery } from "@tanstack/react-query";
import { UsePostsInput, UsePostsResponse } from "../types/Posts";
import routes from "./routes";
import { getAccessToken } from "./authToken";

const getAllPostsFn: ({
    sorting,
    columnFilters,
    pagination,
  }: UsePostsInput) => Promise<UsePostsResponse> = async ({ sorting, columnFilters, pagination }: UsePostsInput) => {

  // set pagingation
  const accessToken: any = await getAccessToken();

  const page = pagination.pageIndex + 1,
    per_page = pagination.pageSize;

  // set filter
  let search = "",
    description = "",
    title= "",
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
      case "description":
        description = value as string;
        break;
      case "title":
        title = value as string;
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
  const url = routes.POST_LIST({
    title:title?.trim(),
    description: description?.trim(),
    search: search?.trim(),
    userId:userId,
    from:from,
    to:to,
    status: status,
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

export const useGetPosts = ({
  sorting,
  columnFilters,
  pagination
}: UsePostsInput) => {

  const { data: allPostsData, isLoading: isAllPostsDataLoading } = useQuery<
    UsePostsResponse
  >({
    queryKey: ["Posts", sorting, columnFilters, pagination],
    queryFn: () =>
      getAllPostsFn({
        sorting,
        columnFilters,
        pagination
      }),
  }); 
  return { allPostsData, isAllPostsDataLoading };
};
