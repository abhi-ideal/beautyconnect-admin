"use client";
import React from 'react'
import { useDebounce } from "@/hooks/useDebounce";
import { ColumnDef, ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import TanStackBasicTable from "../TanStackTable/TanStackBasicTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, LockKeyhole, LockKeyholeOpen, MoreHorizontal, Pencil, SquarePlay, Trash2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { formatName, shortName, titleCase } from "@/lib/utils";
import Swal from "sweetalert2";
import { format } from "date-fns";
import AuthService from "@/api/auth/AuthService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Chapter } from '@/types/Chapters';
import { useGetChapters } from '@/api/useGetChapters';
import { Card } from '../ui/card';
import AddEditChapter from '../form/AddEditChapter';
import ChapterApi from '@/api/chapterApi';
import Image from 'next/image'
import ChapterDetail from '../details/ChapterDetail';


const ChapterTableComponent = ({ courseId, lessonId}:any) => {
  const { logout } = AuthService();
  const router = useRouter();
  const { toast } = useToast();
    const [type, setType] = useState('add');
  
  // sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [open, setOpen] = useState(false);
  const [openDailog, setOpenDailog] = useState(false);
  const [tableRowData, setTableRowData] = useState({});
  
  const [editData, setEditData]: any = useState({});
  const {deleteChapter, updateChapter } = ChapterApi()
  
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const previewVideoPoster = process.env.NEXT_PUBLIC_PREVIEW_VIDEO_POSTER;


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
        await updateChapter({status: status}, data.id ).then(
          async (res: any) => {
            if (!res.error) {       
              const updatedCategory = allChapters?.results?.map((res: any) => {
                if (data?.id == res?.id) {
                  res.status = status;
                  return res;
                } else {
                  return res;
                }
              });
              setAllChapters({ ...allChapters, results: updatedCategory });
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




  async function deleteData(data: any) {
    Swal.fire({
      text: `Are you sure you want to delete this lesson content?`,
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
        await deleteChapter(data?.id).then((res: any) => {
          if (!res?.error) {
            const deletedData = (allChapters.results =
              allChapters?.results?.filter(
                (res: any) => data?.id !== res?.id
              ));
              setAllChapters({ ...allChapters, results: deletedData });
            toast({
              title: "Lesson Content deleted sucessfully.",
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





  //updates data
  async function update(data: any) {
    setOpen(true);
    setType('edit');
    setEditData(data);
  }

  const details = (data: any, header: string) => {
  //  router.push(`/courses/${courseId}/lesson/${lessonId}/chapter/${data?.id}`);
  };




  const categoryColumns: ColumnDef<Chapter>[] = [
    
    {
      header: "Media",
      accessorKey: "type",
      cell: (info: any) => {
        const rowData: any = info.row.original;
        const handleContent = (row: any) => {
          setOpenDailog(true);
          setTableRowData(row);
        };
    
        return (
          <div className="flex items-center">
            {rowData.type === "video" ? (
              rowData?.poster ? (
                <Image
                  onClick={() => handleContent(rowData)}
                  src={previewVideoPoster + rowData?.poster}
                  width={48}
                  height={48}
                  className="size-10 cursor-pointer"
                  alt="video"
                />
              ) : (
                <SquarePlay
                  onClick={() => handleContent(rowData)}
                  className="h-14 w-10 text-muted-foreground cursor-pointer"
                />
              )
            ) : (
              <div className="border-gray-600">
                <Image
                  onClick={() => handleContent(rowData)}
                  src={rowData?.type === "pdf" ? "/pdf.png" : "/default_image.png"}
                  width={48}
                  height={48}
                  className="size-10 dark:invert invert-0 cursor-pointer"
                  alt="pdf"
                />
              </div>
            )}
            <span className="ml-2">{titleCase(rowData.type)}</span>
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
    
    
    
    {
      header: "Title",
      accessorKey: "title",
      cell: (info) => {
        const title: any = info.getValue();
        return (<div className={`flex m-2`}>{ titleCase(title?.trim())}</div>)
      },
      enableSorting: true,
      enableColumnFilter: false
    },
    // {
    //   header: "File Name",
    //   accessorKey: "file",
    //   cell: (info) => {
    //     const file: any = info.getValue();
    //     return (<div className={`flex m-2`}>{ titleCase(file?.trim())}</div>)
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
              {/* <DropdownMenuItem onClick={() => updateData(rowData)} className="flex items-center space-x-2" >
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
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => deleteData(rowData)} className="flex items-center space-x-2" >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
              <span>Delete</span>
              </DropdownMenuItem>

              {/* <DropdownMenuItem onClick={() => update(rowData)} className="flex items-center space-x-2" >
              <Pencil className="h-4 w-4 text-muted-foreground" />
              <span>Update</span>
              </DropdownMenuItem> */}

              {/* <DropdownMenuItem
                onClick={() => router.push(`/courses/${courseId}/lesson/${lessonId}/chapter/${rowData?.id}`)}
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
{
      !open ?
      <div className="relative mt-4 sm:mt-8">
        <div className="flex gap-4">
          <div className="flex items-center">
            <Button onClick={() => {setType('add');setOpen(true)}}>Add Lesson Content</Button>
          </div>
        </div>
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
        hideFilter={true}
        cursorPointer= {""}
      />
      </div>
      :
      <div className='pt-4'>
        <Card className='p-4'>
        <div className="text-center text-2xl font-semibold">{type!='edit' ? "Add " : "Edit "}Lesson Content</div>
        <AddEditChapter props={{ lessonId:lessonId,  setOpen, type: type, editData, setEditData, allChapters, setAllChapters }} />
        </Card>
      </div>
      }

    <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            {/* <DialogTitle>Lesson Content</DialogTitle> */}
          </DialogHeader>
          <ChapterDetail tableRowData={tableRowData}  />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ChapterTableComponent