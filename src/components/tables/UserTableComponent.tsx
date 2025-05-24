"use client";
import { useGetUsers } from "@/api/useGetUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { User, userList } from "@/types/Users";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import TanStackBasicTable from "../TanStackTable/TanStackBasicTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, LockKeyhole, LockKeyholeOpen, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "../ui/use-toast";
import UserApi from "@/api/user";
import { useRouter } from "next/navigation";
import { formatName, titleCase } from "@/lib/utils";
import Swal from "sweetalert2";
import { format } from "date-fns";
import AuthService from "@/api/auth/AuthService";

const UserTableComponent = () => {
  const { logout }=AuthService();
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

  const { allUsersData, isAllUsersDataLoading }: any = useGetUsers({
    sorting,
    columnFilters: debouncedColumnFilters,
    pagination
  });

  const [allUsers, setAllUsers]: any = useState([]);
  const [lastFetchTime, setLastFetchTime] = useState<any>(null);
  const [timeSinceFetch, setTimeSinceFetch] = useState<string>("");
  
  useEffect(() => {
    const storedTime = sessionStorage.getItem("userSession");
    if (storedTime) {
      setLastFetchTime(new Date(storedTime));
    } else {
      resetLastTime('setTime');
    }
    if(allUsersData?.error){
      404 != allUsersData?.status && toast({
        title: allUsersData?.errorMessage ? allUsersData?.errorMessage : "Uh oh! Something went wrong.",
        variant: "destructive", description: allUsersData?.error
      });
      (allUsersData?.status==401 || allUsersData?.status==403 ) && logout('userTable');
    }
    setAllUsers(allUsersData);
  }, [allUsersData]);

  useEffect(() => {
    if (lastFetchTime) {
      const updateTimeSinceFetch = () => {
        const currentTime = new Date();
        const diffInSeconds = Math.floor((currentTime.getTime() - lastFetchTime.getTime()) / 1000);
        if (diffInSeconds < 60) {
          setTimeSinceFetch(`${diffInSeconds} seconds ago`);
        } else {
          const diffInMinutes = Math.floor(diffInSeconds / 60);
          setTimeSinceFetch(`${diffInMinutes} minutes ago`);
        }
      };
      updateTimeSinceFetch();
      const interval = setInterval(updateTimeSinceFetch, 5000);
      return () => clearInterval(interval);
    }
  }, [lastFetchTime]);

  const resetLastTime = (type:string) => {
    const currentTime = new Date();
    sessionStorage.setItem("userSession", currentTime.toISOString());
    type=='restart' && setColumnFilters((prev: any) => {
      const updatedArr = [...prev];
      const filterMap = new Map(updatedArr.map(item => [item.id, item]));
      filterMap.set('session', { id: 'session', value: currentTime.toISOString() });
      return Array.from(filterMap.values());
    });
    setLastFetchTime(currentTime);
    setTimeSinceFetch("Just now");
  };

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
        popup: "max-w-[393px] px-8 py-4 !rounded-[20px]",
        icon: "text-[9.275px] mt-[0!important]",
        htmlContainer:
          "px-[0!important] pb-[0!important] [font-size:16px!important]",
        actions: "-mx-5",
        confirmButton: "[flex:0_0_auto] w-[calc(50%_-10px)] px-[0!important] !bg-btn !rounded-[20px]",
        cancelButton: `w-[calc(50%_-10px)] text-black border border-[#000000B2] border-solid px-[0!important] !rounded-[20px]`,
       },
      confirmButtonText: `Confirm ${
        data.status == "active" ? "Inactive" : "Active"
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
                title: "Status updated sucessfully.",
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
      // icon: "warning",
       imageUrl: '/dlt.svg', // Replace with your image URL
        imageAlt: 'Custom image',
        imageWidth: 90,
        imageHeight: 90,
        customClass: { 
        popup: "max-w-[393px] px-8 py-4 !rounded-[20px]",
        icon: "text-[9.275px] mt-[0!important]",
        htmlContainer:
          "px-[0!important] pb-[0!important] [font-size:16px!important]",
        actions: "-mx-5",
        confirmButton: "[flex:0_0_auto] w-[calc(50%_-10px)] px-[0!important] !bg-btn !rounded-[20px]",
        cancelButton: `w-[calc(50%_-10px)] text-black border border-[#000000B2] border-solid px-[0!important] !rounded-[20px]`,
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
              title: "User deleted sucessfully",
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
  const details=(data:any)=>{
    router.push(`users/${data?.id}`)
  }
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const color=["bg-[#FFC1BB]","bg-orange-500","bg-lime-500","bg-cyan-500","bg-blue-500","bg-rose-500"];
  const userColumns: ColumnDef<User>[] = [
    {
      header: "User Name",
      accessorKey: "name",
      accessorFn: (row: User) => row?.profile,
      enableSorting: false,
      enableColumnFilter: true,
      cell: (info:any) => {
        const imageUrl = info.getValue();
        const bgColor = color[info?.row?.index % color.length ]
        return (
          <div className="flex">
          <Avatar>
            <AvatarImage
              src={previewImgUrl+imageUrl}
            />
            <AvatarFallback className={bgColor}>
              {formatName(info.row.original?.name) || "N/A"}
            </AvatarFallback>
          </Avatar>
          <div className=" m-2 text-truncate"> {info.row.original?.name ? titleCase(info.row.original?.name?.trim()) : 'N/A'} </div>
          </div>
        );
      }
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (info) => {
        const email = info.getValue<string>();
        return <div className="text-truncate"> { email || 'N/A'} </div>;
      },
    },
    {
      header: "Followers",
      accessorKey: "totalFollower",
      enableSorting: false,
      enableColumnFilter: false
    },
    {
      header: "Following",
      accessorKey: "totalFollowing",
      enableSorting: false,
      enableColumnFilter: false
    },
    {
      header: "Total Post",
      accessorKey: "totalPost",
      enableSorting: false,
      enableColumnFilter: false
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (info) => {
        const createdAt = info.getValue<string>();
        return format(new Date(createdAt), "dd MMM, yy 'at' h:mm a");
      },
      enableColumnFilter: false
    },
    {
      header: "Status",
      accessorKey: "status",
      accessorFn: (row: User) => row.status,
      cell: (info) => {
        const Status:any = info.getValue();
        return (<div className={`flex m-2`}>{ titleCase(Status) || "N/A"}</div>)
      },
      enableSorting: false
    },

    {
      id: "actions",
      header: "Action",
      enableSorting: false,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateData(rowData)} className="flex items-center space-x-2" >
              {rowData.status == "active" ? 
                (<LockKeyhole className="h-4 w-4 text-muted-foreground" />) : (
                <LockKeyholeOpen className="h-4 w-4 text-muted-foreground" />
                )}

                  <span>
                  {rowData.status
                    ? rowData.status == "active"
                      ? "Inactive"
                      : "Active"
                    : "N/A"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteData(rowData)} className="flex items-center space-x-2" >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
              <span>Delete</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`users/${rowData.id}`)}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>View Detail</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  return (
    <>
      {timeSinceFetch && <div className="gap-2 flex items-center  justify-end text-sm">
        Last fetched {timeSinceFetch}
        <Button onClick={() => resetLastTime('restart')} className="p-0 h-6 w-6 flex items-center justify-center text-sm"><RotateCcw /></Button>
      </div>}
      <TanStackBasicTable
        isTableDataLoading={isAllUsersDataLoading}
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
        cursorPointer= {"cursor-pointer"}
      />
    </>
  );
};

export default UserTableComponent;
