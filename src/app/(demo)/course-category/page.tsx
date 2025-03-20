"use client"
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; 
import AddEditCoursecategory from "@/components/form/AddEditCourseCategory";
import { useState } from "react"; 
import CourseCategoryTableComponent from "@/components/tables/CourseCategoryTableComponent";

export default function CourseCategoryPage() {
  const [open, setOpen] = useState(false);
  const [allCourseCategory, setAllCourseCategory]: any = useState([]);
  return (
    <ContentLayout title="Course Category">
      <div className="flex">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Course Category</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button className="ml-auto" onClick={() => setOpen(true)}>Add Course Category</Button>
      </div>

      <div className="text-left">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Course Category</DialogTitle>
            </DialogHeader> 
            <AddEditCoursecategory props={{ setOpen, allCourseCategory, setAllCourseCategory }}></AddEditCoursecategory>
          </DialogContent>
        </Dialog>
      </div>
      <QueryClientProvider client={queryClient}>
        <CourseCategoryTableComponent allCourseCategory={allCourseCategory} setAllCourseCategory={setAllCourseCategory} />
      </QueryClientProvider>
    </ContentLayout>
  );
}
