"use client";
import { useDebounce } from "@/hooks/useDebounce";
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
import { useGetFlaggedUsers } from "@/api/useGetFlaggedUsers";
import ReportApi from "@/api/report";
import { flaggedUser } from "@/types/FlaggedUsers";

const FlaggedUserTableComponent = () => {
  const { logout }=AuthService();
  // sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { updateUser } = UserApi();
  const { deleteFlaggedUser } = ReportApi();
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

  const { allFlaggedUsersData, isAllFlaggedUsersDataLoading }: any = useGetFlaggedUsers({
    sorting,
    columnFilters: debouncedColumnFilters,
    pagination
  });

  const [allFlaggedUsers, setAllFlaggedUsers]: any = useState([]);

  useEffect(() => {
    if(allFlaggedUsersData?.error){
      404 != allFlaggedUsersData?.status && toast({
        title: allFlaggedUsersData?.errorMessage ? allFlaggedUsersData?.errorMessage : "Uh oh! Something went wrong.",
        variant: "destructive", description: allFlaggedUsersData?.error
      });
      (allFlaggedUsersData?.status==401 || allFlaggedUsersData?.status==403 ) && logout('flageuser');
    }
    setAllFlaggedUsers(allFlaggedUsersData);
  }, [allFlaggedUsersData]);

  async function updateData(data: flaggedUser) {
    const status: any = data?.userData?.status == "active" ? "inactive" : "active";

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
      confirmButtonText: `Confirm ${
        data?.userData?.status == "active" ? "Inactive" : "Active"
      }`
    }).then(async (result: any) => {
      if (result.value) {
        await updateUser({ status: status, id: data?.actionId }).then(
          async (res: any) => {
            if (!res.error) {
              const updatedUsers = allFlaggedUsers?.results?.map((res: any) => {
                if (data?.actionId == res?.actionId) {
                  res.userData.status = status;
                  return res;
                } else {
                  return res;
                }
              });
              setAllFlaggedUsers({ ...allFlaggedUsers, results: updatedUsers });
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

  async function deleteData(data: flaggedUser) {
    Swal.fire({
      // title: "Delete",
      text: `Are you sure you want to UnFlagged this user ?`,
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
        await deleteFlaggedUser(data?.actionId).then((res: any) => {
          if (!res.error) {
            const deletedData = (allFlaggedUsers.results = allFlaggedUsers?.results?.filter(
              (res: any) => data?.actionId !== res?.actionId
            ));
            setAllFlaggedUsers({ ...allFlaggedUsers, results: deletedData });
            toast({
              title: "Report cancelled sucessfully.",
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
  const details=(data:flaggedUser, header:string)=>{
    header!='description'&& header!='mark' && router.push(`flagged-users/${data?.actionId}`)
  }
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const color=["bg-[#FFC1BB]","bg-orange-500","bg-lime-500","bg-cyan-500","bg-blue-500","bg-rose-500"];
  const userColumns: ColumnDef<flaggedUser>[] = [
    {
      header: "Reported by",
      accessorKey: "name",
      accessorFn: (row: any) => row?.reportedByuser,
      enableSorting: false,
      enableColumnFilter: true,
      cell: (info:any) => {
        const reportedUser:any = info.getValue();
        console.log('reportedUser', reportedUser);
        
        const bgColor = color[info?.row?.index % color.length ];
        return (
          <div className="flex">
          <Avatar>
            <AvatarImage src={ reportedUser?.profile ? previewImgUrl+reportedUser?.profile : ""}/>
            <AvatarFallback className={bgColor}>
              {formatName(reportedUser?.name)||"N/A"}
            </AvatarFallback>
          </Avatar>
          <p className="m-2 text-truncate">{titleCase(reportedUser?.name?.trim())||"N/A"}</p>
          </div>
        );
      }
    },
    {
      header: "Reported to",
      accessorKey: "userData",
      accessorFn: (row: flaggedUser) => row.userData,
      enableSorting: false,
      enableColumnFilter: true,
      cell: (info) => {
        const reportedTo:any = info.getValue();
        const bgColor = color[info?.row?.index % color.length ];
        return (
          <div className="flex">
          <Avatar>
            <AvatarImage src={ reportedTo?.profile ? previewImgUrl+reportedTo?.profile : ""}/>
            <AvatarFallback className={bgColor}>
              {formatName(reportedTo?.name)||"N/A"}
            </AvatarFallback>
          </Avatar>
          <p className="m-2 text-truncate">{titleCase(reportedTo?.name?.trim())||"N/A"}</p>
          </div>
        );
      }
    },
    {
      header: "Status",
      accessorKey: "status",
      accessorFn: (row: flaggedUser) => row?.userData?.status,
      cell: (info) => {
        const Status:any = info.getValue();
        return (<div className={`flex m-2`}>{ titleCase(Status) || "N/A"}</div>)
      },
      enableSorting: false,
      enableColumnFilter: false
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      accessorFn: (row: any) => row?.createdAt,
      cell: (info) => {
        const createdAt = info.getValue<string>();
        return <span>{createdAt ?  format(new Date(createdAt), "dd MMM, yy 'at' h:mm a") : "N/A"}</span> 
      },
      enableColumnFilter: false
    },
    {
      header: "Marks",
      accessorKey: "mark",
      cell:(info) =>{
        return <Button className="dark:bg-white bg-[#18181B]" onClick={() => deleteData(info.row.original)}>Mark Us UnFlagged</Button>
      },
      enableSorting: true,
      enableColumnFilter: false
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
              <DropdownMenuItem onClick={() => updateData(rowData)}>
                {rowData?.userData?.status
                  ? rowData?.userData?.status == "active"
                    ? "Inactive"
                    : "Active"
                  : "N/A"}
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                onClick={() => router.push(`users/${rowData.id}`)}
              >
                User Detail
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  return (
    <>
      <TanStackBasicTable
        isTableDataLoading={isAllFlaggedUsersDataLoading}
        paginatedTableData={allFlaggedUsers}
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

export default FlaggedUserTableComponent