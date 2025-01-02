import { useQuery } from "@tanstack/react-query";
import { UseUsersInput, UseUsersResponse } from "../types/Users";
import routes from "./routes";
import { getAccessToken } from "./authToken";

const getAllUsersFn: ({
    sorting,
    columnFilters,
    pagination,
  }: UseUsersInput) => Promise<UseUsersResponse> = async ({ sorting, columnFilters, pagination }: UseUsersInput) => {

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
    session = "",
    status = ""

  for (const filter of columnFilters) {
    const id = filter.id,
      value = filter.value;
    switch (id) {
      case "userId":
        userId = value as string;
        break;
      case "session":
        session = value as string;
        break;
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

  const storedTime: any = sessionStorage.getItem("userSession");
  const currentTime = new Date();
  const LFT = storedTime && Math.abs(currentTime.getTime() - new Date(storedTime).getTime()) <= 3000 ? new Date(storedTime).getTime() : "";
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
  const url = routes.USER_LIST({
    LFT: LFT,
    name: name?.trim(),
    email: email?.trim(),
    userId:userId,
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

export const useGetUsers = ({
  sorting,
  columnFilters,
  pagination
}: UseUsersInput) => {

  const { data: allUsersData, isLoading: isAllUsersDataLoading } = useQuery<
    UseUsersResponse
  >({
    queryKey: ["users", sorting, columnFilters, pagination],
    queryFn: () =>
      getAllUsersFn({
        sorting,
        columnFilters,
        pagination
      }),
  }); 
  return { allUsersData, isAllUsersDataLoading };
};
