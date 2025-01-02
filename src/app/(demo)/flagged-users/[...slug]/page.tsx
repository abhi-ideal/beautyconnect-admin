"use client"
import React, { useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import FlaggedUserDetail from '@/components/details/FlaggedUserDetail';

const FlaggedUserDetailPage = ({ params }: any) => {
    return (
        <ContentLayout title="Flagged User Details">
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
                            <Link href="/flagged-users">Flagged Users</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Flagged User Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <FlaggedUserDetail data ={{ id: params.slug}}/>
        </ContentLayout>
    )
}

export default FlaggedUserDetailPage