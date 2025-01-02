import { useQuery } from "@tanstack/react-query";
import { UseLessonsInput, UseLessonsResponse } from "../types/Lessons";
import routes from "./routes";
import { getAccessToken } from "./authToken";

const getAllLessonsFn: ({
    sorting,
    columnFilters,
    pagination,
    courseId
  }: UseLessonsInput) => Promise<UseLessonsResponse> = async ({ sorting, columnFilters, pagination, courseId }: UseLessonsInput) => {

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
  const url = routes.LESSON_LIST({
    courseId: courseId,
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

export const useGetLessons = ({
  sorting,
  columnFilters,
  pagination,
  courseId
}: UseLessonsInput) => {

  const { data: allLessonsData, isLoading: isAllLessonsDataLoading } = useQuery<
  UseLessonsResponse
  >({
    queryKey: ["lessons", sorting, columnFilters, pagination, courseId],
    queryFn: () =>
      getAllLessonsFn({
        sorting,
        columnFilters,
        pagination,
        courseId
      }),
  });
  return { allLessonsData, isAllLessonsDataLoading };
};
