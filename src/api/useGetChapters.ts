import { useQuery } from "@tanstack/react-query";
import { UseChaptersInput, UseChaptersResponse } from "../types/Chapters";
import routes from "./routes";
import { getAccessToken } from "./authToken";

const getAllChaptersFn: ({
    sorting,
    columnFilters,
    pagination,
    lessonId
  }: UseChaptersInput) => Promise<UseChaptersResponse> = async ({ sorting, columnFilters, pagination, lessonId }: UseChaptersInput) => {

  // set pagingation
  const accessToken: any = await getAccessToken();

  const page = pagination.pageIndex + 1,
    per_page = pagination.pageSize;

  // set filter
  let title = "",
    description = "",
    from= "",
    to = "",
    status = ""

  for (const filter of columnFilters) {
    const id = filter.id,
      value = filter.value;
    switch (id) {
      case "title":
        title = value as string;
        break;
      case "description":
        description = value as string;
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
  const url = routes.CHAPTER_LIST({
    lessonId: lessonId,
    title: title,
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

export const useGetChapters = ({
  sorting,
  columnFilters,
  pagination,
  lessonId
}: UseChaptersInput) => {

  const { data: allChaptersData, isLoading: isAllChaptersDataLoading } = useQuery<
  UseChaptersResponse
  >({
    queryKey: ["chapters", sorting, columnFilters, pagination, lessonId],
    queryFn: () =>
      getAllChaptersFn({
        sorting,
        columnFilters,
        pagination,
        lessonId
      }),
      refetchOnWindowFocus: false, // Disable refetching on window focus
      staleTime: 300000, // Set stale time to 5 minutes (optional)
  });
  return { allChaptersData, isAllChaptersDataLoading };
};
