import React, { useEffect, useRef, useState } from 'react'
import { CardHeader, Card, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import VideoPlayer from '../demo/VideoPlayer';
import VideoExtension from '../demo/VideoExtension';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatName } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ReportApi from '@/api/report';
import Link from "next/link";
import { format } from "date-fns";
import { Loader2 } from 'lucide-react';
import ReactVideoPlayer from '../demo/ReactVideoPlayer';

const FlaggedCourseDetail = (props: any) => {
    const { toast } = useToast();
    const [course, setCourse]: any = useState({});
    const { id }: any = props?.data;
    const { flaggedReasonList } = ReportApi();
    const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
    const previewVideo = process.env.NEXT_PUBLIC_PREVIEW_VIDEO;
    const [reason, setReason]: any = useState({});
    const [loading, setLoading]: any = useState(false);

    useEffect(() => {
        getMarketPlaceDetaits(id);
    }, [id]);

    const gcd: any = (a: any, b: any) => {
        return b == 0 ? a : gcd(b, a % b);
    };

    const getMarketPlaceDetaits = async (id: any) => {
        setLoading(true);
        // await flaggedReasonList('jobsReason').then((res: any) => {
        //     setReason(res);
        // })

        // await flaggedCourseDetail(id).then((res: any) => {
        //     if (!res.error) {
        //         setCourse(res?.results);
        //         setLoading(false);
        //     } else {
        //         setCourse({});
        //         setLoading(false);
        //         toast({
        //             title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
        //             variant: "destructive", description: res?.error
        //         });
        //     }
        // })
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

    if (loading) {
        return (
          <div className="flex justify-center items-center p-20 h-[calc(100vh_-_182px)]">
            <Loader2 className="my-28 h-[100px] dark:text-white w-[100px] text-primary animate-spin" />
          </div>
        );
    }


    return (
        <>
            <div className="max-w-12xl flex-col flex-wrap items-start gap-6 p-6 sm:flex-row sm:p-8">
                <div className="grid gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-2">
                    <Card className="flex flex-col p-4">
                        <b>Reported By:</b>
                        <CardHeader>
                            {/* <CardTitle>Reported By:</CardTitle> */}
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="flex items-center justify-between space-x-4">
                                <Link href={`/users/${course?.actionId}`}>
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={course?.coursesInfo?.userDetails?.image ? previewImgUrl + course?.coursesInfo?.userDetails?.image : ""} />
                                            <AvatarFallback>{formatName(course?.coursesInfo?.userDetails?.name) || "NA"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{course?.coursesInfo?.userDetails?.name || "NA"}</p>
                                            <p className="text-sm text-muted-foreground">{course?.coursesInfo?.userDetails?.email || "NA"}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="items-start flex gap-2 detail-row">
                                <div><b>course Content : </b></div>
                                <div>
                                    <Carousel className="max-w-xs">
                                        <CarouselContent>
                                            {course?.coursesInfo?.media?.map((album: any, i: number) => {
                                                let dimensions: any;
                                                if (album?.ratio) {
                                                    if (album?.ratio?.includes("*")) {
                                                        !album?.ratio.split("*")?.includes("null") ? (dimensions = album?.ratio.split("*")) : (dimensions = ["500", "500"]);
                                                    } else {
                                                        !album?.ratio.split("x")?.includes("null") ? (dimensions = album?.ratio.split("x")) : (dimensions = ["500", "500"]);
                                                    }
                                                } else {
                                                    dimensions = ["500", "500"];
                                                };
                                                const w = dimensions[0] ? parseInt(dimensions[0]) : 16;
                                                const h = dimensions[1] ? parseInt(dimensions[1]) : 9;
                                                const r = gcd(w, h);
                                                const videoJsOptions = {
                                                    autoplay: false, controls: true, responsive: true, fluid: false, aspectRatio: "16:9",
                                                    sources: [{
                                                        src: (album?.path.endsWith('.m3u8') ? previewVideo : previewVideo) + (album?.path ? album?.path : album?.url),
                                                        type: VideoExtension(album?.mimeType ? album.mimeType : album?.path),
                                                    }],
                                                };
                                                console.log('______________________', videoJsOptions);
                                                
                                                return (
                                                    <CarouselItem key={i}>
                                                        {album?.mimeType?.includes("image") ?
                                                            <Image src={previewImgUrl + album.path} alt={album.name} width={250} height={330} className="w-[250px]" />
                                                            : <ReactVideoPlayer url={(album?.path.endsWith('.m3u8') ? previewVideo : previewVideo) + (album?.path ? album?.path : album?.url)} controls={true} width="" height="" />
                                                            // <div className='video-full'> <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} /></div>
                                                            }
                                                    </CarouselItem>
                                                )
                                            })}
                                        </CarouselContent>
                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </Carousel>
                                </div>
                            </div>

                            <div className="items-start flex gap-2">
                                <div><b>Title : </b></div>
                                <div>{course?.coursesInfo?.title || "NA"}</div>
                            </div>
                            <div className="items-start flex gap-2">
                                <div><b>Description : </b></div>
                                <div>{course?.coursesInfo?.description || "NA"}</div>
                            </div>
                            <div className="items-start flex gap-2">
                                <div><b>Status : </b></div>
                                <div>{course?.coursesInfo?.status || "NA"}</div>
                            </div>
                            <div className="items-start flex gap-2">
                                <div><b>Like : </b></div>
                                <div>{course?.coursesInfo?.totalLike || 0}</div>
                            </div>
                            <div className="items-start flex gap-2">
                                <div><b>Comment : </b></div>
                                <div>{course?.coursesInfo?.totalComment || 0}</div>
                            </div>
                            <div className="items-start flex gap-2">
                                <div><b>Share : </b></div>
                                <div>{course?.coursesInfo?.totalShare || 0}</div>
                            </div>

                        </CardContent>
                    </Card>

                    <Card className="flex flex-col p-4">
                        <b>Reported By:</b>
                        <CardHeader>
                            {/* <CardTitle>Reported By:</CardTitle> */}
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            {
                                course?.reportedUser?.map((reportUser: any, i: number) => {
                                    return (
                                        <>
                                            <div className="flex items-center justify-between space-x-4">
                                                <Link href={`/users/${reportUser?.users?.id}`}>
                                                    <div className="flex items-center space-x-4">
                                                        <Avatar>
                                                            <AvatarImage src={reportUser?.users?.image ? previewImgUrl + reportUser?.users?.image : ""} />
                                                            <AvatarFallback>{formatName(reportUser?.users?.name) || "NA"}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium leading-none">{reportUser?.users?.name || "NA"}</p>
                                                            <p className="text-sm text-muted-foreground">{reportUser?.users?.email || "NA"}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className="items-start flex gap-2">
                                                <div><b>Reason : </b></div>
                                                <div>{reason.find((item: any) => item.id === reportUser?.reasonId.toString())?.title}</div>
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default FlaggedCourseDetail