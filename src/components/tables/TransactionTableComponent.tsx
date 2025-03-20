"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { Transaction } from "@/types/Transaction";
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
import { useGetTransactions } from "@/api/useGetTransaction";
import { Badge } from "../ui/badge";
import Link from "next/link";

const TransactionTableComponent = () => {
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

  const { allTransactionData, isAllTransactionDataLoading }: any = useGetTransactions({
    sorting,
    columnFilters: debouncedColumnFilters,
    pagination
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
      icon: "warning",
      customClass: {
        cancelButton: `cancel_button`
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
  const [expandedDesc, setExpandedDesc ]:any = useState({});
  const toggleSectionExpanded = (index:any) => {
    setExpandedDesc((prevState:any) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const color=["bg-[#FFC1BB]","bg-orange-500","bg-lime-500","bg-cyan-500","bg-blue-500","bg-rose-500"];
  const userColumns: ColumnDef<Transaction>[] = [
    {
      header: "User",
      accessorKey: "name",
      accessorFn: (row: any) => ({
        profile: row?.userInfo?.profile,
        name: row?.userInfo?.name,
        email: row?.userInfo?.email
      }),
      enableSorting: false,
      enableColumnFilter: true,
      cell: (info: any) => {
        const { profile, name, email } = info.getValue();
        const bgColor = color[info?.row?.index % color.length ]

        return (
          <div className="flex items-center">
            <Avatar className="mr-3 border border-border">
              <AvatarImage
                src={
                  profile
                    ? `${process.env.NEXT_PUBLIC_PREVIEW_IMG_URL}${profile}`
                    : ""
                }
                alt={name || "User Avatar"}
              />
              <AvatarFallback className={bgColor} >{formatName(name || "N/A")}</AvatarFallback>
            </Avatar>
            <div>
              <div className=" text-truncate">
              <Link href={`/users/${info.row.original?.userInfo?.id}`}> 
                {name ? titleCase(name?.trim()) : "N/A"}
                </Link>
              </div>
              <div className="text-sm text-muted-foreground text-truncate">
                {email || "N/A"}
              </div>
            </div>
          </div>
        );
      }
    },
    
    {
      header: "Payable Amount",
      accessorKey: "payableAmount",
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        const payableAmount = info.getValue<string>();
        return <div className="text-truncate"> {payableAmount ? "$ " + payableAmount : 'N/A'} </div>;
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
    {
      header: "Status",
      enableSorting: false,
      enableColumnFilter: true,
      accessorKey: "paymentStatus",
      cell: (info) => {
        const paymentStatus = info.getValue<string>();
    
        return (
          <Badge
            className={cn(
              "px-2 py-1 text-sm font-medium",
              paymentStatus == "failed" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            )}
          >
            { titleCase(paymentStatus)}
          </Badge>
        );
      },
    },
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
        statusFilter={["Completed", "Failed"]}
        hideFilter={false}
        cursorPointer= {""}
      />
    </>
  );
};

export default TransactionTableComponent;
