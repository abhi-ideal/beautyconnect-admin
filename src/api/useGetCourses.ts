import { useQuery } from "@tanstack/react-query";
import { UseCoursesInput, UseCoursesResponse } from "../types/Courses";
import routes from "./routes";
import { getAccessToken } from "./authToken";

const getAllCoursesFn: ({
    sorting,
    columnFilters,
    pagination,
  }: UseCoursesInput) => Promise<UseCoursesResponse> = async ({ sorting, columnFilters, pagination }: UseCoursesInput) => {

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
  const url = routes.COURSE_LIST({
    title: title,
    description: description,
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

export const useGetCourses = ({
  sorting,
  columnFilters,
  pagination
}: UseCoursesInput) => {

  const { data: allCoursesData, isLoading: isAllCoursesDataLoading } = useQuery<
  UseCoursesResponse
  >({
    queryKey: ["courses", sorting, columnFilters, pagination],
    queryFn: () =>
      getAllCoursesFn({
        sorting,
        columnFilters,
        pagination
      }),
      refetchOnWindowFocus: false, // Disable refetching on window focus
      staleTime: 300000, // Set stale time to 5 minutes (optional)
  });
  return { allCoursesData, isAllCoursesDataLoading };
};
