"use client"
import React, { useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import FlaggedPostDetail from '@/components/details/FlaggedPostDetail';

const FlaggedPostDetailPage = ({ params }: any) => {
    return (
        <ContentLayout title="Flagged Post">
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
                            <Link href="/flagged-posts">Flagged Post</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Flagged Post Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <FlaggedPostDetail data ={{ id: params.slug}}/>
        </ContentLayout>
    )
}

export default FlaggedPostDetailPage