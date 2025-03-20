"use client";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfileForm from "@/components/form/EditProfileForm";
import ChangePassword from "@/components/form/ChangePassword";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatName } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks";

export default function AccountPage() {
  const {user}:any = useAppSelector((state:any)=> state.auth)
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL; 
  return (
    <ContentLayout title="Account">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-12xl flex-col flex-wrap items-start gap-6 py-6 sm:flex-row sm:py-8">
        <div className="grid gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-2">
        <Card className="flex flex-col items-center p-4 justify-center">
      <CardTitle className="flex flex-col items-center gap-2">
        <Avatar className="w-24 h-24">
          <AvatarImage
            src={
              user?.profile
                ?  previewImgUrl+ user?.profile
                : ""
            }
          />
          <AvatarFallback>{formatName(user?.name)}</AvatarFallback>
        </Avatar>
        <div className="font-bold text-lg mt-2">
          {user?.name ? user?.name : "N/A"}
        </div>
        <div className="text-gray-600 dark:text-[#aab2bb]">{user?.email ? user?.email : "N/A"}</div>
      </CardTitle>
        </Card>
        <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-2 !p-2 !h-auto gap-3">
              <TabsTrigger value="account" className="!p-2.5 border-border">Account</TabsTrigger>
              <TabsTrigger value="password" className="!p-2.5 border border-border">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <EditProfileForm />
            </TabsContent>
            <TabsContent value="password">
              <ChangePassword />
            </TabsContent>
        </Tabs>
        </div>
      </div>
    </ContentLayout>
  );
}
