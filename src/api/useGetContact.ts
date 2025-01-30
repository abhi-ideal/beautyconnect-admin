import { useQuery } from "@tanstack/react-query";
import { UseContactInput, UseContactResponse } from "../types/Contact";
import routes from "./routes";
import { getAccessToken } from "./authToken";

const getAllContactFn: ({
    sorting,
    columnFilters,
    pagination,
  }: UseContactInput) => Promise<UseContactResponse> = async ({ sorting, columnFilters, pagination }: UseContactInput) => {

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
  const url = routes.CONTACT_US_LIST({
    name: name?.trim(),
    email: email?.trim(),
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

export const useGetContacts = ({
  sorting,
  columnFilters,
  pagination
}: UseContactInput) => {

  const { data: allContactData, isLoading: isAllContactDataLoading } = useQuery<
  UseContactResponse
  >({
    queryKey: ["contact-list", sorting, columnFilters, pagination],
    queryFn: () =>
      getAllContactFn({
        sorting,
        columnFilters,
        pagination
      }),
      refetchOnWindowFocus: false, // Disable refetching on window focus
      staleTime: 0, // Set stale time to 5 minutes (optional)
  }); 
  return { allContactData, isAllContactDataLoading };
};
