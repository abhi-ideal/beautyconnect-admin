import { useQuery } from "@tanstack/react-query";
import { UsePurchaseInput, UsePurchaseResponse } from "../types/Purchase";
import routes from "./routes";
import { getAccessToken } from "./authToken";

const getAllPurchaseFn: ({
    sorting,
    columnFilters,
    pagination,
  }: UsePurchaseInput) => Promise<UsePurchaseResponse> = async ({ sorting, columnFilters, pagination }: UsePurchaseInput) => {

  // set pagingation
  const accessToken: any = await getAccessToken();

  const page = pagination.pageIndex + 1,
    per_page = pagination.pageSize;

  // set filter
  let name = "",
  title = "",
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
      case "course":
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
  const url = routes.PURCHASE_LIST({
    name: name?.trim(),
    title: title?.trim(),
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

export const useGetPurchase = ({
  sorting,
  columnFilters,
  pagination
}: UsePurchaseInput) => {

  const { data: allPurchaseData, isLoading: isAllPurchaseDataLoading } = useQuery<
  UsePurchaseResponse
  >({
    queryKey: ["purchase-list", sorting, columnFilters, pagination],
    queryFn: () =>
      getAllPurchaseFn({
        sorting,
        columnFilters,
        pagination
      }),
      refetchOnWindowFocus: false, 
      staleTime: 0, 
  }); 
  return { allPurchaseData, isAllPurchaseDataLoading };
};
