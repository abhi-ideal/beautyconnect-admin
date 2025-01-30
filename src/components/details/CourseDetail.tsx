"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatName, titleCase } from '@/lib/utils';
import { format } from "date-fns";
import CourseApi from '@/api/courseApi';
import { Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';

const CourseDetail = (props: any) => {
    const { coursesDetail} = CourseApi();
    const [courseInfo, setCourseInfo]: any = useState({});
    const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
    const { id, type } = props?.data
    const [loading, setLoading]: any = useState(false);

    useEffect(() => {
        getcourseInfoDetails(id);
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
        </>
    )
}

export default CourseDetail