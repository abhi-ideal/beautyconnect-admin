"use client";
import React from 'react'
import { useDebounce } from "@/hooks/useDebounce";
import { ColumnDef, ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import TanStackBasicTable from "../TanStackTable/TanStackBasicTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LockKeyhole, LockKeyholeOpen, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { formatName, shortName, titleCase } from "@/lib/utils";
import Swal from "sweetalert2";
import { format } from "date-fns"; 
import AuthService from "@/api/auth/AuthService";
import AddEditSkill from '../form/AddEditSkill';
import { Skill } from '@/types/Skills';
// import { useGetSkills } from '@/api/useGetSkills';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetCourseCategory } from '@/api/useGetCourseCategory';
import CourseCategoryApi from '@/api/courseCategory';
import { CourseCategory } from '@/types/CourseCategory';
import { log } from 'console';
import AddEditCoursecategory from '../form/AddEditCourseCategory';

const CourseCategoryTableComponent = ({ allCourseCategory, setAllCourseCategory }: any) => {
  const { logout }=AuthService();
  const router = useRouter();
  const { toast } = useToast();
  const { deleteCourseCategory, updateCourseCategory } = CourseCategoryApi();
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
  const refreshPage = () => {
    window.location.reload();
  };
  

  const { allCourseCategoryData, isAllCourseCategoryDataLoading }: any =
  useGetCourseCategory({
      sorting,
      columnFilters: debouncedColumnFilters,
      pagination
    });
console.log("allCourseCategoryData",allCourseCategoryData)
  useEffect(() => {
    if(allCourseCategoryData?.error){
      404 !=allCourseCategoryData?.status && toast({
        title: allCourseCategoryData?.errorMessage ? allCourseCategoryData?.errorMessage : "Uh oh! Something went wrong.",
        variant: "destructive", description: allCourseCategoryData?.error
      });
      (allCourseCategoryData?.status==401 || allCourseCategoryData?.status==403 ) && logout('courseCategorytable');
    }
    setAllCourseCategory(allCourseCategoryData);
  }, [allCourseCategoryData]);

  async function deleteData(data: any) {
    Swal.fire({
      text: `Are you sure you want to delete this Course Category?`,
      showCancelButton: true,
      confirmButtonColor: `#18181B`,
      cancelButtonColor: "white",
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
      confirmButtonText: "Confirm Delete"
    }).then(async (result: any) => {
      if (result.value) {
        console.log('value',result?.value);
        
        await deleteCourseCategory(data?.id).then((res: any) => {
          if (!res?.error) {
            const deletedData = (allCourseCategoryData.results =
              allCourseCategoryData?.results?.filter(
                (res: any) => data?.id !== res?.id
              ));
            setAllCourseCategory({ ...allCourseCategory, results: deletedData });
            toast({
              title: "Course Category deleted sucessfully.",
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
      text: `Are you sure you want to ${status} this Course Category.`,
      showCancelButton: true,
      confirmButtonColor: `#18181B`,
      cancelButtonColor: "white",
      icon: "warning",
         customClass: { 
        popup: "max-w-[393px] px-8 py-4 !rounded-[20px]",
        icon: "text-[9.275px] mt-[0!important]",
        htmlContainer:
          "px-[0!important] pb-[0!important] [font-size:16px!important]",
        actions: "-mx-5",
        confirmButton: "[flex:0_0_auto] w-[calc(50%_-10px)] px-[0!important] !bg-btn !rounded-[20px]",
        cancelButton: `w-[calc(50%_-10px)] text-black border border-[#000000B2] border-solid px-[0!important] !rounded-[20px]`,
       },
      confirmButtonText: `Confirm ${
        data.status == "active" ? "Inactive" : "Active"
      }`
    }).then(async (result: any) => {
      if (result.value) {
        await updateCourseCategory({status: status}, data.id ).then(
          async (res: any) => {
            if (!res.error) {       
              const updatedSkill = allCourseCategory?.results?.map((res: any) => {
                if (data?.id == res?.id) {
                  res.status = status;
                  return res;
                } else {
                  return res;
                }
              });
              setAllCourseCategory({ ...allCourseCategory, results: updatedSkill });
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
    // header!="description" && router.push(`category/${data?.id}`)
  };

  const toggleSectionExpanded = (index:any) => {
    setExpandedDesc((prevState:any) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const courseCategoryColumns: ColumnDef<CourseCategory>[] = [

    {
      header: "Title",
      accessorKey: "title",
      accessorFn: (row: any) => ({
        image: row?.image,
        title: row?.title,
      }),
      enableSorting: false,
      enableColumnFilter:  true,
      cell: (info:any) => {
        const data = info.getValue();
     
        const color=["bg-[#FFC1BB]","bg-orange-500","bg-lime-500","bg-cyan-500","bg-blue-500","bg-rose-500"];
        const bgColor = color[info?.row?.index % color.length ]
        const resolvedImageUrl = data?.image?.startsWith("https://")
        ? data?.image
        : previewImgUrl +  data?.image;   
        return (
          <div className="flex items-center">
            <Avatar className="mr-3 border border-border">
              <AvatarImage
                 src={resolvedImageUrl} 
                alt={data?.title}
              />
              <AvatarFallback className={bgColor}>{formatName(data?.title || "N/A")}</AvatarFallback>
            </Avatar>
            <div>
              <div className=" text-truncate">
                {data?.title ? titleCase(data?.title?.trim()) : "N/A"}
              </div>
             
            </div>
          </div>
        );
      }
    },
     
    {
      header: "Total Courses",
      accessorKey: "totalCourses",
      cell: (info) => {
        const  totalCourses = info?.getValue<string>();
        return  <div> {totalCourses ? totalCourses : 0}</div>
      },
      enableColumnFilter: false
    }
,
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
      accessorFn: (row: Skill) => row.status,
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
                  {rowData.status
                    ? rowData.status == "active"
                      ? "Inactive"
                      : "Active"
                    : "N/A"}
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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ]; 
  return (
    <>
      <TanStackBasicTable
        isTableDataLoading={isAllCourseCategoryDataLoading}
        paginatedTableData={allCourseCategory}
        columns={courseCategoryColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        details={details}
        statusFilter={["Active", "Inactive"]}
        cursorPointer= {""}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Course Category </DialogTitle>
          </DialogHeader>
          <AddEditCoursecategory
            props={{ setOpen, type: "Edit", editData, setEditData, allCourseCategory, setAllCourseCategory }}
          ></AddEditCoursecategory>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default  CourseCategoryTableComponent
