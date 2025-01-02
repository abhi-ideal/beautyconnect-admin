"use client"
import React, { useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import CourseDetail from '@/components/details/CourseDetail';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChapterTableComponent from '@/components/tables/ChapterTableComponent';
import LessonTableComponent from '@/components/tables/LessonTableComponent';
import { ArrowLeft } from 'lucide-react';
import LessonDetail from '@/components/details/LessonDetail';
const queryClient = new QueryClient();

const LessonDetailPage = ({ params }: any) => {
    return (
        <ContentLayout title="Lesson Details">
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
                            <Link href="/courses">Course</Link>
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

            <CourseDetail data={{ id: params.courseId, type: "course" }} />

            <div className="mx-8 flex items-center justify-between">
                <h1 className="text-4xl font-semibold">Lessons Details</h1>
            </div>
            
            <LessonDetail chapterid={params?.lessonId} lessonId={params?.lessonId} />

            <QueryClientProvider client={queryClient}>
                <ChapterTableComponent courseId={params?.courseId} lessonId={params?.lessonId} />
            </QueryClientProvider>

        </ContentLayout>
    )
}

export default LessonDetailPage