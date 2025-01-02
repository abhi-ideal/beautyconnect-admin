"use client"
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddEditSkill from "@/components/form/AddEditSkill";
import { useState } from "react";
import SkillTableComponent from "@/components/tables/SkillTableComponent";

export default function SkillsPage() {
  const [open, setOpen] = useState(false);
  const [allSkills, setAllSkills]: any = useState([]);
  return (
    <ContentLayout title="Specializations">
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
              <BreadcrumbPage>Specializations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button className="ml-auto" onClick={() => setOpen(true)}>Add Specialization</Button>
      </div>

      <div className="text-left">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Specialization</DialogTitle>
            </DialogHeader>
            <AddEditSkill props={{ setOpen, allSkills, setAllSkills }}></AddEditSkill>
          </DialogContent>
        </Dialog>
      </div>
      <QueryClientProvider client={queryClient}>
        <SkillTableComponent allSkills={allSkills} setAllSkills={setAllSkills} />
      </QueryClientProvider>
    </ContentLayout>
  );
}
