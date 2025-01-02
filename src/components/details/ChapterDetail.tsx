"use client"
import React, { useEffect, useRef, useState } from 'react'
import { CardHeader, Card, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatName, titleCase } from '@/lib/utils';
import { useToast } from "../ui/use-toast";
import { format } from "date-fns";
import { Loader2 } from 'lucide-react';
import ChapterApi from '@/api/chapterApi';
import PdfViewer from '../demo/PdfViewer';
import VideoExtension from '../demo/VideoExtension';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import VideoPlayer from '../demo/VideoPlayer';
import { Button } from '../ui/button';
import Image from "next/image";

const ChapterDetail = ({ chapterId, lessonId }: any) => {
    const { toast } = useToast();
    const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
    const previewVideo = process.env.NEXT_PUBLIC_PREVIEW_VIDEO;
    const previewVideoSource = process.env.NEXT_PUBLIC_PREVIEW_VIDEO_SOURCE;
    const { chaptersDetail } = ChapterApi()
    const [chapter, setChapter]: any = useState({});
    const [loading, setLoading]: any = useState(false);
    const [showPDF, setShowPDF]: any = useState(false);

    useEffect(() => {
        getlessonDetaits(lessonId);
    }, [lessonId]);


    const getlessonDetaits = async (id: any) => {
        setLoading(true);
        await chaptersDetail(lessonId, chapterId).then((res: any) => {
            if (!res.error) {
                setChapter(res?.result)
                setLoading(false);
            } else {
                setChapter({})
                setLoading(false);
                toast({
                    title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
                    variant: "destructive", description: res?.error
                });
            }
        })
    }


    const gcd: any = (a: any, b: any) => {
        return b == 0 ? a : gcd(b, a % b);
    };
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

    if (loading) {
        return (
            <div className="flex justify-center items-center p-20 h-[calc(100vh_-_182px)]">
                <Loader2 className="my-28 h-[100px] dark:text-white w-[100px] text-cyan-500 animate-spin" />
            </div>
        );
    }

    const InfoRow = ({ label, value }: any) => (
        <div className="flex items-start gap-2">
            <div className="font-bold min-w-36">{label + " "}:</div>
            <div>{value}</div>
        </div>
    );
    return (
        <>
            <div className="max-w-12xl flex flex-col gap-6 p-6 sm:p-8">
                <Card className="flex flex-col p-6 space-y-6">
                    {/* <div className="flex flex-col items-center border-b pb-6" onClick={() => `/users/${chapter?.userDetails?.id}`}>
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={chapter?.userDetails ? previewImgUrl + chapter?.userDetails?.image : ""} />
                            <AvatarFallback className="bg-orange-500">{formatName(chapter?.userDetails?.name) || "N/A"}</AvatarFallback>
                        </Avatar>
                        <div className="font-bold text-lg mt-2">{chapter?.userDetails?.name || "N/A"}</div>
                        <div className="text-gray-600">{chapter?.userDetails?.email || ""}</div>
                        <div className="text-gray-600">{chapter?.userDetails?.bio || ""}</div>
                    </div> */}

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Chapter Details:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InfoRow label="Title" value={titleCase(chapter?.title) || "N/A"} />
                                <InfoRow label="Description" value={chapter?.description || "N/A"} />
                                <InfoRow label="Status" value={titleCase(chapter?.status) || "N/A"} />
                                <InfoRow label="Sequence" value={chapter?.sequence || 0} />
                            </div>
                            <div>
                                {/* <InfoRow label="Pay" value={chapter?.pay || "N/A"} /> */}
                            </div>
                        </div>
                        {(chapter?.mediaFile || chapter?.docFile) && (
                            <div
                                className={`grid ${chapter?.mediaFile && chapter?.docFile
                                    ? "md:grid-cols-2"
                                    : "grid-cols-1"
                                    } gap-6 p-6 mx-auto`}
                            >
                                {/* Media File Section */}
                                {chapter?.mediaFile?.length > 0 && (
                                    <Card
                                        className={`bg-white dark:bg-gray-800 shadow-md rounded-lg ${!chapter?.docFile ? "col-span-full" : ""
                                            }`}
                                    >
                                        <CardHeader className="p-4">
                                            <h3 className="text-lg font-semibold">Media Files</h3>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div
                                                className="relative h-[300px] overflow-hidden rounded-md"
                                                style={{ maxHeight: "300px" }} // Ensure the height is capped
                                            >
                                                <Carousel className="relative h-full">
                                                    <CarouselContent>
                                                        {chapter?.mediaFile?.map((data: any, i: number) => {
                                                            const videoJsOptions = {
                                                                autoplay: false,
                                                                controls: true,
                                                                responsive: true,
                                                                fluid: false,
                                                                sources: [
                                                                    {
                                                                        src:
                                                                            (data?.path.endsWith(".m3u8")
                                                                                ? previewVideo
                                                                                : previewVideoSource) + data?.path,
                                                                        type: VideoExtension(data?.mimeType || data?.path),
                                                                    },
                                                                ],
                                                            };
                                                            return (
                                                                <CarouselItem key={i} className="relative h-full">
                                                                    {data.mimeType?.includes("image") ? (
                                                                        <Image
                                                                            src={`${previewImgUrl}${data?.path}`}
                                                                            alt="Media File"
                                                                            width={500}
                                                                            height={300}
                                                                            className="rounded-md object-contain h-full"
                                                                        />
                                                                    ) : (
                                                                        <div className="video-container h-full">
                                                                            <VideoPlayer options={videoJsOptions} />
                                                                        </div>
                                                                    )}
                                                                </CarouselItem>
                                                            );
                                                        })}
                                                    </CarouselContent>
                                                    <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-200 dark:bg-gray-700 rounded-full p-2 shadow-md" />
                                                    <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-200 dark:bg-gray-700 rounded-full p-2 shadow-md" />
                                                </Carousel>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Document Section */}
                                {chapter?.docFile?.length > 0 && (
                                    <Card
                                        className={`bg-white dark:bg-gray-800 shadow-md rounded-lg ${!chapter?.mediaFile ? "col-span-full" : ""
                                            }`}
                                    >
                                        <CardHeader className="p-4">
                                            <h3 className="text-lg font-semibold">Documents</h3>
                                        </CardHeader>
                                        <CardContent className="p-4 space-y-4">
                                            {chapter.docFile.map((doc: any, i: number) => (
                                                <div key={i}>
                                                    <Button
                                                        className="w-full text-center bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md"
                                                        onClick={() => setShowPDF(!showPDF)}
                                                    >
                                                        {showPDF ? "Hide PDF" : "Show PDF"}
                                                    </Button>
                                                    {showPDF && (
                                                        <div className="mt-4">
                                                            <PdfViewer pdfFileUrl={`${previewImgUrl}${doc?.path}`} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}

                    </div>
                </Card>
            </div>
        </>
    )
}

export default ChapterDetail