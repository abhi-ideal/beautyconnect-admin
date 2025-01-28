"use client"
import React, { useEffect, useRef, useState } from 'react'
import { CardHeader, Card, CardTitle, CardContent } from '@/components/ui/card';
import { formatName, titleCase } from '@/lib/utils';
import { format } from "date-fns";
import { Loader2 } from 'lucide-react';
import ChapterApi from '@/api/chapterApi';
import PdfViewer from '../demo/PdfViewer';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

import Image from "next/image";
import { Badge } from '../ui/badge';
import ReactVideoPlayer from '../demo/ReactVideoPlayer';

const ChapterDetail = ({ chapterId, lessonId }: any) => {
    const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
    const previewVideoSource = process.env.NEXT_PUBLIC_PREVIEW_VIDEO_SOURCE;
    const previewVideo = process.env.NEXT_PUBLIC_PREVIEW_VIDEO_HOST;
      const [chapterInfo, setChapterInfo]: any = useState(null);
    
    const { chapterDetail } = ChapterApi()
    const [loading, setLoading]: any = useState(false);

    useEffect(() => {
        getChapterDetails();
    }, [chapterId]);



    const getChapterDetails = async () => {
        setLoading(true);
        await chapterDetail(chapterId).then((res: any) => {
            if (!res.error) {
                setChapterInfo(res?.result)
                setLoading(false);
            } else {
                setChapterInfo(null);
                setLoading(false);
            }
        })
    }


  if (loading) {
    return (
      <div className="flex justify-center items-center p-20 h-[calc(100vh_-_182px)]">
        <Loader2 className="my-28 h-[100px] dark:text-white w-[100px] text-primary animate-spin" />
      </div>
    );
  }

    return (
        <>
        <Card className="bg-white dark:bg-black mx-auto mt-2">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
            {/* <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={ chapterInfo?.image ? previewImgUrl + chapterInfo?.image?.imageUrl?.trim() : "/default_image.png"}
                alt="Lesson Content Image"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div> */}
            <div className="flex-grow">
              <h2 className="text-xl font-semibold mb-2">{chapterInfo?.title ? titleCase(chapterInfo.title?.trim()) : "N/A"}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  {chapterInfo?.createdAt ? format(new Date(chapterInfo?.createdAt), "dd MMM, yy 'at' h:mm a") : "N/A"}
                </p>
                {chapterInfo?.status && (
                  <Badge
                    className={
                      chapterInfo.status.toLowerCase() === "active" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }
                  >
                    {titleCase(chapterInfo.status)}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <Carousel className="w-full">
              <CarouselContent>
                {chapterInfo ? (
                    <CarouselItem className="flex justify-center items-center">
                      {chapterInfo?.mimeType?.includes("image") ? (
                        <Image
                          className="max-h-[472px] w-auto object-contain rounded-md"
                          src={ chapterInfo?.file ? previewImgUrl + chapterInfo?.file?.trim() : "/default_image.png"}
                          alt="Lesson Content"
                          width={800}
                          height={472}
                        />
                      ) : chapterInfo?.mimeType?.includes("application") ? (
                        <div className="w-full h-[472px] overflow-y-auto [scrollbar-width:thin]">
                          <PdfViewer pdfFileUrl={previewImgUrl + chapterInfo?.file?.trim()} />
                        </div>
                      ) : (
                        <div className="w-full max-w-[800px] aspect-video [&>div>div]:!size-full">
                          <ReactVideoPlayer
                            url={
                              (chapterInfo?.file.endsWith(".m3u8") ? previewVideo : previewVideoSource) +
                              (chapterInfo?.file ? chapterInfo?.file?.trim() : chapterInfo?.url?.trim())
                            }
                            controls={true}
                          />
                        </div>
                      )}
                    </CarouselItem>
                  )
                 : (
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
              {/* <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 " /> */}
              {/* <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 mr-3" /> */}
            </Carousel>
          </CardContent>
        </Card>
        </>
      );
}

export default ChapterDetail