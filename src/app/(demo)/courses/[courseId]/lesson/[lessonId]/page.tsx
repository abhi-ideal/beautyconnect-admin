"use client"
import React, { useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import CourseDetail from '@/components/details/CourseDetail';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChapterTableComponent from '@/components/tables/ChapterTableComponent';
import LessonDetail from '@/components/details/LessonDetail';
const queryClient = new QueryClient();

const LessonDetailPage = ({ params }: any) => {
    return (
        <ContentLayout title="Lesson Details">
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
                            <Link href="/courses">Courses</Link>
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
                        <BreadcrumbPage>Lesson Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {/* <CourseDetail data={{ id: params.courseId, type: "course" }} /> */}
                <LessonDetail lessonId={params?.lessonId} />

            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Lesson Content:</h3>
            </div>
            
            <QueryClientProvider client={queryClient}>
                <ChapterTableComponent courseId={params?.courseId} lessonId={params?.lessonId} />
            </QueryClientProvider>

        </ContentLayout>
    )
}

export default LessonDetailPage