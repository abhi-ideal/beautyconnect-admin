"use client";
import React from 'react'
import { useDebounce } from "@/hooks/useDebounce";
import { ColumnDef, ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import TanStackBasicTable from "../TanStackTable/TanStackBasicTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Eye, LockKeyhole, LockKeyholeOpen, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { formatName, shortName, titleCase } from "@/lib/utils";
import Swal from "sweetalert2";
import { format } from "date-fns";
import AuthService from "@/api/auth/AuthService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Course } from '@/types/Courses';
import { useGetCourses } from '@/api/useGetCourses';
import CourseApi from '@/api/courseApi';
import AddEditCourse from '../form/AddEditCourse';

const CourseTableComponent = ({ allCourses, setAllCourses }: any) => {
  const { logout }=AuthService();
  const router = useRouter();
  const { toast } = useToast();
  const { updateCourse, deleteCourse } = CourseApi();
  const [expandedDesc, setExpandedDesc ]:any = useState({});
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


  const { allCoursesData, isAllCoursesDataLoading }: any =
    useGetCourses({
      sorting,
      columnFilters: debouncedColumnFilters,
      pagination
    });

  useEffect(() => {
    if(allCoursesData?.error){
      404 != allCoursesData?.status && toast({
        title: allCoursesData?.errorMessage ? allCoursesData?.errorMessage : "Uh oh! Something went wrong.",
        variant: "destructive", description: allCoursesData?.error
      });
      (allCoursesData?.status==401 || allCoursesData?.status==403 ) && logout('coursetable__');
    }
    setAllCourses(allCoursesData);

  }, [allCoursesData]);


  async function deleteData(data: any) {
    Swal.fire({
      text: `Are you sure you want to delete this Course?`,
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
        await deleteCourse(data?.id).then((res: any) => {
          if (!res?.error) {
            const deletedData = (allCoursesData.results =
              allCoursesData?.results?.filter(
                (res: any) => data?.id !== res?.id
              ));
            setAllCourses({ ...allCourses, results: deletedData });
            toast({
              title: "Course deleted sucessfully.",
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
        await updateCourse({status: status}, data.id ).then(
          async (res: any) => {
            if (!res.error) {       
              const updatedCategory = allCourses?.results?.map((res: any) => {
                if (data?.id == res?.id) {
                  res.status = status;
                  return res;
                } else {
                  return res;
                }
              });
              setAllCourses({ ...allCourses, results: updatedCategory });
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
    setEditData(data);
  }

  const details = (data: any, header:string) => {
    // header!="title" && 
    router.push(`courses/${data?.id}`)
  };

  const toggleSectionExpanded = (index:any) => {
    setExpandedDesc((prevState:any) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const color=["bg-orange-500","bg-lime-500","bg-cyan-500","bg-blue-500","bg-rose-500"];

  const categoryColumns: ColumnDef<Course>[] = [
    {
      header: "Image",
      accessorFn: (row: Course) => row?.media,
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
              {formatName(info.row.original?.title) || "N/A"}
            </AvatarFallback>
          </Avatar>
          {/* <p className="m-2">{titleCase(info.row.original?.title)||"N/A"}</p> */}
          </div>
        );
      }
    },
    {
      header: "Title",
      accessorKey: "title",
      accessorFn: (row: Course) => row?.title,
      cell: (info) => {
        const title = info.getValue<string>();
        return <div className="text-truncate"> {title ? titleCase(title?.trim()) : 'N/A'} </div>;
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
      enableColumnFilter: true,
    },
    
    {
      header: "Experience",
      accessorKey: "experience",
      cell: (info) => {
        const experience = info.getValue<string>();
        return <div className="text-truncate"> {experience ? experience?.trim() : 'N/A'} </div>;
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (info) => {
        const amount:any = info.getValue();
        return (<div className={`flex m-2`}>{ "$ "+amount || 0 }</div>)
      },
      enableSorting: true,
      enableColumnFilter: false
    },
    {
      header: "Rating",
      accessorKey: "rating",
      cell: (info) => {
        const rating:any = info.getValue();
        return <div className={`flex m-2`}> {rating || 0 }</div>
      },
      enableSorting: true,
      enableColumnFilter: false
    },
    {
      header: "Total Lesson",
      accessorKey: "totalLesson",
      cell: (info) => {
        const totalLesson:any = info.getValue();
        return <div className={`flex m-2`}> {totalLesson || 0 }</div>
      },
      enableSorting: true,
      enableColumnFilter: false
    },
    {
      header: "Total Purchase",
      accessorKey: "totalPurchase",
      cell: (info:any) => {
        const totalPurchase = info.getValue();
        return <div className={`flex m-2`}> {totalPurchase || 0 }</div>
      },
      enableSorting: true,
      enableColumnFilter: false
    },
    // {
    //   header: "Course Type",
    //   accessorKey: "courseType",
    //   accessorFn: (row: Course ) => row.courseType,
    //   cell: (info) => {
    //     const courseType:any = info.getValue();
    //     return (<div className={`flex m-2`}>{ titleCase(courseType) || "N/A"}</div>)
    //   },
    //   enableSorting: true,
    //   enableColumnFilter: false
    // },
    // {
    //   header: "Category",
    //   accessorKey: "category",
    //   accessorFn: (row: Course ) => row?.category?.[0],
    //   cell: (info) => {
    //     const title:any = info.getValue();
    //     return (<div className={`flex m-2`}>{ titleCase(title) || "N/A"}</div>)
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
      accessorFn: (row: Course) => row.status,
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
                onClick={() => router.push(`courses/${rowData.id}`)}
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
      <TanStackBasicTable
        isTableDataLoading={isAllCoursesDataLoading}
        paginatedTableData={allCourses}
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
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <AddEditCourse
            props={{ setOpen, type: "Edit", editData, setEditData, allCourses, setAllCourses }}
          ></AddEditCourse>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CourseTableComponent;