"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { Contact } from "@/types/Contact";
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
import UserApi from "@/api/user";
import { useRouter } from "next/navigation";
import { formatName, shortName, titleCase } from "@/lib/utils";
import Swal from "sweetalert2";
import { format } from "date-fns";
import AuthService from "@/api/auth/AuthService";
import { useGetContacts } from "@/api/useGetContact";
import ContactApi from "@/api/contact";
import { useGetPlans } from "@/api/useGetPlans";

const PlansTableComponent = () => {
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

  const { allPlansData, isAllPlansDataLoading }: any = useGetPlans({
    sorting,
    columnFilters: debouncedColumnFilters,
    pagination
  });

  const [allPlans, setAllPlans]: any = useState([]);

  
  useEffect(() => {
    if(allPlansData?.error){
      404 != allPlansData?.status && toast({
        title: allPlansData?.errorMessage ? allPlansData?.errorMessage : "Uh oh! Something went wrong.",
        variant: "destructive", description: allPlansData?.error
      });
      (allPlansData?.status==401 || allPlansData?.status==403 ) && logout('');
    }
    setAllPlans(allPlansData);
  }, [allPlansData]);





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
            const deletedData = (allPlans.results = allPlans?.results?.filter(
              (res: any) => data?.id !== res?.id
            ));
            setAllPlans({ ...allPlans, results: deletedData });
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
  const userColumns: ColumnDef<Contact>[] = [

    {
      header: "Diamond",
      accessorKey: "diamond",
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
      header: "Price",
      accessorKey: "price",
      cell: (info) => {
        const price = info.getValue<string>();
        return <div className="text-truncate"> { price ? "$ " + price : 'N/A'} </div>;
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
  ];

  return (
    <>
      <TanStackBasicTable
        isTableDataLoading={isAllPlansDataLoading}
        paginatedTableData={allPlans}
        columns={userColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        details={details}
        statusFilter={["Active", "Inactive"]}
        hideFilter={true}
        cursorPointer= {""}
      />
    </>
  );
};

export default PlansTableComponent;
