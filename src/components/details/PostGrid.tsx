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
  const { id } = props?.data;
  const { toast } = useToast();
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const previewVideo = process.env.NEXT_PUBLIC_PREVIEW_VIDEO;
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
    getPostComments(id,0, "rendom");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
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

  const getPostComments = async (id: string, offset = 0, type:any) => {
    setIsLoader(true);
    const res = await postComments(id, offset);
    if (!res.error) {
      setTotalComments(res?.counts);
      type == 'viewMore'?  setCommentInfo((prev: any) => [...prev, ...res?.results]) : setCommentInfo(res?.results)
     
      setOffset(offset + 5);
      // setTotalComments(res.count);
    }
    setIsLoader(false);
  };


  const [replyInfo, setReplyInfo]: any = useState(null);
  const moreReply = async (parentId: any, offset = 0) => {
    setIsLoader(true);
    const res = await viewMoreComments({ id, parentId, offset });
    if (!res.error) {
      const newReplies= res?.results || {};
      setReplyInfo(newReplies)

  
      // setCommentInfo((prevComments:any) => {
      //   const updateComments = (comments: any) => {
      //     return comments.map((comment: any) => {
      //       if (comment.id === parentId) {
      //         return {
      //           ...comment,
      //           children: [...(comment?.children || []), ...newComments],
      //           offset: (comment.offset || 0) + 5,
      //         };
      //       }
      //       return comment;
      //     });
      //   };
      //   return updateComments(prevComments);
      // });

      // setReplyComment(commentInfo, newReplies, parentId, "");

    }
    setIsLoader(false);
  };

  const setReplyComment = (
    array: any,
    replyObj: any,
    parentId: number,
    type: string
  ) => {
    if (parentId) {
      array?.map(async (item: any, i: number) => {
        if (parentId == item?.id) {
          item.offset =
            replyObj?.length < 5
              ? item.offset + replyObj?.length
              : item?.offset;
          item.children = item.children ? item.children : [];
          item.children =
            type == "post"
              ? [replyObj, ...item.children]
              : item.children.concat(replyObj);
          type != "post" ? (item.loadMore = false) : "";
          item.totalComment =
            item.totalComment > item.children.length
              ? type === "post"
                ? item.totalComment + 1
                : item.totalComment
              : item.children.length;

          return await setCommentInfo([...commentInfo]);
        }
        item?.children
          ? setReplyComment(item.children, replyObj, parentId, type)
          : "";
      });
    } else {
      const updatedCommentRecord: any = commentInfo?.length
        ? [replyObj, ...commentInfo]
        : [replyObj];
      setCommentInfo(updatedCommentRecord);
      props.feeds.totalComment += 1;
      props.setEventResponse(props.feeds.totalComment, props.index);
    }
  };


  // hide replies 
  const hideReplies = (parentId: string) => {
    setReplyInfo(null)
    // setReplyInfo((prevComments: any) => {
    //   const updateComments = (comments: any) =>
    //     comments.parentComment.map((reply: any) => {
    //       if (reply.id === parentId) {
    //         return { ...reply, parentComment: [] };
    //       }
    //       return reply;
    //     });
    //   return updateComments(prevComments);
    // });
  };

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

      <div className="grid md:grid-cols-[1fr_400px] gap-4 p-4  mx-auto">
        <Card className="bg-white dark:bg-black">
          <CardHeader className="flex flex-row items-center gap-4 p-4">
            <Avatar className="h-14 w-14 border border-gray-700">
              <AvatarImage
                src={postInfo?.users?.image}
                alt={postInfo?.users?.name || "User avatar"}
              />
              <AvatarFallback>
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
                      postInfo.contents.map((data: any, i: any) => (
                        <CarouselItem
                          key={i}
                          className="aspect-video"
                          onClick={() => {
                            setOpen(true);
                            setSlideIndex(i);
                            setSlide(
                              postInfo?.contents.map((item: any) => ({
                                src:
                                  item?.file && item?.file?.trim() !== ""
                                    ? `${previewImgUrl}${item?.file}`
                                    : "/default_image.png",
                              }))
                            );
                          }}
                        >
                          <Image
                            src={
                              data?.file && data.file.trim() !== ""
                                ? previewImgUrl + data.file
                                : "/default_image.png"
                            }
                            width={448}
                            height={252}
                            alt="Post Image"
                            className="object-contain rounded-md size-full"
                          />
                        </CarouselItem>
                      ))
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
                  <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white dark:bg-black dark:bg-opacity-75 bg-opacity-75 rounded-full p-2 shadow-md" />
                  <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white dark:bg-black dark:bg-opacity-75 bg-opacity-75 rounded-full p-2 shadow-md" />
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
              Comments {commentInfo.length ? `(${totalComments})` : ""}
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
              commentInfo.map((comment: any, index: number) => (
                <div key={index} className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment?.users?.profile} />
                      <AvatarFallback>
                        {formatName(comment?.users?.name) || "NA"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-3">
                        <p className="font-semibold">{comment?.users?.name}</p>
                        <p
                          className="text-sm break-words whitespace-pre-wrap"
                          style={{ wordBreak: "break-word" }}
                        >
                          {shortName(
                            comment?.comment ? comment?.comment : " ",
                            expandedSections[comment.id]
                          )}
                          {comment?.comment &&
                            comment?.comment.length >= 28 && (
                              <button
                                className="text-cyan-500 ml-2"
                                onClick={() =>
                                  toggleSectionExpanded(comment.id)
                                }
                              >
                                {expandedSections[comment.id]
                                  ? "Read less"
                                  : "Read more"}
                              </button>
                            )}
                        </p>
                      </div>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{comment?.commentLikes || 0} likes</span>
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
                  {comment.totalCount > 0 && replyInfo && (
                    <div className="mt-2 ml-8">
                      <Button
                        className="mt-2"
                        variant="link"
                        onClick={() => hideReplies(comment.id)}
                      >
                        Hide Replies
                      </Button>
                      {renderNestedComments(
                        replyInfo,
                        moreReply,
                        isLoader,
                        hideReplies
                      )}
                    </div>
                  )}
                  {(comment.totalCount > 0) && (comment.totalCount !== replyInfo?.parentComment?.length) && (
                    <span className="flex justify-end">
                      <Button
                        className="mt-2"
                        variant="link"
                        onClick={() =>
                          moreReply(comment.id, 0)
                        }
                      >
                        View{" "}
                        {comment.totalCount  - (replyInfo?.parentComment?.length || 0)}{" "}
                        More Replies
                      </Button>
                    </span>
                  )}
                </div>
              ))
            )}
            {commentInfo.length < totalComments && (
              <span className="flex justify-end">
                <Button
                  className="gap-1 w-auto mt-4"
                  disabled={isLoader}
                  variant="link"
                  onClick={() => getPostComments(id, offset, "viewMore")}
                >
                  <b>View {totalComments - (commentInfo?.length || 0)} More Comments</b>
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
