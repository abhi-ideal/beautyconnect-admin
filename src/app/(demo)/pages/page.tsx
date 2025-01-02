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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import Content from "@/api/content";
import { useRouter } from "next/navigation";

export default function ContentPage() {
  const { getContentFiles } = Content();
  const [content, setContent]: any = useState("");
  const [type, setType]: any = useState("privacy_policy");
  const router = useRouter();

  useEffect(() => {
    getData(type);
  }, [type]);
  const getData = async (id: string) => {
    setContent("");
    await getContentFiles(type).then((res: any) => {
      if (!res?.error) {
        setContent(res?.response1?.text);
      } else {
        setContent("");
      }
    });
  };

  return (
    <ContentLayout title="Content">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Content</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <Tabs defaultValue="privacy_policy">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="privacy_policy" onClick={() => setType("privacy_policy")}>Privacy Policy</TabsTrigger>
            <TabsTrigger value="terms_and_conditions" onClick={() => setType("terms_and_conditions")}>Terms and Conditions</TabsTrigger>
          </TabsList>
          <TabsContent value="privacy_policy">
            <CardContent className="space-y-2">
              <CardTitle>Privacy Policy</CardTitle>
              <div contentEditable="false" dangerouslySetInnerHTML={{ __html: content }}></div>
              <div><Link href={"/pages/privacy_policy"}><Button>Edit</Button></Link></div>
            </CardContent>
          </TabsContent>
          <TabsContent value="terms_and_conditions">
            <CardContent className="space-y-2">
              <CardTitle>Terms and Condition</CardTitle>
              <div contentEditable="false" dangerouslySetInnerHTML={{ __html: content }}></div>
              <div><Link href={"/pages/terms_and_conditions"}><Button>Edit</Button></Link></div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </ContentLayout>
  );
}
