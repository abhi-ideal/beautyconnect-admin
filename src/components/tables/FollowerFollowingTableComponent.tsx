"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { Follower } from "@/types/Follower";
import { ColumnDef, ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import TanStackBasicTable from "../TanStackTable/TanStackBasicTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "../ui/use-toast";
import UserApi from "@/api/user";
import { useRouter } from "next/navigation";
import { formatName, titleCase } from "@/lib/utils";
import Swal from "sweetalert2";
import { format } from "date-fns";
import AuthService from "@/api/auth/AuthService";
import { useGetFollowers } from "@/api/useGetFollower";

const FollowerFollowingTableComponent = ({ type, id }: any) => {
  const { logout } = AuthService();
  // sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { deleteUser, updateUser } = UserApi();
  // column filters state of the table
  const [columnFilters, setColumnFilters]: any = useState<ColumnFiltersState>(
    []
  );
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(
    columnFilters,
    1000
  );

  // pagination state of the table
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 20 //default page size
  });

  const { allFollowersData, isAllFollowersDataLoading }: any = useGetFollowers({
    sorting,
    columnFilters: debouncedColumnFilters,
    pagination,
    type
  });

  const [allUsers, setAllUsers]: any = useState([]);

  useEffect(() => {
    type != 'list' && setColumnFilters((prev: any) => {
      const updatedArr = [...prev];
      const filterMap = new Map(updatedArr.map(item => [item.id, item]));
      filterMap.set('userId', { id: 'userId', value: id });
      filterMap.set('type', { id: 'type', value: type });
      return Array.from(filterMap.values());
    });
  }, []);
  useEffect(() => {
    console.log(allFollowersData, 'allFollowersData');
    
    if (allFollowersData?.error) {
      404 != allFollowersData?.status && toast({
        title: allFollowersData?.errorMessage ? allFollowersData?.errorMessage : "Uh oh! Something went wrong.",
        variant: "destructive", description: allFollowersData?.error
      });
      (allFollowersData?.status == 401 || allFollowersData?.status == 403) && logout('userTable');
    }
    setAllUsers(allFollowersData);
  }, [allFollowersData]);

  async function updateData(data: any) {
    const status: any = data.status == "active" ? "inactive" : "active";

    Swal.fire({
      // title: status == "active" ? "Active" : "Inactive",
      text: `Are you sure you want to ${status} this user.`,
      showCancelButton: true,
      confirmButtonColor: `#18181B`,
      cancelButtonColor: "white",
      icon: "warning",
      customClass: {
        cancelButton: `cancel_button`
      },
      confirmButtonText: `Confirm ${data.status == "active" ? "Inactive" : "Active"
        }`
    }).then(async (result: any) => {
      if (result.value) {
        await updateUser({ status: status, id: data.id }).then(
          async (res: any) => {
            if (!res.error) {
              const updatedUsers = allUsers?.results?.map((res: any) => {
                if (data?.id == res?.id) {
                  res.status = status;
                  return res;
                } else {
                  return res;
                }
              });
              setAllUsers({ ...allUsers, results: updatedUsers });
              toast({
                title: "Update",
                description: res?.message
              });
            } else {
              toast({
                variant: "destructive",
                title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
                description: res?.error
              });
            }
          }
        );
      }
    });
  }

  async function deleteData(data: any) {
    Swal.fire({
      // title: "Delete",
      text: `Are you sure you want to delete this user?`,
      showCancelButton: true,
      confirmButtonColor: `#18181B`,
      cancelButtonColor: "white",
      confirmButtonText: "Confirm Delete",
      icon: "warning",
      customClass: {
        cancelButton: `cancel_button`
      },
    }).then(async (result: any) => {
      if (result.value) {
        await deleteUser(data?.id).then((res: any) => {
          if (!res.error) {
            const deletedData = (allUsers.results = allUsers?.results?.filter(
              (res: any) => data?.id !== res?.id
            ));
            setAllUsers({ ...allUsers, results: deletedData });

            toast({
              title: "Delete",
              description: res?.message
            });
          } else {
            toast({
              variant: "destructive",
              title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
              description: res?.error
            });
          }
        });
      }
    });
  }
  const details = (data: any) => {
    // router.push(`users/${data?.id}`)
  }
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const color = ["bg-orange-500", "bg-lime-500", "bg-cyan-500", "bg-blue-500", "bg-rose-500"];
  const userColumns: ColumnDef<Follower>[] = [
    {
      header: "User Name",
      accessorKey: "name",
      accessorFn: (row: Follower) => row?.userInfo,
      enableSorting: false,
      enableColumnFilter: true,
      cell: (info) => {
        const imageUrl: any = info.getValue();
        const bgColor = color[info?.row?.index % color.length]
        return (
          <div className="flex">
            <Avatar>
              <AvatarImage
                src={typeof imageUrl?.image ? previewImgUrl + imageUrl?.image : undefined}
              />
              <AvatarFallback className={bgColor}>
                {formatName(info.row.original?.userInfo?.name) || "N/A"}
              </AvatarFallback>
            </Avatar>
            <p className="m-2">{info.row.original?.userInfo?.name || "N/A"}</p>
          </div>
        );
      }
    },
    {
      header: "Email",
      accessorKey: "email",
      accessorFn: (row: Follower) => row?.userInfo?.email,
      cell: (info) => info.getValue() || "N/A",
      enableSorting: false,
      enableColumnFilter: false
    },
    {
      header: "Bio",
      accessorKey: "bio",
      accessorFn: (row: Follower) => row?.userInfo?.bio,
      cell: (info) => info.getValue() || "N/A",
      enableSorting: false,
      enableColumnFilter: false
    },
    {
      header: "Status",
      accessorKey: "status",
      accessorFn: (row: Follower) => row.status,
      cell: (info) => {
        const Status: any = info.getValue();
        return (<div className={`flex m-2`}>{titleCase(Status) || "N/A"}</div>)
      },
      enableSorting: false
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (info) => {
        const createdAt = info.getValue<string>();
        return format(new Date(createdAt), "dd MMM, yy 'at' h:mm a");
      },
      enableColumnFilter: false
    }
  ];

  return (
    <>
      <TanStackBasicTable
        isTableDataLoading={isAllFollowersDataLoading}
        paginatedTableData={allUsers}
        columns={userColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        details={details}
        statusFilter={["Active", "Inactive"]}
      />
    </>
  );
};

export default FollowerFollowingTableComponent