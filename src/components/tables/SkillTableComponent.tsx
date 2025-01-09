"use client";
import React from 'react'
import { useDebounce } from "@/hooks/useDebounce";
import { ColumnDef, ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import TanStackBasicTable from "../TanStackTable/TanStackBasicTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { formatName, shortName, titleCase } from "@/lib/utils";
import Swal from "sweetalert2";
import { format } from "date-fns";
import SkillsApi from '@/api/skills';
import AuthService from "@/api/auth/AuthService";
import AddEditSkill from '../form/AddEditSkill';
import { Skill } from '@/types/Skills';
import { useGetSkills } from '@/api/useGetSkills';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SkillsTableComponent = ({ allSkills, setAllSkills }: any) => {
  const { logout }=AuthService();
  const router = useRouter();
  const { toast } = useToast();
  const { deleteSkills, updateSkills } = SkillsApi();
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

  const { allSkillsData, isAllSkillsDataLoading }: any =
    useGetSkills({
      sorting,
      columnFilters: debouncedColumnFilters,
      pagination
    });

  useEffect(() => {
    if(allSkillsData?.error){
      404 !=allSkillsData?.status && toast({
        title: allSkillsData?.errorMessage ? allSkillsData?.errorMessage : "Uh oh! Something went wrong.",
        variant: "destructive", description: allSkillsData?.error
      });
      (allSkillsData?.status==401 || allSkillsData?.status==403 ) && logout('skilltable');
    }
    setAllSkills(allSkillsData);
  }, [allSkillsData]);

  async function deleteData(data: any) {
    Swal.fire({
      text: `Are you sure you want to delete this Specialization?`,
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
        await deleteSkills(data?.id).then((res: any) => {
          if (!res?.error) {
            const deletedData = (allSkillsData.results =
              allSkillsData?.results?.filter(
                (res: any) => data?.id !== res?.id
              ));
            setAllSkills({ ...allSkills, results: deletedData });
            toast({
              title: "Specialization deleted sucessfully.",
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
      text: `Are you sure you want to ${status} this Specialization.`,
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
        await updateSkills({status: status}, data.id ).then(
          async (res: any) => {
            if (!res.error) {       
              const updatedSkill = allSkills?.results?.map((res: any) => {
                if (data?.id == res?.id) {
                  res.status = status;
                  return res;
                } else {
                  return res;
                }
              });
              setAllSkills({ ...allSkills, results: updatedSkill });
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

  const skillColumns: ColumnDef<Skill>[] = [

    {
      header: "Image",
      accessorFn: (row: any) => row.image,
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info:any) => {
        const imageUrl = info.getValue();
        const resolvedImageUrl = imageUrl?.startsWith("https://")
        ? imageUrl
        : previewImgUrl + imageUrl;  
        return (
          <Avatar className="border border-gray-700" >
            <AvatarImage
              src={resolvedImageUrl} 
            />
            <AvatarFallback className="bg-[#FFC1BB]" >
              {formatName(info.row.original.title) || "DI"}
            </AvatarFallback>
          </Avatar>
        );
      }
    },
    {
      header: "Title",
      accessorKey: "title",
      accessorFn: (row: any) => ({
        icon: row?.icon,
        title: row?.title,
      }),
      enableSorting: false,
      enableColumnFilter: true,
      cell: (info: any) => {
        const { icon, title } = info.getValue();
        const color=["bg-[#FFC1BB]","bg-orange-500","bg-lime-500","bg-cyan-500","bg-blue-500","bg-rose-500"];
        const bgColor = color[info?.row?.index % color.length ]
        return (
          <div className="flex items-center">
            <Avatar className="mr-3 border border-gray-700">
              <AvatarImage
                src={
                  icon
                    ? previewImgUrl+icon
                    : ""
                }
                alt={title || "icon"}
              />
              <AvatarFallback className={bgColor}>{formatName(title || "N/A")}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-truncate">
                {title ? titleCase(title?.trim()) : "N/A"}
              </div>
              {/* <div className="text-sm text-muted-foreground text-truncate">
                {email || "N/A"}
              </div> */}
            </div>
          </div>
        );
      }
    },
    // {
    //   header: "Title",
    //   accessorKey: "title",
    //   accessorFn: (row: Skill) => row.title,
    //   cell: (info) => {
    //     const title:any = info.getValue();
    //     return (<div className={`flex m-2 text-truncate`}>{ titleCase(title) || "N/A"}</div>)
    //   },
    // },
    // {
    //   header: "Description",
    //   accessorKey: "description",
    //   cell: (info) => {
    //     const desc = info.getValue<string>();
    //     const index = info.row.index;
    //     const isExpanded = expandedDesc[index] || false;
    //     return <div className="">
    //       {shortName(desc, isExpanded)}
    //       {desc && desc.length >= 28 && (
    //         <button className="text-cyan-500" onClick={() => toggleSectionExpanded(index)}>
    //           {isExpanded ? "Read less" : "Read more"}
    //         </button>
    //       )}
    //     </div>
    //   }
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
              <DropdownMenuItem onClick={() => updateData(rowData)}>
                {
                  rowData.status ? rowData.status == "active"
                    ? "Inactive" : "Active" : "N/A"
                }
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteData(rowData)}>
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => update(rowData)}>
                Update
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
        isTableDataLoading={isAllSkillsDataLoading}
        paginatedTableData={allSkills}
        columns={skillColumns}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Specialization</DialogTitle>
          </DialogHeader>
          <AddEditSkill
            props={{ setOpen, type: "Edit", editData, setEditData, allSkills, setAllSkills }}
          ></AddEditSkill>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SkillsTableComponent
