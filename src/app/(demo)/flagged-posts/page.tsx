"use client"
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import FlaggedPostTableComponent from "@/components/tables/FlaggedPostTableComponent";

export default function FlaggedPostPage() {
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
            <BreadcrumbPage>Flagged Post</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <QueryClientProvider client={queryClient}>
        <FlaggedPostTableComponent />
      </QueryClientProvider>
    </ContentLayout>
  );
};