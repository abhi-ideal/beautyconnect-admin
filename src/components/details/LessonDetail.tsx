"use client";
import React, { useEffect, useState } from "react";
import { formatName, titleCase } from "@/lib/utils";
import {  Loader2 } from "lucide-react";
import LessonApi from "@/api/lessonApi";
import { CardHeader, Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { format } from "date-fns";


const LessonDetail = ({ lessonId }: any) => {
  const { lessonsDetail } = LessonApi();
  const [lessonInfo, setLessonInfo]: any = useState({});
  const [loading, setLoading]: any = useState(false);
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;


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
        <div className='pt-8 pb-8' >
        <Card className="max-w-full mx-auto">
        <div className="flex flex-col items-center gap-2 p-4 border-b">
            <div className="relative flex flex-col items-center">
            <Avatar className="w-20 h-20">
                <AvatarImage 
                src={lessonInfo?.image ? previewImgUrl+ lessonInfo?.image : ""}
                alt="Lesson Logo" />
                <AvatarFallback> {formatName(lessonInfo?.title) || "N/A"}</AvatarFallback>
            </Avatar>
                        <div className="mt-4">
                            {lessonInfo?.status ? (
                    <Badge
                        className={
                            lessonInfo.status.toLowerCase() === "active"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                    >
                        {titleCase(lessonInfo.status)}
                    </Badge>
                    ) : (
                    <span className="text-sm text-gray-500">N/A</span>
                    )}

                            </div>
            </div>
        </div>
        <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Lesson Details:</h2>
            <div className="grid grid-cols gap-x-8 gap-y-2">
            {/* Left Column */}
            <div className="space-y-4">



                <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">Title:</span>
                <span className="text-sm">{lessonInfo.title ? titleCase(lessonInfo.title) : "N/A"}</span>
                </div>

                <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">Description:</span>
                <span className="text-sm">{lessonInfo.description || "N/A"}</span>
                </div>

                <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-sm font-medium">Created At:</span>
                <span className="text-sm">{lessonInfo.createdAt ? format(new Date(lessonInfo?.createdAt), "dd MMM, yy 'at' h:mm a") : "N/A"}</span>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">


            </div>
            </div>
        </CardContent>
        </Card>
        </div>
    </>
  );
};

export default LessonDetail;
