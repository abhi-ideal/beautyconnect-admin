"use client"
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CourseTableComponent from "@/components/tables/CourseTableComponent";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddEditCourse from "@/components/form/AddEditCourse";

export default function CoursesPage() {
  const [open, setOpen] = useState(false);
  const [allCourses, setAllCourses]: any = useState([]);
  return (
<ContentLayout title="Courses">
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
        <BreadcrumbPage>Courses</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
  <Button className="ml-auto" onClick={() => setOpen(true)}>
    Add Course
  </Button>
</div>

<div className="text-left">
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>Create Course</DialogTitle>
      </DialogHeader>
      <AddEditCourse props={{setOpen, allCourses, setAllCourses}}></AddEditCourse>
    </DialogContent>
  </Dialog>
</div>
<QueryClientProvider client={queryClient}>
  <CourseTableComponent allCourses={allCourses} setAllCourses={setAllCourses}/>
</QueryClientProvider>
</ContentLayout>


  );
}
