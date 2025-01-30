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
import { Eye, LockKeyhole, LockKeyholeOpen, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
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

const ContactTableComponent = () => {
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

  const { allContactData, isAllContactDataLoading }: any = useGetContacts({
    sorting,
    columnFilters: debouncedColumnFilters,
    pagination
  });

  const [allContacts, setAllContacts]: any = useState([]);

  
  useEffect(() => {
    if(allContactData?.error){
      404 != allContactData?.status && toast({
        title: allContactData?.errorMessage ? allContactData?.errorMessage : "Uh oh! Something went wrong.",
        variant: "destructive", description: allContactData?.error
      });
      (allContactData?.status==401 || allContactData?.status==403 ) && logout('');
    }
    setAllContacts(allContactData);
  }, [allContactData]);





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
            const deletedData = (allContacts.results = allContacts?.results?.filter(
              (res: any) => data?.id !== res?.id
            ));
            setAllContacts({ ...allContacts, results: deletedData });
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
    // {
    //   header: "User Name",
    //   accessorKey: "name",
    //   accessorFn: (row: any) => row?.profile,
    //   enableSorting: false,
    //   enableColumnFilter: true,
    //   cell: (info:any) => {
    //     const imageUrl = info.getValue();
    //     const bgColor = color[info?.row?.index % color.length ]
    //     return (
    //       <div className="flex">
    //       <Avatar>
    //         <AvatarImage
    //           src={previewImgUrl+imageUrl}
    //         />
    //         <AvatarFallback className={bgColor}>
    //           {formatName(info.row.original?.name) || "N/A"}
    //         </AvatarFallback>
    //       </Avatar>
    //       <div className=" m-2 text-truncate"> {info.row.original?.name ? titleCase(info.row.original?.name?.trim()) : 'N/A'} </div>
    //       </div>
    //     );
    //   }
    // },
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
      cell: (info) => {
        const email = info.getValue<string>();
        return <div className="text-truncate"> { email || 'N/A'} </div>;
      },
    },
    // {
    //   header: "Description",
    //   accessorKey: "description",
    //   cell: (info) => {
    //     const description = info.getValue<string>();
    //     return <div className=""> {description ? description : 'N/A'} </div>;
    //   },
    //   enableSorting: false,
    //   enableColumnFilter: false,
    // },
    {
      header: "Description",
      accessorKey: "description",
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        const desc = info.getValue<string>();
        const index = info.row.index;
        const isExpanded = expandedDesc[index] || false;
        return <div className="">
          {shortName(desc, isExpanded)}
          {desc && desc.length >= 28 && (
            <button className="text-pink-500" onClick={() => toggleSectionExpanded(index)}>
              {isExpanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      }
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
              {/* <DropdownMenuItem onClick={() => updateData(rowData)} className="flex items-center space-x-2" >
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
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => deleteData(rowData)} className="flex items-center space-x-2" >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
              <span>Delete</span>
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                onClick={() => router.push(`users/${rowData.id}`)}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>View Detail</span>
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
        isTableDataLoading={isAllContactDataLoading}
        paginatedTableData={allContacts}
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

export default ContactTableComponent;
