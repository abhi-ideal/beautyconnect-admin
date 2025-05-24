"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { TransactionHistory } from "@/types/TransactionHistory";
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
import { useGetTransactionHistory } from "@/api/useGetTransactionHistory";

const TransactionHistoryTableComponent = ({userId}:any) => {
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

  const { allTransactionData, isAllTransactionDataLoading }: any = useGetTransactionHistory({
    sorting,
    columnFilters: debouncedColumnFilters,
    pagination,
    userId: userId,
  });

  const [allTransaction, setAllTransaction]: any = useState([]);

  
  useEffect(() => {
    if(allTransactionData?.error){
      404 != allTransactionData?.status && toast({
        title: allTransactionData?.errorMessage ? allTransactionData?.errorMessage : "Uh oh! Something went wrong.",
        variant: "destructive", description: allTransactionData?.error
      });
      (allTransactionData?.status==401 || allTransactionData?.status==403 ) && logout('');
    }
    setAllTransaction(allTransactionData);
  }, [allTransactionData]);





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
            const deletedData = (allTransaction.results = allTransaction?.results?.filter(
              (res: any) => data?.id !== res?.id
            ));
            setAllTransaction({ ...allTransaction, results: deletedData });
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
    // router.push(`users/${data?.id}`)
  }

  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const userColumns: ColumnDef<TransactionHistory>[] = [
    {
      header: "Transaction Type",
      accessorKey: "transactionType",
      enableSorting: false,
      enableColumnFilter: true,
      cell: (info) => {
        const transactionType = info.getValue<string>();
        return (
          <div className="text-truncate">
            {transactionType
              ? transactionType === "course_purchase"
                ? "Course Purchase"
                : transactionType === "diamond_purchase"
                ? "Diamond Purchase"
                : "N/A"
              : "N/A"}
          </div>
        );
      },
    },    
    {
      header: "Diamond",
      accessorKey: "diamond",
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        const diamond = info.getValue<string>();
        return (
          <div className="text-truncate flex items-center gap-1">
            {diamond ? (
              <>
                <Gem className="w-4 h-4" /> {diamond}
              </>
            ) : (
              "N/A"
            )}
          </div>
        );
      },
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
    // {
    //   header: "Status",
    //   enableSorting: false,
    //   enableColumnFilter: true,
    //   accessorKey: "paymentStatus",
    //   cell: (info) => {
    //     const paymentStatus = info.getValue<string>();
    
    //     return (
    //       <Badge
    //         className={cn(
    //           "px-2 py-1 text-sm font-medium",
    //           paymentStatus == "failed" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
    //         )}
    //       >
    //         { titleCase(paymentStatus)}
    //       </Badge>
    //     );
    //   },
    // },
  ];

  return (
    <>
      <TanStackBasicTable
        isTableDataLoading={isAllTransactionDataLoading}
        paginatedTableData={allTransaction}
        columns={userColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        details={details}
        statusFilter={["diamond_purchase", "course_purchase"]}
        hideFilter={false}
        cursorPointer= {""}
        tableHeight={" max-h-[515px] overflow-auto"}
      />
    </>
  );
};

export default TransactionHistoryTableComponent;
