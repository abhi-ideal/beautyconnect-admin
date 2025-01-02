"use client"
import React, { useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import UserDetail from '@/components/details/UserDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FollowerFollowingTableComponent from '@/components/tables/FollowerFollowingTableComponent';
const queryClient = new QueryClient();

const UserDetailPage = ({ params }: any) => {
    const [type, setType]: any = useState("follower");
    return (
        <ContentLayout title="User Details">
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
                            <Link href="/users">Users</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>User Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <UserDetail data ={{ id: params.slug, type:"User" }}></UserDetail>
            {/* <Card>
                <Tabs defaultValue="follower">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="follower" onClick={() => setType("follower")}>Follower</TabsTrigger>
                        <TabsTrigger value="following" onClick={() => setType("following")}>Following</TabsTrigger>
                    </TabsList>
                    <TabsContent value="follower">
                        <CardContent className="space-y-2">
                            <QueryClientProvider client={queryClient}>
                                <FollowerFollowingTableComponent type={'follower'} id={params.slug}/>
                            </QueryClientProvider>
                        </CardContent>
                    </TabsContent>
                    <TabsContent value="following">
                        <CardContent className="space-y-2">
                            <QueryClientProvider client={queryClient}>
                                <FollowerFollowingTableComponent type={'following'} id={params.slug}/>
                            </QueryClientProvider>
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </Card> */}
        </ContentLayout>
    )
}

export default UserDetailPage