"use client"
import React, { useEffect, useRef, useState } from 'react'
import { CardHeader, Card, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatName } from '@/lib/utils';
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
const CourseDetail = (props: any) => {
    const { toast } = useToast();
    const { coursesDetail, contentListApi, courseContentDetail, SignVideoUrl } = CourseApi();
    const [signedToken, setSignedToken ]: any = useState({});
    const [courseInfo, setCourseInfo]: any = useState({});
    const [courseContentInfo, setCourseContentInfo]: any = useState([]);
    const [courseContentList, setCourseContentList]: any = useState([]);
    const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
    const previewVideo = process.env.NEXT_PUBLIC_PREVIEW_VIDEO;
    const previewVideoSource = process.env.NEXT_PUBLIC_PREVIEW_VIDEO_SOURCE;
    const { id, type } = props?.data
    const [loading, setLoading]: any = useState(false);
    const [showPDF, setShowPDF]: any = useState(false);
    const url:any='https://smedia.thedentalnetwork.co.uk/2V-1731391794383-3608193927565312/2V-1731391794383-3608193927565312.m3u8';

    useEffect(() => {
        getcourseInfoDetaits(id);
        // getCourseContentList(id);
        // getVideoURL(url,2);
    }, [id]);
    const getcourseInfoDetaits = async (id: any) => {
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
        <div className="flex items-start gap-2">
            <div className="font-bold">{label}:</div>
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
            <Loader2 className="my-28 h-[100px] dark:text-white w-[100px] text-cyan-500 animate-spin" />
          </div>
        );
    }

    const CourseContents = () => {
        return (
            <>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Course ID</th>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3">Created At</th>
                                <th scope="col" className="px-6 py-3">View Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseContentList?.map((courseContent: any, index: any) => (
                                <tr className="border-b dark:border-gray-700 cursor-pointer" onClick={() => contentDetail(courseContent?.id)} key={index}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{courseContent.courseId || "-"}</th>
                                    <td className="px-6 py-4">{courseContent.title || "-"}</td>
                                    <td className="px-6 py-4">{courseContent.description || "-"}</td>
                                    <td className="px-6 py-4">{format(new Date(courseContent?.createdAt), "dd MMM, yy 'at' h:mm a") || "-"}</td>
                                    <td className="px-6 py-4 d-flex"><Eye /> Detail</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )
    };

    return (
        <>
            <div className="max-w-12xl flex flex-col gap-6 p-6 sm:p-8">
                {/* Single Card Design */}
                <Card className="flex flex-col p-6 space-y-6">
                    {/* User Details Section */}
                    <div className="flex flex-col items-center gap-4 border-b pb-6">
                        <h3 className="text-xl font-semibold">User Details</h3>
                        <Link href={`/users/${courseInfo?.userDetails?.id}`}>
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={courseInfo?.userDetails ? previewImgUrl + courseInfo?.userDetails?.image : ""} />
                                <AvatarFallback className="bg-orange-500">
                                    {formatName(courseInfo?.userDetails?.name) || "N/A"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="font-bold text-lg mt-2">
                                {courseInfo?.userDetails?.name || "N/A"}
                            </div>
                        </Link>
                    </div>

                    {/* Job Details Section - Two Column Layout */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Course Details:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InfoRow label="Title" value={courseInfo?.title || "N/A"} />
                                <InfoRow label="Status" value={courseInfo?.status || "N/A"} />
                                <InfoRow label="Amount" value={courseInfo?.amount || 0} />
                                <InfoRow label="Total Rating" value={courseInfo?.totalRating || 0} />
                                <InfoRow label="Featured" value={courseInfo?.isFeatured ? "Yes" : "No"} />
                                <InfoRow label="Experience (From)" value={courseInfo?.fromExperience || 0} />
                                <InfoRow label="Experience (To)" value={courseInfo?.toExperience || 0} />
                            </div>
                            <div>
                                <InfoRow label="Description" value={courseInfo?.description || "N/A"} />
                                <InfoRow label="Average Rating" value={courseInfo?.avgRating || 0} />
                                <InfoRow label="Course Type" value={courseInfo?.courseType || "N/A"} />
                                <InfoRow label="Created At" value={courseInfo?.createdAt ? format(new Date(courseInfo?.createdAt), "dd MMM, yy 'at' h:mm a") : "N/A"} />
                                <InfoRow label="Category" value={courseInfo?.category || "N/A"} />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Course Content Section */}

            {/* <div className="max-w-12xl flex-col flex-wrap items-start gap-6 px-6 sm:flex-row sm:px-8">
                {
                    courseContentList?.length &&
                    <>
                        <Card className="gap-3 p-5">
                            <div><b>Course Contents:</b></div>
                            <CourseContents />
                        </Card>
                    </>
                }
            </div> */}

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