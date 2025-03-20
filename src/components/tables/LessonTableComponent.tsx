"use client";
import React from 'react'
import { useDebounce } from "@/hooks/useDebounce";
import { ColumnDef, ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import TanStackBasicTable from "../TanStackTable/TanStackBasicTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, LockKeyhole, LockKeyholeOpen, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { formatName, shortName, titleCase } from "@/lib/utils";
import Swal from "sweetalert2";
import { format } from "date-fns";
import AuthService from "@/api/auth/AuthService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lesson } from '@/types/Lessons';
import { useGetLessons } from '@/api/useGetLessons';
import { Card } from '../ui/card';
import AddEditLesson from '../form/AddEditLesson';
import LessonApi from '@/api/lessonApi';

const LessonTableComponent = ({courseId, allLessons, setAllLessons}:any) => {
  const { logout } = AuthService();
  const router = useRouter();
  const { toast } = useToast();
  const [expandedDesc, setExpandedDesc]: any = useState({});
  // sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('add');
  const [editData, setEditData]: any = useState({});
  const {deleteLesson, updateLesson } = LessonApi()
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;

  // column filters state of the table
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);

  // pagination state of the table
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 20 //default page size
  });

  // const [allLessons, setAllLessons]: any = useState([]);

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








  async function deleteData(data: any) {
    Swal.fire({
      text: `Are you sure you want to delete this lesson?`,
      showCancelButton: true,
      confirmButtonColor: `#18181B`,
      cancelButtonColor: "white",
      icon: "warning",
      customClass: {
        cancelButton: `cancel_button`
      },
      confirmButtonText: "Confirm Delete"
    }).then(async (result: any) => {
      if (result.value) {
        await deleteLesson(data?.id).then((res: any) => {
          if (!res?.error) {
            const deletedData = (allLessons.results =
              allLessons?.results?.filter(
                (res: any) => data?.id !== res?.id
              ));
              setAllLessons({ ...allLessons, results: deletedData });
            toast({
              title: "Lesson deleted sucessfully.",
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


  async function updateData(data: any) {
    const status: any = data.status == "active" ? "inactive" : "active";
    Swal.fire({
      text: `Are you sure you want to ${status} this course.`,
      showCancelButton: true,
      confirmButtonColor: `#18181B`,
      cancelButtonColor: "white",
      icon: "warning",
      customClass: {
        cancelButton: `cancel_button`
      },
      confirmButtonText: `Confirm ${
        data.status == "active" ? "Inactive" : "Active"
      }`
    }).then(async (result: any) => {
      if (result.value) {
        await updateLesson({status: status}, data.id ).then(
          async (res: any) => {
            if (!res.error) {       
              const updatedCategory = allLessons?.results?.map((res: any) => {
                if (data?.id == res?.id) {
                  res.status = status;
                  return res;
                } else {
                  return res;
                }
              });
              setAllLessons({ ...allLessons, results: updatedCategory });
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



  //updates data
  async function update(data: any) {
    setOpen(true);
    setType('edit');
    setEditData(data);
  }

  const details = (data: any, header: string) => {
    router.push(`/courses/${courseId}/lesson/${data?.id}`)
  };

  const [expandedDescription, setExpandedDescription]:any = useState({});
  const toggleSectionExpanded = (index:any) => {
    setExpandedDescription((prevState:any) => ({
      ...prevState, [index]: !prevState[index]
    }));
  };
  const color=["bg-orange-500","bg-lime-500","bg-cyan-500","bg-blue-500","bg-rose-500"];

  const categoryColumns: ColumnDef<Lesson>[] = [
        {
          header: "Image",
          accessorFn: (row: any) => row?.image,
          enableSorting: false,
          enableColumnFilter: false,
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
                  {formatName(info.row.original?.title) || "NA"}
                </AvatarFallback>
              </Avatar>
              </div>
            );
          }
        },
    {
      header: "Title",
      accessorKey: "title",
      cell: (info) => {
        const title: any = info.getValue();
        return (<div className={`flex m-2`}>{ titleCase(title?.trim()) || "NA"}</div>)
      },
      enableSorting: true,
      enableColumnFilter: true
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (info) => {
        const description = info.getValue<string>();
        return <div className="text-truncate"> {description ? description : 'N/A'} </div>;
      },
      enableSorting: false,
      enableColumnFilter: false,
    },

    // {
    //   header: "Lesson Content",
    //   accessorKey: "lessonContentInfo",
    //   cell: (info) => {
    //     const lessonContent: any = info.getValue();
    //     return (<div className={`flex m-2`}>{ lessonContent.length ? lessonContent.length : 0}</div>)
    //   },
    //   enableSorting: false,
    //   enableColumnFilter: false
    // },
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
      accessorFn: (row: Lesson) => row.status,
      cell: (info) => {
        const Status: any = info.getValue();
        return (<div className={`flex m-2`}>{titleCase(Status) || "N/A"}</div>)
      },
      enableSorting: false
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
              <DropdownMenuItem onClick={() => updateData(rowData)} className="flex items-center space-x-2" >
              {rowData.status == "active" ? 
                (<LockKeyhole className="h-4 w-4 text-muted-foreground" />) : (
                <LockKeyholeOpen className="h-4 w-4 text-muted-foreground" />
                )}
              
              <span>
                {
                  rowData.status ? rowData.status == "active"
                    ? "Inactive" : "Active" : "N/A"
                }
                 </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteData(rowData)} className="flex items-center space-x-2" >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
              <span>Delete</span>
              </DropdownMenuItem>
             
              <DropdownMenuItem onClick={() => update(rowData)} className="flex items-center space-x-2" >
              <Pencil className="h-4 w-4 text-muted-foreground" />
              <span>Update</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/courses/${courseId}/lesson/${rowData.id}`)}
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
    {
      !open ?
      <div className="relative mt-4 md:mt-6">
        <div className="absolute top-0 start-0 flex gap-4">
          <div className="flex items-center">
            <Button onClick={() => {setType('add');setOpen(true)}}>Add Lesson</Button>
          </div>
        </div>
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
        cursorPointer= {"cursor-pointer"}
        />
      </div>
      :
      <div className='pt-4'>
        <div className="text-center text-2xl font-semibold">{type!='edit' ? "Add " : "Edit "}Lesson</div>
        <AddEditLesson props={{ courseId:courseId,  setOpen, type: type, editData, setEditData, allLessons, setAllLessons }} />
      </div>
      }
    </>
  )
}

export default LessonTableComponent