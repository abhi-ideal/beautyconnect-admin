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
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TransactionHistoryTableComponent from '@/components/tables/TransactionHistoryTableComponent';
const queryClient = new QueryClient();

const UserDetailPage = ({ params }: any) => {
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

            <QueryClientProvider client={queryClient}>
        <main className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-full">
            <Card className="mt-4 p-4">
            <CardTitle className="">
              <p className="font-semibold">Transaction History:</p>
            </CardTitle>
            <TransactionHistoryTableComponent  userId={params.slug} />
            </Card>
          </div>
        </main>
      </QueryClientProvider>

        </ContentLayout>
    )
}

export default UserDetailPage