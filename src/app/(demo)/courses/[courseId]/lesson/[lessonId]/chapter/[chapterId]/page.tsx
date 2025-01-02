"use client"
import React, { useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import CourseDetail from '@/components/details/CourseDetail';
import ChapterDetail from '@/components/details/ChapterDetail';

const ChapterDetailPage = ({ params }: any) => {
    // courseId,lessonId,chapterId
    return (
        <ContentLayout title="Course Details">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/courses`}>Course</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/courses/${params?.courseId}`}>Course Detail</Link>
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
                        <BreadcrumbPage>Chapter Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <CourseDetail data={{ id: params.courseId, type: "course" }} />

            <div className="mx-8 flex items-center justify-between">
                <h1 className="text-4xl font-semibold">Chapters Details</h1>
            </div>

            <ChapterDetail chapterId={params?.chapterId} lessonId={params?.lessonId} />


        </ContentLayout>
    )
}

export default ChapterDetailPage