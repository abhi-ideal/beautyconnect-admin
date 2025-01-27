"use client"
import React, { useEffect, useRef, useState } from 'react'
import { CardHeader, Card, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatName, titleCase } from '@/lib/utils';
import { useToast } from "../ui/use-toast";
import { format } from "date-fns";
import Link from "next/link";
import CourseApi from '@/api/courseApi';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import VideoPlayer from '../demo/VideoPlayer';
import VideoExtension from '../demo/VideoExtension';
import PdfViewer from '../demo/PdfViewer';
import { Button } from '../ui/button';
import { Eye, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import ReactVideoPlayer from '../demo/ReactVideoPlayer';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import moment from 'moment';
const CourseDetail = (props: any) => {
    const { toast } = useToast();
    const { coursesDetail, contentListApi, courseContentDetail, SignVideoUrl } = CourseApi();
    const [signedToken, setSignedToken ]: any = useState({});
    const [courseInfo, setCourseInfo]: any = useState({});
    const [courseContentInfo, setCourseContentInfo]: any = useState([]);
    const [courseContentList, setCourseContentList]: any = useState([]);
    const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
    const previewVideo = process.env.NEXT_PUBLIC_PREVIEW_VIDEO;
    const { id, type } = props?.data
    const [loading, setLoading]: any = useState(false);
    const [showPDF, setShowPDF]: any = useState(false);
    const url:any='https://smedia.thedentalnetwork.co.uk/2V-1731391794383-3608193927565312/2V-1731391794383-3608193927565312.m3u8';

    useEffect(() => {
        getcourseInfoDetails(id);
        // getCourseContentList(id);
        // getVideoURL(url,2);
    }, [id]);
    const getcourseInfoDetails = async (id: any) => {
        setLoading(true);
        await coursesDetail(id).then((res: any) => {
            if (!res.error) {
                setCourseInfo(res?.result)
                setLoading(false);
            } else {
                setCourseInfo({})
                setLoading(false);
                toast({
                    title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
                    variant: "destructive", description: res?.error
                });
            }
        })
    }


    const getCourseContentList = async (id: any) => {
        await contentListApi(id).then((res: any) => {
            if (!res.error) {
                setCourseContentList(res?.results ? res?.results : res?.result);
            } else {
                setCourseContentList({});
                toast({
                    title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
                    variant: "destructive", description: res?.error
                });
            }
        })
    };


    const contentDetail = async (contentId: any) => {
        await courseContentDetail({ id: id, contentId: contentId }).then((res: any) => {
            if (!res.error) {
                setCourseContentInfo(res?.results ? res?.results : res?.result);
            } else {
                setCourseContentInfo({});
                toast({
                    title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
                    variant: "destructive", description: res?.error
                });
            }
        })
    };

    const getVideoURL = async (file: any, i:number) => {
        file= url;
        await SignVideoUrl(file).then((res: any) => {
            if (!res.error) {
                console.log(res, res?.result);
                setSignedToken(res?.result);
                // Object?.entries(res).forEach(([key, value]: [string, any]) => {
                //     Cookies.set(key, value, {
                //         expires: 7,
                //         path: '/',
                //         domain: '.thedentalnetwork.co.uk'
                //     });
                // });
                Cookies.set('CloudFront-Key-Pair-Id', res?.CloudFrontKeyPairId, { 
                    expires: 7, 
                    path: '/', 
                    domain: '.thedentalnetwork.co.uk',
                    secure: true
                });
                Cookies.set( 'CloudFront-Policy', res?.CloudFrontPolicy, { 
                    expires: 7, 
                    path: '/', 
                    domain: '.thedentalnetwork.co.uk',
                    secure: true
                });
                Cookies.set('CloudFront-Signature', res?.CloudFrontSignature, { 
                    expires: 7, 
                    path: '/', 
                    domain: '.thedentalnetwork.co.uk',
                    secure: true
                });
                } else {
                toast({
                    title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
                    variant: "destructive", description: res?.error
                });
            };
        });
    };

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
    const InfoRow = ({ label, value }: any) => (
        <div className="flex items-start gap-20">
            <div className="font-bold min-w-36">{label}:</div>
            <div>{value}</div>
        </div>
    );
    const parseDimensions = (ratio: any) => {
        const [width, height] = ratio?.split(/[*x]/) || ["500", "500"];
        return { width: parseInt(width) || 500, height: parseInt(height) || 500 };
    };

    if (loading) {
        return (
          <div className="flex justify-center items-center p-20 h-[calc(100vh_-_182px)]">
            <Loader2 className="my-28 h-[100px] dark:text-white w-[100px] text-primary animate-spin" />
          </div>
        );
    }



    return (
        <>
        <div className='pt-8 pb-8' >
        <Card className="max-w-full mx-auto">
        <div className="flex flex-col items-center gap-2 p-4 border-b">
            <div className="relative flex flex-col items-center">
            <Avatar className="w-20 h-20">
                <AvatarImage 
                src={courseInfo ? previewImgUrl+ courseInfo?.media : ""}
                alt="Course Logo" />
                <AvatarFallback> {formatName(courseInfo?.title) || "N/A"}</AvatarFallback>
            </Avatar>
                        <div className="mt-4">
                            {courseInfo?.status ? (
                    <Badge
                        className={
                            courseInfo.status.toLowerCase() === "active"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                    >
                        {titleCase(courseInfo.status)}
                    </Badge>
                    ) : (
                    <span className="text-sm text-gray-500">N/A</span>
                    )}

                            </div>
            </div>
        </div>
        <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Course Details:</h2>
            <div className="grid grid-cols-[1fr,2fr] gap-x-8 gap-y-2">
            {/* Left Column */}
            <div className="space-y-4">

            <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">Created At:</span>
                <span className="text-sm">{courseInfo.createdAt ? format(new Date(courseInfo?.createdAt), "dd MMM, yy 'at' h:mm a") : "N/A"}</span>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">Amount:</span>
                <span className="text-sm">{courseInfo.amount ? "$ "+ courseInfo.amount : "N/A"}</span>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">Rating:</span>
                <span className="text-sm">{courseInfo.rating}</span>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">Total Lesson:</span>
                <span className="text-sm">{courseInfo.totalLesson || "0"}</span>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">Total Purchase:</span>
                <span className="text-sm">{courseInfo.totalPurchase || "0"}</span>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">Total Rating:</span>
                <span className="text-sm">{courseInfo.totalRating || "0"}</span>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">

                 <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">Title:</span>
                <span className="text-sm">{courseInfo.title ? titleCase(courseInfo.title) : "N/A"}</span>
                </div>

                <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">Description:</span>
                <span className="text-sm">{courseInfo.description || "N/A"}</span>
                </div>

                <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">Course is for:</span>
                <span className="text-sm" contentEditable="false" dangerouslySetInnerHTML={{ __html: courseInfo.courseFor || "N/A" }} ></span>
                </div>

                <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">What You'll Learn:</span>
                <span className="text-sm" contentEditable="false" dangerouslySetInnerHTML={{ __html: courseInfo.learn || "N/A" }} ></span>
                </div>


                <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">Experience:</span>
                
                <span className="text-sm">  {courseInfo?.experience ? courseInfo.experience : "N/A"} </span>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">Specialization:</span>
                <span className="text-sm">  {courseInfo?.category?.length ? courseInfo.category?.join(", "): "N/A"}</span>
                </div>
            </div>
            </div>
        </CardContent>
        </Card>
        </div>

        {(courseContentInfo?.[0]?.mediaFile || courseContentInfo?.[0]?.docFile) && (
            <div className="grid md:grid-cols-[1fr_400px] gap-6 p-6  mx-auto">
                <Card className="bg-white dark:bg-black">
                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-4">
                        {courseContentInfo?.[0]?.mediaFile?.length > 0 && <div className="relative aspect-video">
                            <Carousel className="relative w-full">
                                <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                                    <CarouselContent>
                                        {courseContentInfo?.[0]?.mediaFile?.map((data: any, i: any) => {
                                            console.log(signedToken);
                                            const videoUrl = url;
                                            const videoJsOptions = {
                                                autoplay: false, controls: true, responsive: true, fluid: false, aspectRatio: "16:9",
                                                sources: [{
                                                    withCredentials: true,
                                                    // src: (data?.path.endsWith('.m3u8') ? previewVideo : previewVideoSource) + (data?.path || data?.url),
                                                    src: `${videoUrl}`,
                                                    type: VideoExtension(data?.mimeType || data?.path),
                                                }],
                                            };
                                            console.log(videoJsOptions);
                                            const [videoWidth, videoHeight] = data.ratio.split("x").map(Number);
                                            const aspectRatio = videoHeight / videoWidth;
                                            const containerWidth = 500;
                                            const calculatedHeight = containerWidth * aspectRatio;
                                            return (
                                                <CarouselItem key={i} className="aspect-video">
                                                    {data?.mimeType?.includes("image") ?
                                                        <Image src={previewImgUrl + data?.path || "/default_image.png"} alt="Post Image" width={448} height={252} className="object-contain rounded-md size-full" />
                                                        : 
                                                        // <div style={{ width: `${containerWidth}px`, height: `${calculatedHeight}px` }}>
                                                        // <ReactVideoPlayer url={url} controls={true} />
                                                        // </div>
                                                        <div className='video-full'><VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} /></div>
                                                        }
                                                </CarouselItem>
                                            )
                                        })
                                        }
                                    </CarouselContent>
                                    <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white dark:bg-black dark:bg-opacity-75 bg-opacity-75 rounded-full p-2 shadow-md" />
                                    <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white dark:bg-black dark:bg-opacity-75 bg-opacity-75 rounded-full p-2 shadow-md" />
                                </div>
                            </Carousel>
                        </div>}
                    </CardContent>

                </Card>
                <Card>
                    {courseContentInfo?.[0]?.docFile?.map((doc: any, i: any) => {
                        return (
                            <div className='m-4'>
                                <Button onClick={() => (setShowPDF(!showPDF))} className='p-4' >Show PDF.</Button>
                                {showPDF && <PdfViewer pdfFileUrl={previewImgUrl + doc?.path} />}
                            </div>
                        );
                    })}
                </Card>
            </div>
        )}
        </>
    )
}

export default CourseDetail