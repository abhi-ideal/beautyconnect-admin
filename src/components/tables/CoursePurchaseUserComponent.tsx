"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { Purchase } from "@/types/Purchase";
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
import { Eye, Gem, LockKeyhole, LockKeyholeOpen, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { cn, formatName, shortName, titleCase } from "@/lib/utils";
import Swal from "sweetalert2";
import { format } from "date-fns";
import AuthService from "@/api/auth/AuthService";
import ContactApi from "@/api/contact";
import { Badge } from "../ui/badge";
import { useGetPurchase } from "@/api/useGetPurchase";
import Link from "next/link";
import { useGetPurchaseUser } from "@/api/useGetPurchaseUser";

const CoursePurchaseUserComponent = ({courseId }:any) => {
  const { logout }=AuthService();
  // sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { deleteContact } = ContactApi();
  
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

  const { allPurchaseUserData, isAllPurchaseUserDataLoading }: any = useGetPurchaseUser({
    sorting,
    columnFilters: debouncedColumnFilters,
    pagination,
    courseId
  });

  const [allPurchaseUser, setAllPurchaseUser]: any = useState([]);

  
  useEffect(() => {
    if(allPurchaseUserData?.error){
      404 != allPurchaseUserData?.status && toast({
        title: allPurchaseUserData?.errorMessage ? allPurchaseUserData?.errorMessage : "Uh oh! Something went wrong.",
        variant: "destructive", description: allPurchaseUserData?.error
      });
      (allPurchaseUserData?.status==401 || allPurchaseUserData?.status==403 ) && logout('');
    }
    setAllPurchaseUser(allPurchaseUserData);
  }, [allPurchaseUserData]);





  async function deleteData(data: any) {
    Swal.fire({
      // title: "Delete",
      text: `Are you sure you want to delete this contact?`,
      showCancelButton: true,
      confirmButtonColor: `#18181B`,
      cancelButtonColor: "white",
      confirmButtonText: "Confirm Delete",
      // icon: "warning",
         imageUrl: '/dlt.svg',
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
        await deleteContact(data?.id).then((res: any) => {
          if (!res.error) {
            const deletedData = (allPurchaseUser.results = allPurchaseUser?.results?.filter(
              (res: any) => data?.id !== res?.id
            ));
            setAllPurchaseUser({ ...allPurchaseUser, results: deletedData });
            toast({
              title: "Contact deleted sucessfully.",
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
    router.push(`/users/${data?.id}`)
  }
  const [expandedDesc, setExpandedDesc ]:any = useState({});
  const toggleSectionExpanded = (index:any) => {
    setExpandedDesc((prevState:any) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const color=["bg-[#FFC1BB]","bg-orange-500","bg-lime-500","bg-cyan-500","bg-blue-500","bg-rose-500"];
  const userColumns: ColumnDef<Purchase>[] = [
        {
          header: "Profile",
          accessorFn: (row: any) => row.profile,
          enableSorting: false,
          enableColumnFilter: false,
          cell: (info:any) => {
            const imageUrl = info.getValue();
            const resolvedImageUrl = imageUrl?.startsWith("https://")
            ? imageUrl
            : previewImgUrl + imageUrl;  
            return (
              <Avatar className="border border-border" >
                <AvatarImage
                  src={resolvedImageUrl} 
                />
                <AvatarFallback className="bg-[#FFC1BB]" >
                  {formatName(info.row.original.title) || "DI"}
                </AvatarFallback>
              </Avatar>
            );
          }
        },
    
    {
      header: "Name",
      accessorKey: "name",
      cell: (info) => {
        const name = info.getValue<string>();
        return <div className="text-truncate"> { name ? titleCase(name) : 'N/A'} </div>;
      },
    },
    {
      header: "Email",
      accessorKey: "email",
      enableColumnFilter: false,
      cell: (info) => {
        const email = info.getValue<string>();
        return <div className="text-truncate"> { email || 'N/A'} </div>;
      },
    },

    // {
    //   header: "Diamond Spent",
    //   accessorKey: "diamondSpent",
    //   enableSorting: false,
    //   enableColumnFilter: false,
    //   cell: (info) => {
    //     const diamond = info.getValue<string>();
    //     return (
    //       <div className="text-truncate flex items-center gap-1">
    //         {diamond ? (
    //           <>
    //             <Gem className="w-4 h-4" /> {diamond}
    //           </>
    //         ) : (
    //           "N/A"
    //         )}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   header: "Created At",
    //   accessorKey: "createdAt",
    //   cell: (info) => {
    //     const createdAt = info.getValue<string>();
    //     return format(new Date(createdAt), "dd MMM, yy 'at' h:mm a");
    //   },
    //   enableColumnFilter: false
    // },
    // {
    //   header: "Status",
    //   accessorKey: "status",
    //   accessorFn: (row: any) => row.status,
    //   cell: (info) => {
    //     const Status:any = info.getValue();
    //     return (<div className={`flex m-2`}>{ titleCase(Status) || "N/A"}</div>)
    //   },
    //   enableSorting: false
    // },
  ];

  return (
    <>
      <TanStackBasicTable
        isTableDataLoading={isAllPurchaseUserDataLoading}
        paginatedTableData={allPurchaseUser}
        columns={userColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        details={details}
        statusFilter={["Active", "Inactive"]}
        hideFilter={false}
        cursorPointer= {"cursor-pointer"}
      />
    </>
  );
};

export default CoursePurchaseUserComponent;
