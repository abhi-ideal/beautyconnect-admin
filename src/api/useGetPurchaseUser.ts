import { useQuery } from "@tanstack/react-query";
import { UsePurchaseUserInput, UsePurchaseUserResponse } from "../types/PurchaseUser";
import routes from "./routes";
import { getAccessToken } from "./authToken";

const getAllPurchaseUserFn: ({
    sorting,
    columnFilters,
    pagination,
    courseId
  }: UsePurchaseUserInput) => Promise<UsePurchaseUserResponse> = async ({ sorting, columnFilters, pagination, courseId }: UsePurchaseUserInput) => {

  // set pagingation
  const accessToken: any = await getAccessToken();

  const page = pagination.pageIndex + 1,
    per_page = pagination.pageSize;

  // set filter
  let name = "",
  email = "",
    from= "",
    to = "",
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
  const url = routes.PURCHASE_USER_LIST({
    name: name?.trim(),
    email: email?.trim(),
    courseId: courseId,
    status: status?.toLowerCase(),
    from:from,
    to:to,
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

export const useGetPurchaseUser = ({
  sorting,
  columnFilters,
  pagination,
  courseId
}: UsePurchaseUserInput) => {

  const { data: allPurchaseUserData, isLoading: isAllPurchaseUserDataLoading } = useQuery<
  UsePurchaseUserResponse
  >({
    queryKey: ["purchase-user-list", sorting, columnFilters, pagination],
    queryFn: () =>
      getAllPurchaseUserFn({
        sorting,
        columnFilters,
        pagination,
        courseId
      }),
      refetchOnWindowFocus: false, 
      staleTime: 0, 
  }); 
  return { allPurchaseUserData, isAllPurchaseUserDataLoading };
};
