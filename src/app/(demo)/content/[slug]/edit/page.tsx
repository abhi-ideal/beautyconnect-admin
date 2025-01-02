"use client";
import React, { useMemo, useRef } from "react";
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import JoditEditor from "jodit-react";
import { useTheme } from "next-themes";
import ContentApi from "@/api/contentApi";
import { titleCase } from "@/lib/utils";

const ContentEditorPage = ({ params }: any) => {
  const { toast } = useToast();
  const router = useRouter();
  const { updateContent, invalidate, getContentFiles } = ContentApi();
  const id = params.slug;
  const [value, setValue]: any = useState("");
  const [loading, setLoading]: any = useState(false);
  const [showEditor, setShowEditor]: any = useState(false);
  const [circleLoader, setCircleLoader]: any = useState(false);
  const { theme } = useTheme();
  const editor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
      theme: "custom",
      style: {
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
        color: theme === "dark" ? "#e5e5e5" : "#000000",
      },
    }),
    [theme]
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setCircleLoader(true);
    await getContentFiles(id).then((res: any) => {
      if (!res?.error) {
        setValue(res?.responseData?.content);
        setShowEditor(true);
        setCircleLoader(false);
      } else {
        setValue("");
        setShowEditor(false);
        setCircleLoader(false);
      }
    });
  };

  const submitEditors = async () => {
    setLoading(true);
    const contentData = {
      content: value,
    };
    await updateContent(contentData, id).then(async (res: any) => {
      if (!res?.error) {
        await invalidate(id)
            .then((resposne: any) => {
              if (!resposne?.error){
                setTimeout(() => {
                  setLoading(false);
                  router.push(`/content/${id}`);
                  toast({
                      title: "Update Content successfully",
                      description: resposne?.message
                  });
                }, 2000);
              } else {
                setLoading(false);
                toast({
                  title: "Something went wrong!",
                  description: resposne?.message
              });
              }
            })
            .catch((err) => {
                toast({
                    title: "Something went wrong!!",
                    description: res?.message
                });
            });
      } else {
        setLoading(false);
        toast({
          title: "Something went wrong!!",
          description: res?.message,
        });
      }
    });
  };
  const sidebarNavItems = [
    { title: "Privacy Policy", href: "/content/privacy_policy", id: "privacy_policy" },
    { title: "Terms & Conditions", href: "/content/terms_and_conditions", id: "terms_and_conditions" },
  ];
  return (
    <>
      <ContentLayout title={titleCase(id)}>
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
                <Link href={`/content/${id}`}>{ sidebarNavItems.find((item: any) => item.id == id)?.title || "Default Title"}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="pt-8"></div>

        {circleLoader ? (
          <div className="flex justify-center items-center p-20 h-[calc(100vh_-_182px)]">
            <Loader2 className="my-28 dark:text-white h-[100px] w-[100px] text-primary animate-spin" />
          </div>
        ) :
         !value ? (
          <div className="flex flex-col justify-center items-center p-20 h-[calc(100vh_-_182px)]">
            <Image
              src="/no-data.svg"
              alt="Logo"
              width={320}
              height={320}
              priority
              className="size-[150px]"
            />
             <span className="font-semibold text-lg">No Record Found</span>
          </div>
        ) : 
        (
          <div>
            {showEditor && (
              <>
                <JoditEditor
                  ref={editor}
                  value={value}
                  config={config}
                  onBlur={(newContent) => setValue(newContent)}
                  onChange={(newContent) => {}}
                />

                <Separator className="my-2" />
                <div className="text-end w-full">
                  <Button
                    disabled={loading}
                    className="w-32"
                    onClick={() => submitEditors()}
                  >
                    {loading ? <Spinner size="small" /> : "Update"}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </ContentLayout>
    </>
  );
};

export default ContentEditorPage;
