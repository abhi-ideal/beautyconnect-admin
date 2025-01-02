"use client"
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import FlaggedUserTableComponent from "@/components/tables/FlaggedUserTableComponent";

export default function FlaggedUsersPage() {
  return (
    <ContentLayout title="Flagged Users">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Flagged Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <QueryClientProvider client={queryClient}>
        <FlaggedUserTableComponent />
      </QueryClientProvider>
    </ContentLayout>
  );
}
