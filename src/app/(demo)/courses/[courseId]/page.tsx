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
const queryClient = new QueryClient();

const CourseDetailPage = ({ params }: any) => {
    const [allLessons, setAllLessons]: any = useState([]);

    return (
        <ContentLayout title="Course Details">
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
                        <BreadcrumbPage>Course Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <CourseDetail data={{ id: params.courseId, type: "course" }} />

            <div className="mx-8 flex items-center justify-between">
                <h1 className="text-4xl font-semibold">Lessons</h1>
            </div>
            <QueryClientProvider client={queryClient}>
                <LessonTableComponent courseId={params.courseId} allLessons={allLessons}  setAllLessons={setAllLessons} />
            </QueryClientProvider>
        </ContentLayout>
    )
}

export default CourseDetailPage