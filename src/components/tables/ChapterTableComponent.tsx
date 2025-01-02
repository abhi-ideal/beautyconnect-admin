"use client";
import React from 'react'
import { useDebounce } from "@/hooks/useDebounce";
import { ColumnDef, ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import TanStackBasicTable from "../TanStackTable/TanStackBasicTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { formatName, shortName, titleCase } from "@/lib/utils";
import Swal from "sweetalert2";
import { format } from "date-fns";
import AuthService from "@/api/auth/AuthService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Chapter } from '@/types/Chapters';
import { useGetChapters } from '@/api/useGetChapters';

const ChapterTableComponent = ({ courseId, lessonId}:any) => {
  const { logout } = AuthService();
  const router = useRouter();
  const { toast } = useToast();
  const [expandedDesc, setExpandedDesc]: any = useState({});
  // sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData]: any = useState({});
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;

  // column filters state of the table
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);

  // pagination state of the table
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 20 //default page size
  });

  const [allChapters, setAllChapters]: any = useState([]);

  const { allChaptersData, isAllChaptersDataLoading }: any =
    useGetChapters({
      sorting,
      columnFilters: debouncedColumnFilters,
      pagination,
      lessonId
    });

  useEffect(() => {
    if (allChaptersData?.error) {
      404 != allChaptersData?.status && toast({
        title: allChaptersData?.errorMessage ? allChaptersData?.errorMessage : "Uh oh! Something went wrong.",
        variant: "destructive", description: allChaptersData?.error
      });
      (allChaptersData?.status == 401 || allChaptersData?.status == 403) && logout('chaptertable__');
    }
    setAllChapters(allChaptersData);
  }, [allChaptersData]);


  //updates data
  async function update(data: any) {
    setOpen(true);
    setEditData(data);
  }

  const details = (data: any, header: string) => {
    // header != "description" && router.push(`/${data?.id}`)
    header != "description" && router.push(`/courses/${courseId}/lesson/${lessonId}/chapter/${data?.id}`);
  };

  const toggleSectionExpanded = (index: any) => {
    setExpandedDesc((prevState: any) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const color = ["bg-orange-500", "bg-lime-500", "bg-cyan-500", "bg-blue-500", "bg-rose-500"];

  const categoryColumns: ColumnDef<Chapter>[] = [
    {
      header: "User",
      accessorFn: (row: Chapter) => row?.userDetails?.image,
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        const imageUrl = info.getValue();
        const bgColor = color[info?.row?.index % color.length]
        return (
          <div className="flex">
            <Avatar>
              <AvatarImage
                src={typeof imageUrl === "string" ? previewImgUrl + imageUrl : undefined}
              />
              <AvatarFallback className={bgColor}>
                {formatName(info.row.original.userDetails?.name) || "N/A"}
              </AvatarFallback>
            </Avatar>
            <p className="m-2">{info.row.original?.userDetails?.name || "N/A"}</p>
          </div>
        );
      }
    },
    {
      header: "Title",
      accessorKey: "title",
      cell: (info) => {
        const title: any = info.getValue();
        return (<div className={`flex m-2`}>{ titleCase(title)}</div>)
      },
      enableSorting: true,
      enableColumnFilter: true
    },
    {
      header: "Status",
      accessorKey: "status",
      accessorFn: (row: Chapter) => row.status,
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
    },
    {
      id: "actions",
      header: "Action",
      enableSorting: false,
      enableColumnFilter: false,

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
              <DropdownMenuItem onClick={() => router.push(`/courses/${courseId}/lesson/${lessonId}/chapter/${rowData?.id}`)}>
                View Chapters Details
              </DropdownMenuItem>
              {/* 
              <DropdownMenuItem onClick={() => updateData(rowData)}>
                {
                  rowData.status ? rowData.status == "active"
                    ? "Inactive" : "Active" : "N/A"
                }
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteData(rowData)}>
                Delete
              </DropdownMenuItem>
              */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  return (
    <>
      <TanStackBasicTable
        isTableDataLoading={isAllChaptersDataLoading}
        paginatedTableData={allChapters}
        columns={categoryColumns}
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
  )
}

export default ChapterTableComponent