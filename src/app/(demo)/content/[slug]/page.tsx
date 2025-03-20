"use client";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import ContentApi from "@/api/contentApi";

export default function ContentDetailPage({ params }: any) {
  const id = params.slug;
  const { getContentFiles } = ContentApi();
  const [value, setValue]: any = useState("");
  const [circleLoader, setCircleLoader]: any = useState(false);

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    setCircleLoader(true);
    await getContentFiles(id).then((res: any) => {
      if (!res?.error) {
        setValue(res?.responseData?.content);
        setCircleLoader(false);
      } else {
        setCircleLoader(false);
        setValue("");
      }
    });
  };
  const sidebarNavItems = [
    { title: "Privacy Policy", href: "/content/privacy_policy", id: "privacy_policy" },
    { title: "Terms & Conditions", href: "/content/terms_condition", id: "terms_condition" },
  ];

  return (
    <>
      <ContentLayout title="Content">
        <Breadcrumb>
          <BreadcrumbList>
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
        <div className="space-y-6 pt-5 sm:pt-8">
          {/* <Separator /> */}
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-6 lg:space-y-0">
            <aside className="lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-[1_0_0%] [&>div>*:nth-last-child(-n_+_1)]:justify-end">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    { sidebarNavItems.find((item: any) => item.id == id)?.title || "Default Title"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 h-[calc(100vh_-_374px)] overflow-y-auto [&>div>p]:!bg-content [&>div>p]:!text-foreground [&>div>p>span]:!bg-content [&>div>p>span]:!text-foreground">
                  {circleLoader ? (
                    <div className="p-6 h-full flex justify-center items-center">
                      <Loader2 className="my-28 dark:text-white h-[80px] w-[80px] text-primary animate-spin" />
                    </div>
                  ) : !value ? (
                    <div className="p-6 h-full flex flex-col justify-center items-center">
                      <Image src="/no-data.svg" alt="Logo" width={320} height={320} priority className="size-[150px]"/>
                      <span className="font-semibold text-lg">No Record Found</span>
                    </div>
                  ) : (
                    <div
                      contentEditable="false"
                      dangerouslySetInnerHTML={{ __html: value }}
                    ></div>
                  )}
                </CardContent>

                <Separator className="my-2" />
                <CardFooter className="!pt-2">
                  <Link href={!circleLoader ? `${id}/edit` : "#"}>
                    <Button disabled={circleLoader} >Edit { sidebarNavItems.find((item: any) => item.id == id)?.title || "Default Title"}</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </ContentLayout>
    </>
  );
}