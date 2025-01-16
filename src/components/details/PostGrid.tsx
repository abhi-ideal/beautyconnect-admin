"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  CardDescription,
  CardHeader,
  Card,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatName, shortName, titleCase } from "@/lib/utils";
import PostApi from "@/api/post";
import { format, formatDistanceToNow } from "date-fns";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Flag, Heart, Loader2, MessageCircle, Share2 } from "lucide-react";
import { renderNestedComments } from "@/lib/handleNestedComments";
import { useToast } from "../ui/use-toast";
import { Spinner } from "../ui/spinner";
import VideoExtension from "../demo/VideoExtension";
import VideoPlayer from "../demo/VideoPlayer";
import ReactVideoPlayer from "../demo/ReactVideoPlayer";
import { Badge } from "../ui/badge";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const PostGrid = (props: any) => {
  const { postDetail, postComments, viewMoreComments } = PostApi();
  const [postInfo, setPostInfo]: any = useState(null);
  const [commentInfo, setCommentInfo]: any = useState([]);
  const [offset, setOffset] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [circleLoader, setCircleLoader]: any = useState(false);
  const [isLoader, setIsLoader]: any = useState(false);
  const [replyInfo, setReplyInfo]: any = useState([]);
  const [loadingReplies, setLoadingReplies] = useState<any>({});
  const [expandedReplies, setExpandedReplies] = useState<any>({}); 
  const { id } = props?.data;
  const { toast } = useToast();
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const previewVideoPoster = process.env.NEXT_PUBLIC_PREVIEW_VIDEO_POSTER;
  const previewVideoSource = process.env.NEXT_PUBLIC_PREVIEW_VIDEO_SOURCE;
  const previewVideo = process.env.NEXT_PUBLIC_PREVIEW_VIDEO_HOST;
  const [open, setOpen] = React.useState(false);
  const [slide, setSlide]: any = React.useState([]);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleSectionExpanded = (commentId: string | number) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  useEffect(() => {
    getPostDetails(id);
    getPostComments(id,0, "initial");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //fetch post details
  const getPostDetails = async (id: any) => {
    setCircleLoader(true);
    await postDetail(id).then((res: any) => {
      if (!res.error) {
        setPostInfo(res?.result);
        setCircleLoader(false);
      } else {
        setCircleLoader(false);
        setPostInfo(null);
      }
    });
  };

// fetch main comment 
  const getPostComments = async (id: string, offset = 0, type: string) => {
    setIsLoader(true);
    try {
      const res = await postComments(id, offset);
      if (!res.error) {
        setTotalComments(res?.counts || 0);
        if (type === "viewMore") {
          // Append new comments to the existing list
          setCommentInfo((prev: any) => [...prev, ...res?.results]);
        } else {
          // Replace comments for initial fetch
          setCommentInfo(res?.results || []);
        }
        // setOffset(offset + 5);
        setOffset(offset + res?.results?.length); 
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoader(false);
    }
  };
  


//fetch replies function
  const fetchRepliesForComment = async (commentId: string, replyOffset = 0) => {
    setLoadingReplies((prev: any) => ({ ...prev, [commentId]: true }));
    const res = await viewMoreComments({id: id?.[0],commentId, replyOffset});
    if (!res.error) {
      const newReplies = res?.results?.parentComment || [];
      setReplyInfo((prev: any) => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), ...newReplies],
      }));
      setExpandedReplies((prev: any) => ({ ...prev, [commentId]: true })); // Automatically expand replies
    }
    setLoadingReplies((prev: any) => ({ ...prev, [commentId]: false }));
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev: any) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };


//render nested replies
  const renderReplies = (replies: any[], parentId: string) => (
    <div className="ml-8 mt-2">
      {replies.map((reply: any) => (
        <div key={reply.id} className="space-y-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={reply?.users?.profile?.startsWith("https://") ? reply?.users?.profile?.trim() :  previewImgUrl+ reply?.users?.profile?.trim()} />
              <AvatarFallback className="bg-[#FFC1BB]" >
              {formatName(reply?.users?.name) || "NA"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-muted rounded-lg p-3">
                <p className="font-semibold">{reply?.users?.name?.trim() || "N/A"}</p>
                <p className="text-sm">{reply?.comment}</p>
              </div>
              <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
              <span>
                {reply?.totalLikes ? reply?.totalLikes : 0}{" "}
                {reply?.totalLikes > 1 ? "likes" : "like"}
                  </span>
                <span>
                  {reply?.createdAt
                    ? `${formatDistanceToNow(new Date(reply.createdAt))} ago`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Handle Nested Replies */}
          {reply.totalCount > 0 && !expandedReplies[reply.id] && (
            <div className="flex justify-end">
              <Button
                variant="link"
                onClick={() => fetchRepliesForComment(reply.id, 0)}
                disabled={loadingReplies[reply.id]}
              >
                {loadingReplies[reply.id]
                  ? "Loading..."
                  : `View ${reply.totalCount} More Replies`}
              </Button>
            </div>
          )}

          {/* Show/Hide Replies Button */}
          {replyInfo[reply.id] && expandedReplies[reply.id] && (
            <div className="flex justify-end">
              <Button
                variant="link"
                onClick={() => toggleReplies(reply.id)}
                disabled={loadingReplies[reply.id]}
              >
                {expandedReplies[reply.id] ? "Hide Replies" : "Show Replies"}
              </Button>
            </div>
          )}

          {/* Render Nested Replies */}
          {replyInfo[reply.id] &&
            expandedReplies[reply.id] &&
            renderReplies(replyInfo[reply.id], reply.id)}
        </div>
      ))}
    </div>
  );

  const playerRef = useRef(null);
  const playPauseVideo = () => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.8,
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

  if (circleLoader) {
    return (
      <div className="flex justify-center items-center p-20 h-[calc(100vh_-_182px)]">
        <Loader2 className="my-28 dark:text-white h-[100px] w-[100px] text-primary animate-spin" />
      </div>
    );
  }

  if (!postInfo) {
    return (
      <div className="flex flex-col justify-center items-center p-20 h-[calc(100vh_-_182px)]">
        <Image
          src="/no-data.svg"
          alt="Logo"
          width={320}
          height={320}
          priority
          className="size-[150px]"
        />
        <span className="font-semibold text-lg">No Record Found</span>
      </div>
    );
  }

  return (
    <>
      <div className="p-4"></div>

      <div className="grid md:grid-cols-[1fr_400px] gap-4 mx-auto">
        <Card className="bg-white dark:bg-black">
          <CardHeader className="flex flex-row items-center gap-4 p-4">
            <Avatar className="h-14 w-14 border border-gray-700">
              <AvatarImage
                src={ postInfo?.users?.profile?.startsWith("https://") ? postInfo?.users?.profile?.trim()  : previewImgUrl+postInfo?.users?.profile?.trim()}
                alt={postInfo?.users?.name || "User avatar"}
              />
              <AvatarFallback className="bg-[#FFC1BB]" >
                {formatName(postInfo?.users?.name || "Default Image")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                <Link href={`/users/${postInfo?.userId}`}>
                  {titleCase(postInfo?.users?.name)}
                </Link>
              </h2>
              <p className="text-muted-foreground">
                {" "}
                {postInfo?.users?.createdAt
                  ? format(
                      new Date(postInfo?.users?.createdAt),
                      "dd MMM, yy 'at' h:mm a"
                    )
                  : "N/A"}
              </p>
              <div className="text-sm text-gray-500 pt-2">
                {postInfo?.users?.status ? (
                      <Badge
                        className={
                          postInfo?.users?.status?.toLowerCase() === "active"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {titleCase(postInfo?.users?.status)}
                      </Badge>
                    ) : (
                      "N/A"
                    )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <p className="text-muted-foreground text-lg">
              {postInfo?.description ? postInfo?.description : "N/A"}
            </p>
            <div className="relative aspect-video">
              <Carousel className="relative w-full">
                <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                  <CarouselContent>
                    {postInfo?.contents?.length > 0 ? (
                             postInfo.contents.map((data: any, i: any) => {
                              return (
                              <CarouselItem key={i} className="aspect-video">
                                { data?.mimeType?.includes("image") ?
                                  <Image className="aspect-video max-h-[472px] max-w-full object-contain rounded-md size-full" src={previewImgUrl + data?.file?.trim() || "/default_image.png"} alt="Post Image" width={448} height={252} />
                                  : <div className="[&_video]:m-auto [&_video]:aspect-video h-full [&>div]:size-full [&>div>div]:flex [&>div>div]:size-full [&_video]:max-h-[472px] [&_video]:!w-auto [&_video]:max-w-full" > 
                                  <ReactVideoPlayer url={(data?.file.endsWith('.m3u8') ? previewVideo : previewVideoSource) + (data?.file ? data?.file?.trim() : data?.url?.trim())} controls={true} width="" height="" /> </div> 
                                  }
                              </CarouselItem>
                            )})
                          
                    ) : (
                      <CarouselItem className="aspect-video">
                        <Image
                          src="/default_image.png"
                          width={448}
                          height={252}
                          alt="Default Cover Image"
                          className="object-contain rounded-md size-full"
                        />
                      </CarouselItem>
                    )}
                  </CarouselContent>
                  <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white dark:bg-black dark:bg-opacity-75  rounded-full p-2 shadow-md" />
                  <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white dark:bg-black dark:bg-opacity-75  rounded-full p-2 shadow-md" />
                </div>
              </Carousel>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>
                  {postInfo?.totalLike ? postInfo?.totalLike : 0}{" "}
                  {postInfo?.totalLike > 1 ? "likes" : "like"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>
                  {" "}
                  {postInfo?.totalComment ? postInfo?.totalComment : 0}{" "}
                  {postInfo?.totalComment > 1 ? "comments" : "comment"}
                </span>
              </div>
              {/* <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                <span>
                  {" "}
                  {postInfo?.totalShare ? postInfo?.totalShare : 0}{" "}
                  {postInfo?.totalShare > 1 ? "Shares" : "Share"}
                </span>
              </div> */}
            </div>
            <div className="flex items-center gap-2">
              {/* <Flag className="h-5 w-5" /> */}
              <span>
                {postInfo?.status ? (
                  <Badge
                    className={
                      postInfo.status.toLowerCase() === "active"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {titleCase(postInfo.status)}
                  </Badge>
                ) : (
                  "N/A"
                )}
              </span>
              <span>
                {postInfo?.createdAt
                  ? format(
                      new Date(postInfo?.createdAt),
                      "dd MMM, yy 'at' h:mm a"
                    )
                  : "N/A"}
              </span>
            </div>
          </CardFooter>
        </Card>

        <Card className="bg-white dark:bg-black">
      <CardHeader className="border-b p-4">
        <h3 className="font-semibold">
        {totalComments > 1 ? "Comments" : "Comment"}{" "}{totalComments ? `(${totalComments})` : ""}
        </h3>
      </CardHeader>
      <CardContent className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh_-_200px)]">
        {commentInfo.length === 0 ? (
          <div className="flex flex-col justify-center items-center p-20">
            <Image
              src="/no-data.svg"
              alt="No Comments"
              width={320}
              height={320}
            />
            <span className="font-semibold text-lg">No Record Found</span>
          </div>
        ) : (
          commentInfo.map((comment: any) => (
            <div key={comment.id} className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={ comment?.users?.profile?.startsWith("https://") ? comment?.users?.profile?.trim() : previewImgUrl+ comment?.users?.profile?.trim()} />
                  <AvatarFallback className="bg-[#FFC1BB]" >
                    {formatName(comment?.users?.name) || "NA"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="font-semibold">
                      {comment?.users?.name?.trim() || "N/A"}
                    </p>
                    <p className="text-sm">{comment?.comment}</p>
                  </div>
                  <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                  <span>
                {comment?.totalLikes ? comment?.totalLikes : 0}{" "}
                {comment?.totalLikes > 1 ? "likes" : "like"}
                  </span>

                    <span>
                      {comment?.createdAt
                        ? `${formatDistanceToNow(
                            new Date(comment.createdAt)
                          )} ago`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Handle Nested Replies */}
              {comment.totalCount > 0 && !expandedReplies[comment.id] && (
                <div className="flex justify-end">
                  <Button
                    variant="link"
                    onClick={() => fetchRepliesForComment(comment.id, 0)}
                    disabled={loadingReplies[comment.id]}
                  >
                    {loadingReplies[comment.id]
                      ? "Loading..."
                      : `View ${comment.totalCount} More Replies`}
                  </Button>
                </div>
              )}

              {/* Show/Hide Replies Button */}
              {replyInfo[comment.id] && expandedReplies[comment.id] && (
                <div className="flex justify-end">
                  <Button
                    variant="link"
                    onClick={() => toggleReplies(comment.id)}
                  >
                    {expandedReplies[comment.id] ? "Hide Replies" : "Show Replies"}
                  </Button>
                </div>
              )}

              {/* Render Replies */}
              {replyInfo[comment.id] &&
                expandedReplies[comment.id] &&
                renderReplies(replyInfo[comment.id], comment.id)}
            </div>
          ))
        )}

  {/* View More Comments Button */}
  {commentInfo.length < totalComments && (
      <span className="flex justify-end">
        <Button
          className="gap-1 w-auto mt-4"
          disabled={isLoader}
          variant="link"
          onClick={() => getPostComments(id, offset, "viewMore")}
        >
          <b>
            View {Math.min(5, totalComments - commentInfo.length)} More Comment
            {totalComments - commentInfo.length > 1 ? "s" : ""}
          </b>
          {isLoader && <Spinner size="small" />}
        </Button>
      </span>
    )}

            
      </CardContent>
    </Card>
      </div>
      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={slideIndex}
        slides={slide}
      />
    </>
  );
};

export default PostGrid;
