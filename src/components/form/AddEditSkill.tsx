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
import SkillsApi from "@/api/skills";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { formatName } from "@/lib/utils";
import ImageApi from "@/api/imageApi";
import { Progress } from "../ui/progress";
import { Spinner } from "../ui/spinner";

const formSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required." }),
  Image: z.string().trim().min(1, { message: "Image is required." }),
  Icon: z.string().trim().min(1, { message: "Icon is required." }),
  // description: z
  //     .string()
  //     .min(3, { message: "Description must be at least 3 characters." })
});

const AddEditSkill = (props: any) => {
  const { setOpen, type, editData, setEditData, setAllSkills, allSkills }: any =
    props?.props;
  const { addSkills, updateSkills }: any = SkillsApi();
  const { getPresignedPostData, uploadFileToS3 } = ImageApi();
  const { toast } = useToast();
  const [showUploadImage, setShowUploadImage]: any = useState({});
  const [showUploadIcon, setShowUploadIcon]: any = useState({});
  
  const [progress, setProgress]: any = React.useState();
  const [progressIcon, setProgressIcon]: any = React.useState();
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const imageHaveType = ["jpg", "jpeg", "png"];

  const [formValues, setFormValues]: any = useState({
    title: editData?.title ? editData?.title : "",
    Image: editData?.image ? editData?.image : "",
    Icon: editData?.icon ? editData?.icon : "",
    // description: editData?.description ? editData?.description : ""
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
    "icon" : values.Icon,
    "image": {
        "mimeType": showUploadImage.mimeType,
        "path": values?.Image,
        "ratio": showUploadImage.ratio,
        "type": showUploadImage.type,
    },
  }

    if (type == "Edit") {
      const payload = {
          ...(editData?.title != values?.title && { "title": values?.title }),
          ...(editData?.image != values?.Image && { "image": body?.image }),
          ...(editData?.icon != values?.Icon && { "icon": body?.icon })
      }
      const length = Object.keys(payload).length;
      if (length>0){
      await updateSkills(payload, editData?.id).then((response: any) => {
          if (!response?.error) {
              const updatedSkills = allSkills?.results?.map(
                  (res: any) => {
                      if (editData?.id == res?.id) {
                          payload?.title && (res.title = payload?.title);
                          payload?.image && (res.image = 'skills/'+payload?.image?.path);
                          payload?.icon && (res.icon = 'skills/'+payload?.icon);
                          //   payload?.description && (res.description = payload?.description);
                        return res;
                      } else {
                          return res;
                      }
                  }
              );
              setAllSkills({
                  ...allSkills,
                  results: updatedSkills
              });
              setOpen(false);
              toast({
                  title: "Update Specialization successfully.",
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
      await addSkills(body).then((res: any) => {
        if (!res?.error) {
          const newSkills = {
            id: res?.id,
            title: values?.title,
            image: "skills/"+values?.Image,
            icon: "skills/"+values?.Icon,
            status: "active",
            createdAt: new Date(),
          };
          setAllSkills({
            ...allSkills,
            results: [newSkills, ...(allSkills?.results || [])],
          });
          setOpen(false);
          toast({
            title: "Add Specialization successfully.",
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

  // function is to select image.
  const selectFile = async (event: any, type:any) => {

    const img = new Image();
    let fileRatio: any;
    img.onload = () => {
      fileRatio = img.width + "x" + img.height;
    };
    img.src = URL.createObjectURL(event.target.files[0]);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      type == "icon" ?  setProgressIcon(10) :  setProgress(10);
    
      if (imageHaveType.includes(selectedFile?.name.split(".").pop())) {
        type == "icon" ?  setProgressIcon(30) :  setProgress(30);
        const epochNow = new Date().getTime();
        const randomFileName =
          "dev-3U-" + epochNow + "." + selectedFile.name.split(".").pop();
        const sendData: any = {
          randomFileName: randomFileName,
          fileType: selectedFile?.type,
        };
        await getPresignedPostData(sendData).then(async (data: any) => {
          type == "icon" ?  setProgressIcon(60) :  setProgress(60);
          if (data) {
            type == "icon" ?  setProgressIcon(80) :  setProgress(80);
            await uploadFileToS3(data, selectedFile).then(() => {
              const mimeType = selectedFile?.type;
              const content = {
                mimeType: mimeType,
                path: previewImgUrl + "temp/" + randomFileName,
                ratio: fileRatio ? fileRatio : "50x50",
                type: mimeType?.split("/")[0],
              };
              type == "icon" ?  form.setValue("Icon", randomFileName) :    form.setValue("Image", randomFileName);
              type == "icon" ? setShowUploadIcon(content) :  setShowUploadImage(content);
              type == "icon" ?  setProgressIcon(100) :  setProgress(100);
              toast({ title: "Upload Image successfully." });
            });
          }
        });
      } else {
        type == "icon" ?  setProgressIcon(0) :  setProgress(0);
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
<div className="flex justify-between" >
            {/* Image */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="Image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <div className="relative w-20 h-20">
                        <Avatar className="w-20 h-20 border border-gray-700">
                          <AvatarImage
                            src={
                              showUploadImage?.path
                                ? showUploadImage?.path
                                : previewImgUrl+ editData?.image
                            }
                            alt="Specialization Image"
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
                          onChange={(e)=> selectFile(e,"image")}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            {progress && <Progress value={progress} className="w-[100%]" />}
            </div>






            {/* Icon */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="Icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <div className="relative w-20 h-20">
                        <Avatar className="w-20 h-20 border border-gray-700">
                          <AvatarImage
                            src={
                              showUploadIcon?.path
                                ? showUploadIcon?.path
                                : previewImgUrl+ editData?.icon
                            }
                            alt="Specialization Image"
                          />
                          <AvatarFallback className="bg-[#FFC1BB]" >
                            Icon
                          </AvatarFallback>
                        </Avatar>
                        <label
                          htmlFor="icon-upload"
                          className={`absolute bottom-0 right-0 p-1 bg-white dark:bg-black rounded-full cursor-pointer`}
                        >
                          <Camera className="w-5 h-5" />
                        </label>
                        <input
                          id="icon-upload"
                          type="file"
                          accept="image/jpg,image/png,image/jpeg"
                          className="hidden"
                          onChange={(e)=> selectFile(e,"icon")}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            {progressIcon && <Progress value={progressIcon} className="w-[100%]" />}
            </div>

            </div>





            {/* 
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div> */}

            <div className="flex justify-end">
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="w-full sm:w-auto min-w-[150px]"
              >
                {form.formState.isSubmitting ? (
                  <Spinner size="small" />
                ) : (
                  `${type == "Edit" ? "Edit" : "Add"} Specialization`
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AddEditSkill;
