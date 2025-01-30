import { useQuery } from "@tanstack/react-query";
import { UsePlansInput, UsePlansResponse } from "../types/Plans";
import routes from "./routes";
import { getAccessToken } from "./authToken";

const getAllPlansFn: ({
    sorting,
    columnFilters,
    pagination,
  }: UsePlansInput) => Promise<UsePlansResponse> = async ({ sorting, columnFilters, pagination }: UsePlansInput) => {

  // set pagingation
  const accessToken: any = await getAccessToken();

  const page = pagination.pageIndex + 1,
    per_page = pagination.pageSize;

  // set filter
  let name = "",
    email = "",
    status = ""

  for (const filter of columnFilters) {
    const id = filter.id,
      value = filter.value;
    switch (id) {
      case "name":
        name = value as string;
        break;
      case "email":
        email = value as string;
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
  // const url = routes.CONTACT_US_LIST({
  //   name: name?.trim(),
  //   email: email?.trim(),
  //   status: status?.toLowerCase(),
  //   sorting_param: sorting_param,
  //   direction: direction,
  //   offset: offset,
  //   limit: per_page
  // })

    const url = routes.PLANS();
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

export const useGetPlans = ({
  sorting,
  columnFilters,
  pagination
}: UsePlansInput) => {

  const { data: allPlansData, isLoading: isAllPlansDataLoading } = useQuery<
  UsePlansResponse
  >({
    queryKey: ["plans", sorting, columnFilters, pagination],
    queryFn: () =>
      getAllPlansFn({
        sorting,
        columnFilters,
        pagination
      }),
      refetchOnWindowFocus: false, 
      staleTime: 0,
  }); 
  return { allPlansData, isAllPlansDataLoading };
};
