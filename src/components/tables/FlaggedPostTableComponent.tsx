"use client";
import { useGetFlaggedPosts } from "@/api/useGetFlaggedPosts";
import { useDebounce } from "@/hooks/useDebounce";
import { ColumnDef, ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import TanStackBasicTable from "../TanStackTable/TanStackBasicTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, LockKeyhole, LockKeyholeOpen, MoreHorizontal, SquarePlay } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { formatName, shortName, titleCase } from "@/lib/utils";
import Swal from "sweetalert2";
import { format } from "date-fns";
import AuthService from "@/api/auth/AuthService";
import Image from 'next/image'
import ReportApi from "@/api/report";
import PostApi from "@/api/post";
import { flaggedPost } from "@/types/FlaggedPosts";

const FlaggedPostTableComponent = () => {
  const { logout } = AuthService();
  // sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { updatePost } = PostApi();
  const { deleteFlaggedPost } = ReportApi();
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

  const { allFlaggedPostsData, isAllFlaggedPostsDataLoading,  }: any = useGetFlaggedPosts({
    sorting,
    columnFilters: debouncedColumnFilters,
    pagination
  });





  const [ allFlaggedPosts, setAllFlaggedPosts]: any = useState([]);

  useEffect(() => {
    if (allFlaggedPostsData?.error) {
      404 != allFlaggedPostsData?.status && toast({
        title: allFlaggedPostsData?.errorMessage ? allFlaggedPostsData?.errorMessage : "Uh oh! Something went wrong.",
        variant: "destructive", description: allFlaggedPostsData?.error
      });
      (allFlaggedPostsData?.status == 401 || allFlaggedPostsData?.status == 403) && logout('flaggpost');
    }
    setAllFlaggedPosts(allFlaggedPostsData);
  }, [allFlaggedPostsData]);

  async function updateData(data: flaggedPost) {
    const status: any = data.feedData.status == "active" ? "inactive" : "active";
    Swal.fire({
      // title: status == "active" ? "Active" : "Inactive",
      text: `Are you sure you want to ${status} this post.`,
      showCancelButton: true,
      confirmButtonColor: `#18181B`,
      cancelButtonColor: "white",
      icon: "warning",
      customClass: {
        cancelButton: `cancel_button`
      },
      confirmButtonText: `Confirm ${data?.feedData?.status == "active" ? "Inactive" : "Active"}`
    }).then(async (result: any) => {
      if (result.value) {
        await updatePost({ status: status, id: data?.actionId }).then(
          async (res: any) => {
            if (!res.error) {
              const updatedPost = allFlaggedPosts?.results?.map((res: any) => {
                if (data?.actionId == res?.actionId) {
                  res.feedData.status = status;
                  return res;
                } else {
                  return res;
                }
              });
              setAllFlaggedPosts({ ...allFlaggedPosts, results: updatedPost });
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

  const [expandedDescription, setExpandedDescription]:any = useState({});
  const toggleSectionExpanded = (index:any) => {
    setExpandedDescription((prevState:any) => ({
      ...prevState, [index]: !prevState[index]
    }));
  };

  async function deleteData(data: any) {
    Swal.fire({
      // title: "Delete",
      text: `Are you sure you want to UnFlagged this post ?`,
      showCancelButton: true,
      confirmButtonColor: `#18181B`,
      cancelButtonColor: "white",
      confirmButtonText: "Confirm",
      icon: "warning",
      customClass: {
        cancelButton: `cancel_button`
      },
    }).then(async (result: any) => {
      if (result.value) {
        await deleteFlaggedPost(data?.actionId).then((res: any) => {
          if (!res.error) {
            const deletedData = (allFlaggedPosts.results = allFlaggedPosts?.results?.filter(
              (res: any) => data?.actionId !== res?.actionId
            ));
            setAllFlaggedPosts({ ...allFlaggedPosts, results: deletedData });
            toast({
              title: "Report cancelled sucessfully.",
              description: res?.message,
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
  const details = (data: flaggedPost, header:string) => {
    // header!='description'&& 
    header!='mark' &&router.push(`flagged-posts/${data?.actionId}`)
  }
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const previewVideoPoster = process.env.NEXT_PUBLIC_PREVIEW_VIDEO_POSTER;
  const color = ["bg-[#FFC1BB]","bg-orange-500", "bg-lime-500", "bg-cyan-500", "bg-blue-500", "bg-rose-500"];
  const postColumns: ColumnDef<flaggedPost>[] = [
    {
      header: "Post",
      accessorFn: (row: flaggedPost) => row?.feedData?.contents?.[0],
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        const imageUrl :any = info.getValue();
        return (
          <>
           {(imageUrl?.mimeType.includes("video") || imageUrl?.mimeType.includes("m3u8")) ? ( imageUrl?.poster ? <Image src={ previewVideoPoster + imageUrl?.poster } width={50} height={50} className="size-10 rounded-full"  alt="NA"/> : <SquarePlay className="size-10 text-muted-foreground"/>) : 
            <>
            <div className="border-gray-600">
              <Image src={ imageUrl?.file ? previewImgUrl + imageUrl?.file : "/default_image.png"} width={50} height={50} className="size-10 rounded-full"  alt="NA"/>
            </div> 
            </>}
          </>
        );
      }
    },
    {
      header: "Reported by",
      accessorKey: "name",
      accessorFn: (row: flaggedPost) => row.reportedUser,
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        const imageUrl:any = info.getValue();
        const bgColor = color[info?.row?.index % color.length ];
        return (
          <div className="flex">
          <Avatar>
            <AvatarImage src={ imageUrl[0]?.users?.profile ? previewImgUrl+imageUrl[0]?.users?.profile : undefined}/>
            <AvatarFallback className={bgColor}>
              {formatName(imageUrl[0]?.users?.name)||"N/A"}
            </AvatarFallback>
          </Avatar>
          <p className="m-2">{imageUrl[0]?.users?.name||"N/A"}</p>
          </div>
        );
      }
    },
    {
      header: "Description",
      accessorKey: "description",
      accessorFn: (row: flaggedPost) => row?.feedData?.description,
      cell: (info) => {
        const description = info.getValue<string>();
        return <div className="text-truncate"> {description ? description : 'N/A'} </div>;
      },
      enableSorting: true,
      enableColumnFilter: true
    },
    // {
    //   header: "Description",
    //   accessorKey: "description",
    //   accessorFn: (row: flaggedPost) => row?.feedData?.description,
    //   cell: (info) => {
    //     const desc = info.getValue<string>();
    //     const index = info.row.index;
    //     const isExpanded = expandedDescription[index] || false;
    //     return <div className="w-80">
    //     {shortName(desc, isExpanded)}
    //     {desc && desc.length >= 28 && (
    //       <button className="text-cyan-500" onClick={() => toggleSectionExpanded(index)}>
    //         {isExpanded ? "Read less" : "Read more"}
    //       </button>
    //     )}
    //   </div>
    //   },
    //   enableSorting: true,
    //   enableColumnFilter: false
    // },
    {
      header: "Status",
      accessorKey: "status",
      accessorFn: (row: flaggedPost) => row?.feedData?.status,
      cell: (info) => {
        const Status:any = info.getValue();
        return (<div className={`flex m-2`}>{ titleCase(Status) || "N/A"}</div>)
      },
      enableSorting: false
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      accessorFn: (row: flaggedPost) => row?.reportedUser[0]?.createdAt,
      cell: (info) => {
        const createdAt = info.getValue<string>();
        return format(new Date(createdAt), "dd MMM, yy 'at' h:mm a");
      },
      enableColumnFilter: false
    },
    {
      header: "Marks",
      accessorKey: "mark",
      cell:(info) =>{
        return <Button className=" dark:bg-white bg-[#18181B]" onClick={() => deleteData(info.row.original)}>Mark Us UnFlagged</Button>
      },
      enableSorting: true,
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
              <DropdownMenuItem onClick={() => updateData(rowData)} className="flex items-center space-x-2" >
                
              {rowData?.feedData?.status == "active" ? 
                (<LockKeyhole className="h-4 w-4 text-muted-foreground" />) : (
                <LockKeyholeOpen className="h-4 w-4 text-muted-foreground" />
                )}
                <span>
                {rowData?.feedData?.status
                  ? rowData?.feedData?.status == "active"
                    ? "Inactive"
                    : "Active"
                  : "N/A"}
                  </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`flagged-posts/${rowData?.actionId}`)}
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
        isTableDataLoading={isAllFlaggedPostsDataLoading}
        paginatedTableData={allFlaggedPosts}
        columns={postColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        details={details}
        statusFilter={["Active", "Inactive"]}
        hideFilter={false}
        cursorPointer= {"cursor-pointer"}
      />
    </>
  );
};

export default FlaggedPostTableComponent