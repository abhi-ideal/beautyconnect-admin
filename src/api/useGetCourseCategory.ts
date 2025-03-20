import { useQuery } from "@tanstack/react-query"; 
import routes from "./routes";
import { getAccessToken } from "./authToken";
import { UseCourseCategoryInput, UseCourseCategoryResponse } from "@/types/CourseCategory";

const getAllCourseCategoryFn: ({
    sorting,
    columnFilters,
    pagination,
  }: UseCourseCategoryInput) => Promise<UseCourseCategoryResponse> = async ({ sorting, columnFilters, pagination }: UseCourseCategoryInput) => {

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
  const url = routes.COURSE_CATEGORY_LIST({
    title: title?.trim(),
    description: description,
    from:from,
    type:'course',
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

export const useGetCourseCategory = ({
  sorting,
  columnFilters,
  pagination
}: UseCourseCategoryInput) => {

  const { data: allCourseCategoryData, isLoading: isAllCourseCategoryDataLoading } = useQuery<
    UseCourseCategoryResponse
  >({
    queryKey: ["courseCategory", sorting, columnFilters, pagination],
    queryFn: () =>
      getAllCourseCategoryFn({
        sorting,
        columnFilters,
        pagination
      }),
      refetchOnWindowFocus: false, // Disable refetching on window focus
      staleTime: 0, // Set stale time to 5 minutes (optional)
  });
  return { allCourseCategoryData, isAllCourseCategoryDataLoading };
};
