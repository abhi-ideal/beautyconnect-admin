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
import { Lesson } from '@/types/Lessons';
import { useGetLessons } from '@/api/useGetLessons';

const LessonTableComponent = ({courseId}:any) => {
  const { logout } = AuthService();
  const router = useRouter();
  const { toast } = useToast();
  const [expandedDesc, setExpandedDesc]: any = useState({});
  // sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData]: any = useState({});

  // column filters state of the table
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);

  // pagination state of the table
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 20 //default page size
  });

  const [allLessons, setAllLessons]: any = useState([]);

  const { allLessonsData, isAllLessonsDataLoading }: any =
    useGetLessons({
      sorting,
      columnFilters: debouncedColumnFilters,
      pagination,
      courseId
    });

  useEffect(() => {
    if (allLessonsData?.error) {
      404 != allLessonsData?.status && toast({
        title: allLessonsData?.errorMessage ? allLessonsData?.errorMessage : "Uh oh! Something went wrong.",
        variant: "destructive", description: allLessonsData?.error
      });
      (allLessonsData?.status == 401 || allLessonsData?.status == 403) && logout('Lessontable__');
    }
    setAllLessons(allLessonsData);
  }, [allLessonsData]);

  //updates data
  async function update(data: any) {
    setOpen(true);
    setEditData(data);
  }

  const details = (data: any, header: string) => {
    header != "description" && router.push(`/courses/${courseId}/lesson/${data?.id}`)
  };

  const [expandedDescription, setExpandedDescription]:any = useState({});
  const toggleSectionExpanded = (index:any) => {
    setExpandedDescription((prevState:any) => ({
      ...prevState, [index]: !prevState[index]
    }));
  };

  const categoryColumns: ColumnDef<Lesson>[] = [
    {
      header: "Title",
      accessorKey: "title",
      cell: (info) => {
        const title: any = info.getValue();
        return (<div className={`flex m-2`}>{ titleCase(title) || "NA"}</div>)
      },
      enableSorting: true,
      enableColumnFilter: true
    },
    {
      header: "Total Chapter",
      accessorKey: "totalChapter",
      cell: (info) => {
        const totalChapter: any = info.getValue();
        return (<div className={`flex m-2`}>{totalChapter || 0}</div>)
      },
      enableSorting: true,
      enableColumnFilter: false
    },
    // {
    //   header: "Description",
    //   accessorKey: "description",
    //   accessorFn: (row: Lesson) => row?.description,
    //   cell: (info) => {
    //     const desc = info.getValue<string>();
    //     const index = info.row.index;
    //     const isExpanded = expandedDescription[index] || false;
    //     return <div className="w-80">{shortName(desc, isExpanded)}
    //     {desc && desc.length >= 28 && (
    //       <button className="text-cyan-500" onClick={() => toggleSectionExpanded(index)}>{isExpanded ? "Read less" : "Read more"}</button>
    //     )}
    //   </div>
    //   },
    //   enableSorting: true,
    //   enableColumnFilter: false
    // },
    {
      header: "Status",
      accessorKey: "status",
      accessorFn: (row: Lesson) => row.status,
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
              <DropdownMenuItem onClick={() => router.push(`/courses/${courseId}/lesson/${rowData?.id}`)}>
                View Chapters
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
        isTableDataLoading={isAllLessonsDataLoading}
        paginatedTableData={allLessons}
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

export default LessonTableComponent