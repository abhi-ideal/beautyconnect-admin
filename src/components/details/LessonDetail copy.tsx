"use client";
import React, { useEffect, useState } from "react";
import { formatName, titleCase } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import { Heart, Loader2, MessageCircle } from "lucide-react";
import LessonApi from "@/api/lessonApi";
import { CardHeader, Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import ReactVideoPlayer from "../demo/ReactVideoPlayer";
import Image from "next/image";
import PdfViewer from "../demo/PdfViewer";

const LessonDetail = ({ lessonId }: any) => {
  const { toast } = useToast();
  const { lessonsDetail } = LessonApi();
  const [lessonInfo, setLessonInfo]: any = useState({});
  const [loading, setLoading]: any = useState(false);
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const previewVideoSource = process.env.NEXT_PUBLIC_PREVIEW_VIDEO_SOURCE;
  const previewVideo = process.env.NEXT_PUBLIC_PREVIEW_VIDEO_HOST;

  useEffect(() => {
    getlessonDetails(lessonId);
  }, [lessonId]);

  const getlessonDetails = async (id: any) => {
    setLoading(true);
    await lessonsDetail(id).then((res: any) => {
      if (!res.error) {
        setLessonInfo(res?.results);
        setLoading(false);
      } else {
        setLessonInfo({});
        setLoading(false);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-20 h-[calc(100vh_-_182px)]">
        <Loader2 className="my-28 h-[80px] dark:text-white w-[80px] text-primary animate-spin" />
      </div>
    );
  }

  return (
    <>
    <Card className="bg-white dark:bg-black mx-auto">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={ lessonInfo?.image ? previewImgUrl + lessonInfo?.image?.imageUrl?.trim() : "/default_image.png"}
            alt="Lesson Image"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-grow">
          <h2 className="text-2xl font-semibold mb-2">{lessonInfo.title ? titleCase(lessonInfo.title?.trim()) : "N/A"}</h2>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted-foreground">
              {lessonInfo.createdAt ? format(new Date(lessonInfo?.createdAt), "dd MMM, yy 'at' h:mm a") : "N/A"}
            </p>
            {lessonInfo?.status && (
              <Badge
                className={
                  lessonInfo.status.toLowerCase() === "active" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }
              >
                {titleCase(lessonInfo.status)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <Carousel className="w-full">
          <CarouselContent>
            {lessonInfo?.lessonContentInfo?.length > 0 ? (
              lessonInfo.lessonContentInfo.map((data: any, i: number) => (
                <CarouselItem key={i} className="flex justify-center items-center">
                  {data?.mimeType?.includes("image") ? (
                    <Image
                      className="max-h-[472px] w-auto object-contain rounded-md"
                      src={ data?.file ? previewImgUrl + data?.file?.trim() : "/default_image.png"}
                      alt="Lesson Content"
                      width={800}
                      height={472}
                    />
                  ) : data?.mimeType?.includes("application") ? (
                    <div className="w-full h-[472px] overflow-y-auto [scrollbar-width:thin]">
                      <PdfViewer pdfFileUrl={previewImgUrl + data?.file?.trim()} />
                    </div>
                  ) : (
                    <div className="w-full max-w-[800px] aspect-video [&>div>div]:!size-full">
                      <ReactVideoPlayer
                        url={
                          (data?.file.endsWith(".m3u8") ? previewVideo : previewVideoSource) +
                          (data?.file ? data?.file?.trim() : data?.url?.trim())
                        }
                        controls={true}
                      />
                    </div>
                  )}
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="flex justify-center items-center" >
                <Image
                  src="/default_image.png"
                  width={800}
                  height={472}
                  alt="Default Cover Image"
                  className="max-h-[472px] object-contain rounded-md"
                />
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 " />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 mr-3" />
        </Carousel>
      </CardContent>
    </Card>
    </>
  );
};

export default LessonDetail;
