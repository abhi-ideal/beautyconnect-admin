"use client";
import { useGetPosts } from "@/api/useGetPosts";
import { useDebounce } from "@/hooks/useDebounce";
import { Post } from "@/types/Posts";
import { ColumnDef, ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import TanStackBasicTable from "../TanStackTable/TanStackBasicTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, SquarePlay } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "../ui/use-toast";
import PostApi from "@/api/post";
import { useRouter } from "next/navigation";
import { formatName, shortName, titleCase } from "@/lib/utils";
import Swal from "sweetalert2";
import { format } from "date-fns";
import AuthService from "@/api/auth/AuthService";
import Image from 'next/image'

const PostTableComponent = () => {
  const { logout } = AuthService();
  // sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { deletePost, updatePost } = PostApi();
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

  const { allPostsData, isAllPostsDataLoading }: any = useGetPosts({
    sorting,
    columnFilters: debouncedColumnFilters,
    pagination
  });

  const [allPosts, setAllPosts]: any = useState([]);

  useEffect(() => {
    if (allPostsData?.error) {
      404 != allPostsData?.status && toast({
        title: allPostsData?.errorMessage ? allPostsData?.errorMessage : "Uh oh! Something went wrong.",
        variant: "destructive", description: allPostsData?.error
      });
      (allPostsData?.status == 401 || allPostsData?.status == 403) && logout('posttable');
    }
    setAllPosts(allPostsData);
  }, [allPostsData]);

  async function updateData(data: any) {
    const status: any = data.status == "active" ? "inactive" : "active";

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
      confirmButtonText: `Confirm ${data.status == "active" ? "Inactive" : "Active"}`
    }).then(async (result: any) => {
      if (result.value) {
        await updatePost({ status: status, id: data.id }).then(
          async (res: any) => {
            if (!res.error) {
              const updatedPost = allPosts?.results?.map((res: any) => {
                if (data?.id == res?.id) {
                  res.status = status;
                  return res;
                } else {
                  return res;
                }
              });
              setAllPosts({ ...allPosts, results: updatedPost });
              toast({
                title: "Status update successfully.",
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
      text: `Are you sure you want to delete this post?`,
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
        await deletePost(data?.id).then((res: any) => {
          if (!res.error) {
            const deletedData = (allPosts.results = allPosts?.results?.filter(
              (res: any) => data?.id !== res?.id
            ));
            setAllPosts({ ...allPosts, results: deletedData });
            toast({
              title: "Post deleted sucessfully.",
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
  const details = (data: any, header:string) => {
    // header!='description'&& 
    // header!='Post' &&router.push(`posts/${data?.id}`)
  }
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const previewVideo = process.env.NEXT_PUBLIC_PREVIEW_VIDEO;
  const color = ["bg-orange-500", "bg-lime-500", "bg-cyan-500", "bg-blue-500", "bg-rose-500"];
  const postColumns: ColumnDef<Post>[] = [
    {
      header: "Post",
      accessorFn: (row: Post) => row.contents?.[0],
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        const imageUrl :any = info.getValue();
        return (
          <>
           {(imageUrl?.mimeType.includes("video") || imageUrl?.mimeType.includes("m3u8")) ? ( imageUrl?.poster ? <Image src={ previewVideo + imageUrl?.poster } width={50} height={50} className="w-[45px] h-[45px]"  alt="NA"/> : <SquarePlay className="h-14 w-10 text-muted-foreground"/>) : 
            <>
            <div className="border-gray-600">
              <Image src={ imageUrl?.file ? previewImgUrl + imageUrl?.file : "/default_image.png"} width={50} height={50} className="w-[45px] h-[45px]"  alt="NA"/>
            </div> 
            </>}
          </>
        );
      }
    },
    {
      header: "User",
      accessorKey: "name",
      accessorFn: (row: Post) => row.users,
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info:any) => {
        const imageUrl:any = info.getValue();
        const bgColor = color[info?.row?.index % color.length ];
        return (
          <div className="flex">
          <Avatar>
            <AvatarImage src={previewImgUrl+imageUrl.profile }/>
            <AvatarFallback className={bgColor}>
              {formatName(info.row.original?.users?.name)||"N/A"}
            </AvatarFallback>
          </Avatar>
          <p className="m-2">{info.row.original?.users?.name?.trim()||"N/A"}</p>
          </div>
        );
      }
    },
    // {
    //   header: "Title",
    //   accessorKey: "title",
    //   cell: (info) => {
    //     const title = info.getValue<string>();
    //     return <div className="text-truncate"> { title || 'N/A'} </div>;
    //   },
    // },
    // {
    //   header: "Description",
    //   accessorKey: "description",
    //   cell: (info) => {
    //     const desc = info.getValue<string>();
    //     const index = info.row.index;
    //     const isExpanded = expandedDescription[index] || false;
    //     return <div className="">
    //     {shortName(desc, isExpanded)}
    //     {desc && desc.length >= 28 && (
    //       <button className="text-cyan-500" onClick={() => toggleSectionExpanded(index)}>
    //         {isExpanded ? "Read less" : "Read more"}
    //       </button>
    //     )}
    //   </div>
    //   },
    //   enableSorting: false,
    //   enableColumnFilter: true,
    // },
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
      header: "Likes",
      accessorKey: "totalLike",
      enableSorting: true,
      enableColumnFilter: false
    },
    {
      header: "Comments",
      accessorKey: "totalComment",
      enableSorting: true,
      enableColumnFilter: false
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
      header: "Status",
      accessorKey: "status",
      accessorFn: (row: Post) => row.status,
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
                {rowData.status
                  ? rowData.status == "active"
                    ? "Inactive"
                    : "Active"
                  : "N/A"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteData(rowData)}>
                Delete
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                onClick={() => router.push(`posts/${rowData.id}`)}
              >
                Post Detail
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
        isTableDataLoading={isAllPostsDataLoading}
        paginatedTableData={allPosts}
        columns={postColumns}
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
  );
};

export default PostTableComponent;
