import React, { useEffect, useRef, useState } from 'react'
import { CardHeader, Card, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import VideoPlayer from '../demo/VideoPlayer';
import VideoExtension from '../demo/VideoExtension';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatName, shortName, titleCase } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ReportApi from '@/api/report';
import Link from "next/link";
import { format } from "date-fns";
import { CircleX, Loader2, LockKeyhole, LockKeyholeOpen, MessageCircle, MoreHorizontal, ThumbsUp, Trash2 } from 'lucide-react';
import ReactVideoPlayer from '../demo/ReactVideoPlayer';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../ui/dropdown-menu";
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const FlaggedPostDetail = (props: any) => {
    const { toast } = useToast();
    const router = useRouter();
    const [postInfo, setPostInfo]: any = useState(null);
    const { id }: any = props?.data;
    const { flaggedPostDetail, flaggedReasonList, deleteFlaggedPost } = ReportApi();
    const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
    const previewVideo = process.env.NEXT_PUBLIC_PREVIEW_VIDEO_HOST;
    const previewVideoSource = process.env.NEXT_PUBLIC_PREVIEW_VIDEO_SOURCE;
    const [reason, setReason]: any = useState({});
    const [loading, setLoading]: any = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        title: false,
        description: false,
      });
    
      const toggleSectionExpanded = (section: string) => {
        setExpandedSections((prevState: any) => ({
          ...prevState,
          [section]: !prevState[section],
        }));
      };



    useEffect(() => {
        getPostReportDetaits(id);
        getReportReasonData();

    }, [id]);

    const gcd: any = (a: any, b: any) => {
        return b == 0 ? a : gcd(b, a % b);
    };

    const getReportReasonData = async () => {
        await flaggedReasonList("feedsReportReason").then((res: any) => {
          if (!res?.error) {
            setReason(res);
          } else {
            setReason([]);
          }
        });
      };
    const getPostReportDetaits = async (id: any) => {
        setLoading(true);
        await flaggedPostDetail(id).then((res: any) => {
            if (!res.error) {
                setPostInfo(res?.results);
                setLoading(false);
            } else {
                setPostInfo(null);
                setLoading(false);
                toast({
                    title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
                    variant: "destructive", description: res?.error
                });
            }
        })
    }

    const playerRef = useRef(null);
    const playPauseVideo = () => {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.8
        };
        const callback = (entries: any[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.play();
                } else {
                    entry.target.pause();
                }
            });
        };
        const observer = new IntersectionObserver(callback, options);
        const videos = document.querySelectorAll("video");
        videos.forEach((vide) => {
            observer.observe(vide);
        });
    };
    const handlePlayerReady = (player: any) => {
        playerRef.current = player;
        playPauseVideo();
    };


  async function cancelReport(data: any) {
    Swal.fire({
      // title: "Delete",
      text: `Are you sure you want to UnFlagged this record ?`,
      showCancelButton: true,
      confirmButtonColor: `#18181B`,
      cancelButtonColor: "white",
      confirmButtonText: "Confirm",
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
    }).then(async (result: any) => {
      if (result.value) {
        await deleteFlaggedPost(data?.actionId).then((res: any) => {
          if (!res.error) {
            toast({
                title: "Report cancelled sucessfully.",
                description: res?.message,
              });
              router.push("/flagged-posts");
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






    if (loading) {
        return (
          <div className="flex justify-center items-center p-20 h-[calc(100vh_-_182px)]">
            <Loader2 className="my-28 h-[80px] dark:text-white w-[80px] text-primary animate-spin" />
          </div>
        );
    }


    return (
        <>
        
        <div className="py-6">
          <div className="flex flex-col gap-8">
            {/* Post Details */}
            <Card>
              <CardContent className="p-6">
                {/* Author */}
                <div className="flex items-center gap-4 mb-4">
                  <Link href={ postInfo?.feedData?.users?.id ? `/users/${postInfo?.feedData?.users?.id}` : "#"}>
                    <Avatar className="border border-border">
                      <AvatarImage
                        src={
                            postInfo?.feedData?.users?.profile?.startsWith("https://")
                            ? postInfo?.feedData?.users?.profile
                            : previewImgUrl + postInfo?.feedData?.users?.profile?.trim()
                        }
                        alt={postInfo?.feedData?.users?.name || "User Image"}
                      />
                      <AvatarFallback className="bg-[#FFC1BB]" >
                        {postInfo?.feedData?.users?.name
                          ? formatName(postInfo?.feedData?.users?.name)
                          : "DI"}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link href={postInfo?.feedData?.users?.id ? `/users/${postInfo?.feedData?.users?.id}` : "#"}>
                      <h2 className="text-lg font-semibold">
                        {postInfo?.feedData?.users?.name
                          ? titleCase(postInfo?.feedData?.users?.name?.trim())
                          : "N/A"}
                      </h2>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {postInfo?.feedData?.users?.email ? postInfo?.feedData?.users?.email?.trim() : "N/A"}
                    </p>
                  </div>
  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {/* <DropdownMenuItem
                        onClick={() => updateStatus(postInfo)}
                        className="flex items-center space-x-2"
                      >
                        {postInfo.status == "active" ? (
                          <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <LockKeyholeOpen className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>
                          {postInfo.status
                            ? postInfo.status == "active"
                              ? "Inactive"
                              : "Active"
                            : "N/A"}
                        </span>
                      </DropdownMenuItem> */}
                      <DropdownMenuItem
                        onClick={() => cancelReport(postInfo)}
                        className="flex items-center space-x-2"
                      >
                        <CircleX className="h-4 w-4 text-muted-foreground" />
                        <span>Cancel Report</span>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem
                        onClick={() => deleteData(postInfo)}
                        className="flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                        <span>Delete</span>
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
  
                {/* Description */}
                <p className="mb-6 text-muted-foreground">
                  {shortName(
                    postInfo?.feedData?.description ? postInfo?.feedData?.description : "N/A",
                    expandedSections.description
                  )}
                  {postInfo?.feedData?.description &&
                    postInfo?.feedData?.description.length >= 28 && (
                      <button
                        className="text-[#03a9f4]"
                        onClick={() => toggleSectionExpanded("description")}
                      >
                        {expandedSections.description ? "Read less" : "Read more"}
                      </button>
                    )}
                </p>
  
                {/* Carousel */}
                <div className="relative mb-6 max-w-4xl mx-auto">
                  <Carousel className="select-none relative w-full">
                    <div className="relative border border-input rounded-lg overflow-hidden">
                      <CarouselContent>
                        {postInfo?.feedData?.contents?.length > 0 ? (
                                        postInfo?.feedData?.contents?.map((album: any, i: number) => {
                                            return (
                                                <CarouselItem key={i} className="h-64" >
                                                    {album?.mimeType?.includes("image") ?
                                                        <Image className="aspect-video max-h-[472px] max-w-full object-contain rounded-md size-full" src={previewImgUrl + album.file?.trim() || "/default_image.png"} alt={album.name || "Post Image"} width={250} height={330}/>
                                                        : <div className="[&_video]:m-auto [&_video]:aspect-video h-full [&>div]:size-full [&>div>div]:flex [&>div>div]:size-full [&_video]:max-h-[472px] [&_video]:!w-auto [&_video]:max-w-full" > <ReactVideoPlayer url={(album?.file.endsWith('.m3u8') ? previewVideo : previewVideoSource) + (album?.file ? album?.file?.trim() : album?.url?.trim())} controls={true} width="" height="" /> </div>
                                                        }
                                                </CarouselItem>
                                            )
                                        })
                        ) : (
                          <CarouselItem className="h-64">
                            <Link href={postInfo?.id ? `/post/${postInfo?.id}`: "#"}>
                              <Image
                                src="/default_image.png"
                                width={720}
                                height={256}
                                alt="Default Cover Image"
                                className="object-contain rounded-md w-full h-full bg-[#8080802e]"
                              />
                            </Link>
                          </CarouselItem>
                        )}
                      </CarouselContent>
                    </div>
                    <CarouselPrevious className="absolute top-1/2 -left-12 transform -translate-y-1/2 bg-white dark:bg-black dark:bg-opacity-75 bg-opacity-75 rounded-full p-2 shadow-md" />
                    <CarouselNext className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-white dark:bg-black dark:bg-opacity-75 bg-opacity-75 rounded-full p-2 shadow-md" />
                  </Carousel>
                </div>
                
                {/* Post Status */}
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-5 h-5" />
                      <span>
                  {postInfo?.feedData?.totalLike ? postInfo?.feedData?.totalLike : 0}{" "}
                  {postInfo?.feedData?.totalLike > 1 ? "likes" : "like"}
                </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-5 h-5" />
                      <span>
                  {" "}
                  {postInfo?.feedData?.totalComment ? postInfo?.feedData?.totalComment : 0}{" "}
                  {postInfo?.feedData?.totalComment > 1 ? "comments" : "comment"}
                </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-2 ms-auto">
                    {postInfo?.feedData?.status ? (
                      <Badge
                        className={
                            postInfo?.feedData?.status.toLowerCase() === "active"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {titleCase(postInfo?.feedData?.status)}
                      </Badge>
                    ) : (
                      "N/A"
                    )}
                    <span className="text-sm text-muted-foreground">
                      {postInfo?.feedData?.createdAt
                        ? format(
                            new Date(postInfo?.feedData?.createdAt),
                            "dd MMM, yy 'at' h:mm a"
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            {/* Reported Users List */}
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-4">Reported By:</h3>
              <Card>
                <CardContent className="p-0">
                  {postInfo?.reportedUser?.length === 0 ? (
                    <div className="flex flex-col p-6 h-full justify-center items-center">
                      <Image
                        src="/no-data.svg"
                        alt="No data"
                        width={150}
                        height={150}
                        priority
                        className="size-[150px]"
                      />
                       <span className="font-semibold text-lg">No Record Found</span>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px] rounded-md">
                      <Table>
                        <TableHeader className="sticky top-0 z-[1]">
                          <TableRow>
                            <TableHead>S.N.</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Reported On</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {postInfo?.reportedUser?.map((report: any, i: any) => (
                            <TableRow key={i}>
                              <TableCell>{i + 1}</TableCell>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="border border-border">
                                    <AvatarImage
                                      src={
                                        report?.users?.profile?.startsWith(
                                          "https://"
                                        )
                                          ? report?.users?.profile
                                          : previewImgUrl + report?.users?.profile?.trim()
                                      }
                                    />
                                    <AvatarFallback className="bg-[#FFC1BB]" >
                                      {formatName(report?.users?.name) ||
                                        "DI"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <Link
                                    href={
                                        report?.users?.id
                                        ? `/users/${report?.users?.id}`
                                        : "#"
                                    }
                                    className="hover:underline"
                                  >
                                    {report?.users?.name
                                    ? titleCase(report.users.name?.trim())
                                    : "N/A"}
                                  </Link>
                                </div>
                              </TableCell>
                              <TableCell>
                                {/* {reportReasons[report?.reasonId]} */}
                                {report?.reasonId && report?.reasonId > 0
                                  ? reason?.map(
                                      (reason: any, i: any) => {
                                        if (reason?.id == report?.reasonId) {
                                          return (
                                            <p key={i}>{reason?.title}</p>
                                          );
                                        }
                                      }
                                    )
                                  : "N/A"}
                              </TableCell>
                              <TableCell>
                                {format(
                                  new Date(report?.createdAt),
                                  "dd MMM, yy 'at' h:mm a"
                                )}
                              </TableCell>
                              <TableCell>
                                {report?.users?.status ? (
                                  <Badge
                                    className={
                                      report?.users?.status?.toLowerCase() ===
                                      "active"
                                        ? "bg-green-500 text-white"
                                        : "bg-red-500 text-white"
                                    }
                                  >
                                    {titleCase(report?.users?.status)}
                                  </Badge>
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    )
}

export default FlaggedPostDetail