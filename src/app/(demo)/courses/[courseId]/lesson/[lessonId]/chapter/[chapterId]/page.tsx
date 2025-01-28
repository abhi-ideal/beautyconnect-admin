"use client"
import React, { useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import CourseDetail from '@/components/details/CourseDetail';
import ChapterDetail from '@/components/details/ChapterDetail';
import LessonDetail from '@/components/details/LessonDetail';

const ChapterDetailPage = ({ params }: any) => {
    // courseId,lessonId,chapterId
    return (
        <ContentLayout title="Lesson Content Details">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/courses`}>Courses</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/courses/${params?.courseId}`}>Course Details</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/courses/${params?.courseId}/lesson/${params?.lessonId}`}>Lesson Detail</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Lesson Content Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <LessonDetail lessonId={params?.lessonId} />
            {/* <CourseDetail data={{ id: params.courseId, type: "course" }} /> */}

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Lesson Content Detail:</h1>
            </div>

            <ChapterDetail chapterId={params?.chapterId} lessonId={params?.lessonId} />


        </ContentLayout>
    )
}

export default ChapterDetailPage