 import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { formatName } from "@/lib/utils";
import ImageApi from "@/api/imageApi";
import { Progress } from "../ui/progress";
import { Spinner } from "../ui/spinner";
import CourseCategoryApi from "@/api/courseCategory";
import { log } from "console";

const formSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required." }),
  Image: z.string().trim().min(1, { message: "Image is required." }),
  
});

const AddEditCoursecategory = (props: any) => {
  const { setOpen, type, editData, setEditData, setAllCourseCategory, allCourseCategory }: any =
    props?.props;
  const { addCourseCategory, updateCourseCategory }: any = CourseCategoryApi();
  const { getPresignedPostData, uploadFileToS3 } = ImageApi();
  const { toast } = useToast();
  const [showUploadImage, setShowUploadImage]: any = useState({});
  
  const [progress, setProgress]: any = React.useState();
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const previewTempImgUrl = process.env.NEXT_PUBLIC_PREVIEW_TEMP_IMG_URL;

  const imageHaveType = ["jpg", "jpeg", "png"];

  const [formValues, setFormValues]: any = useState({
    title: editData?.title ? editData?.title : "",
    Image: editData?.image ? editData?.image : "", 
  });

 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues,
  });

  useEffect(() => {
    form.reset(formValues);
  }, [formValues, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) { 
    const body = {
      "title": values.title,
      "image": {
        "mimeType": showUploadImage.mimeType,
        "path": values?.Image,
        "ratio": showUploadImage.ratio,
        "type": showUploadImage.type,
        
      },
      'type' :"course"
    }; 
    if (type == "Edit") {
      const payload = {
        ...(editData?.title != values?.title && { "title": values?.title }),
        ...(editData?.image != values?.Image && { "image": body?.image }),
      };
      const length = Object.keys(payload).length;
      if (length > 0) {
        await updateCourseCategory(payload, editData?.id).then((response: any) => {
          if (!response?.error) {
            const updatedCourseCategory = allCourseCategory?.results?.map(
              (res: any) => {
                if (editData?.id == res?.id) {
                  payload?.title && (res.title = payload?.title);
                  payload?.image && (res.image = 'skills/' + payload?.image?.path);
                  return res;
                } else {
                  return res;
                }
              }
            );
            setAllCourseCategory({
              ...allCourseCategory,
              results: updatedCourseCategory
            });
            setOpen(false);
            toast({
              title: "Update Course-Category successfully.",
              description: response?.message
            });
          } else {
            toast({
              variant: "destructive",
              title: response?.errorMessage ? response?.errorMessage : "Uh oh! Something went wrong.",
              description: response?.error
            });
          }
        })
      }
    } else {
      await addCourseCategory(body).then((res: any) => {
        if (!res?.error) {
          const newCourseCategory = {
            id: res?.id,
            title: values?.title,
            image: "courseCategory/" + values?.Image,
            status: "active",
            createdAt: new Date(),
          };
          console.log("newCourseCategory",newCourseCategory);
          
          setAllCourseCategory({
            ...allCourseCategory,
            results: [newCourseCategory, ...(allCourseCategory?.results || [])],
          });
          setOpen(false);
          toast({
            title: "Add Course-Category successfully.",
            description: res?.message,
          });
        } else {
          toast({
            variant: "destructive",
            title: res?.errorMessage
              ? res?.errorMessage
              : "Uh oh! Something went wrong.",
            description: res?.error,
          });
        }
      });
    } 
  }
 
  const selectFile = async (event: any) => {
    const img = new Image();
    let fileRatio: any;
    img.onload = () => {
      fileRatio = img.width + "x" + img.height;
    };
    img.src = URL.createObjectURL(event.target.files[0]);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setProgress(10);
    
      if (imageHaveType.includes(selectedFile?.name.split(".").pop())) {
        setProgress(30);
        const epochNow = new Date().getTime();
        const randomFileName =
          "dev-3U-" + epochNow + "." + selectedFile.name.split(".").pop();
        const sendData: any = {
          randomFileName: randomFileName,
          fileType: selectedFile?.type,
        };
        await getPresignedPostData(sendData).then(async (data: any) => {
          setProgress(60);
          if (data) {
            setProgress(80);
            await uploadFileToS3(data, selectedFile).then(() => {
              const mimeType = selectedFile?.type;
              const content = {
                mimeType: mimeType,
                path: previewTempImgUrl + "public/" + randomFileName,
                ratio: fileRatio ? fileRatio : "50x50",
                type: mimeType?.split("/")[0],
              };
              form.setValue("Image", randomFileName);
              setShowUploadImage(content);
              setProgress(100);
              toast({ title: "Upload Image successfully." });
            });
          }
        });
      } else {
        setProgress(0);
        toast({ title: "Please select image as have type jpg, jpeg or png." });
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="Image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <div className="relative w-20 h-20">
                        <Avatar className="w-20 h-20 border border-border">
                          <AvatarImage
                            src={
                              showUploadImage?.path
                                ? showUploadImage?.path
                                : previewImgUrl + editData?.image
                            }
                            alt="CourseCategory Image"
                          />
                          <AvatarFallback className="bg-[#FFC1BB]" >
                            Image
                          </AvatarFallback>
                        </Avatar>
                        <label
                          htmlFor="image-upload"
                          className={`absolute bottom-0 right-0 p-1 bg-white dark:bg-black rounded-full cursor-pointer`}
                        >
                          <Camera className="w-5 h-5" />
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/jpg,image/png,image/jpeg"
                          className="hidden"
                          onChange={(e) => selectFile(e)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            {progress && <Progress value={progress} className="w-[20%]" />}
            </div>

            <div className="flex justify-end">
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="w-full sm:w-auto min-w-[150px]"
              >
                {form.formState.isSubmitting ? (
                  <Spinner size="small" />
                ) : (
                  `${type == "Edit" ? "Edit" : "Add"} Course Category `
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AddEditCoursecategory;
