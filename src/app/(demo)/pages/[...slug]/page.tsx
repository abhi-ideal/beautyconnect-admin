"use client";
import React, { useMemo, useRef } from "react";
import JoditEditor from 'jodit-react';
import { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import Content from "@/api/content";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

const ContentEditorPage = ({ params }: any) => {
    const { toast } = useToast();
    const router = useRouter();
    const { updateContent, getContentFiles, invalidate } =
        Content();
    const routers:any = useSearchParams();
    const id = params.slug[0];
    const lang =  routers.get('lang');
    const [value, setValue]: any = useState("");
    const [loading, setLoading]: any = useState(false);
    const editor = useRef(null);
	const config = useMemo(() => ({
		readonly: false,
		placeholder: 'Start typings...'
	}), []);

    useEffect(() => {
        getData(id);
    }, [id, lang]);

    const getData = async (id:any) => {
        await getContentFiles(id).then((res: any) => {
            if (!res?.error) {
                const data = res?.response1?.text;
                setValue(data);
                setLoading(true);
            }else{
                setValue("");
                setLoading(true);
            }
        });
    };

    const submitEditors = async () => {
        const contentData = {
            text: value
        };
        await updateContent(contentData, id).then(async (res: any) => {
            if (!res?.error) {
                await invalidate(id,lang)
                    .then((resposne: any) => {
                        router.push("/pages");
                        toast({
                            title: "Update Content successfully",
                            description: resposne?.message
                        });
                    })
                    .catch((err) => {
                        toast({
                            title: "Something went wrong!!",
                            description: res?.message
                        });
                    });
            }
        });
    };
    return (
        <>
            <div className="pt-8"></div>
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
                            <BreadcrumbLink asChild>
                                <Link href="/pages">content</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="pt-8"></div>
                {loading && (
                    <JoditEditor ref={editor} value={value} config={config} onBlur={(newContent) => setValue(newContent)} onChange={(newContent)=>{}} />
                )}
                <div className="pt-8"></div>
                {loading && <Button onClick={() => submitEditors()}>Update</Button>}
            </ContentLayout>
        </>
    );
};

export default ContentEditorPage;
