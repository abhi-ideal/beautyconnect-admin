"use client"
import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card';
import { titleCase } from '@/lib/utils';
import { useToast } from "../ui/use-toast";
import { Loader2 } from 'lucide-react';
import LessonApi from '@/api/lessonApi';


const LessonDetail = ({lessonId}: any) => {
    const { toast } = useToast();
    const { lessonsDetail } = LessonApi()
    const [lesson, setLesson]: any = useState({});
    const [loading, setLoading]: any = useState(false);

    useEffect(() => {
        getlessonDetaits(lessonId);
    }, [lessonId]);

    const getlessonDetaits = async (id: any) => {
        setLoading(true);
        await lessonsDetail(id).then((res: any) => {
            if (!res.error) {
                setLesson(res?.result)
                setLoading(false);
            } else {
                setLesson({})
                setLoading(false);
                toast({
                    title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
                    variant: "destructive", description: res?.error
                });
            }
        })
    }

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
                    {/* <div className="flex flex-col items-center border-b pb-6" onClick={()=>`/users/${lesson?.userDetails?.id}`}>
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={lesson?.userDetails ? previewImgUrl + lesson?.userDetails?.image : ""} />
                                <AvatarFallback className="bg-orange-500">{formatName(lesson?.userDetails?.name) || "N/A"}</AvatarFallback>
                            </Avatar>
                            <div className="font-bold text-lg mt-2">{lesson?.userDetails?.name || "N/A"}</div>
                            <div className="text-gray-600">{lesson?.userDetails?.email || ""}</div>
                            <div className="text-gray-600">{lesson?.userDetails?.bio || ""}</div>
                    </div> */}

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Chapter Details:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InfoRow label="Title" value={titleCase(lesson?.title) || "N/A"} />
                                <InfoRow label="Description" value={lesson?.description || "N/A"} />
                                <InfoRow label="Status" value={titleCase(lesson?.status) || "N/A"} />
                                <InfoRow label="Chapter" value={lesson?.totalChapter || 0} />
                            </div>
                            <div>
                                {/* <InfoRow label="Pay" value={lesson?.pay || "N/A"} /> */}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}

export default LessonDetail