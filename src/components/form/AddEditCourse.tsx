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
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import CourseApi from "@/api/courseApi";
import LocationModel from "../demo/LocationModel";
import { Textarea } from "../ui/textarea";
import { Progress } from "@/components/ui/progress"
import ImageApi from "@/api/imageApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, X } from 'lucide-react';
import { useTheme } from "next-themes";
import { TimePickerDemo } from "../ui/time-picker-demo";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { cn, formatName } from '@/lib/utils';
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  title: z
    .string().trim().min(1, { message: "Title is required." }),
  description: z
    .string().trim().min(1, { message: "Description is required." }),
  category: z
    .string().trim().min(1, { message: "Category is required." }),
  experience: z
    .string().trim().min(1, { message: "Category is required." }),
  amount: z
    .number({ required_error: "required field", invalid_type_error: "Price is required" })
    .positive(),
  coverImage: z
    .string().trim().min(1, { message: "Cover image is required." }),
});

const AddEditCourse = (props: any) => {
  const { theme } = useTheme();
  const { getPresignedPostData, uploadFileToS3 } = ImageApi();
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const [progress, setProgress]:any = React.useState()
  const { setOpen, type, editData, setEditData, setAllCourse, allCourse }: any = props?.props;
  const {addCourse, updateCourses,  coursesDetail } = CourseApi();
  useEffect(() => {
    type == "Edit" && getCourseDetaits(editData?.id);
  }, [editData?.id]);

  const { toast } = useToast();
  const [imageContent, setImageContent]: any = useState( editData?.media ? editData?.media : []);
  const [formValues, setFormValues] :any = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    category: editData?.category || "",
    amount: editData?.price || null,
    coverImage: editData?.coverImage || "",
    experience: editData?.experience || "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues
  });

  useEffect(() => {
    form.reset(formValues);
  }, [formValues, form]);

  const getCourseDetaits = async (id: any) => {
    await coursesDetail(id).then((res: any) => {
      if (!res.error) {
        const enResCourse = res?.result?.courseContent?.find((content:any) => content?.language === "en");
        const itResCourse = res?.result?.courseContent?.find((content:any) => content?.language === "it");
        setFormValues((prev: any) => ({
          ...prev,
          enDescription: enResCourse?.description ? enResCourse?.description : "",
          itDescription: itResCourse?.description ? itResCourse?.description : ""
        }));
      } else {
        // setCourseInfo({})
        toast({
          title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
          variant: "destructive", description: res?.error
        });
      }
    })
  }


  async function onSubmit(values: z.infer<typeof formSchema>) {

console.log('values', values);

console.log('imageContent', imageContent);
    const body:any = {

    }

    if(type == "Edit"){
      // const filteredMedia = imageContent.filter((image2:any) =>
      //   !editData?.media.some((image1:any) => image1.path === image2.path)
      // );
      // const payload={
      //   ...(body?.courseContent && { "courseContent" : body?.courseContent }),
      //   ...(body?.media && { "media": filteredMedia }),
      //   ...(deleteContent?.length && { "deleteMedia": deleteContent}),
      //   ...(editData?.courseDate != body?.courseDate && {"courseDate": body?.courseDate}),
      //   ...(editData?.price != body?.price && {"price": body?.price}),
      //   ...(editData?.address?.latitude != body?.address?.latitude && {"address": body?.address}),
      // }
      // await updateCourses(payload, editData?.id).then((response: any) => {
      //   if (!response?.error) {
      //     const updatedCourse = allCourse?.results?.map(
      //       (res: any) => {
      //         if (editData?.id == res?.id) {
      //           payload?.media && (res.media = body?.media);
      //           payload?.courseContent && (res.courseContent = payload?.courseContent);
      //           payload?.courseDate && (res.courseDate = payload?.courseDate);
      //           payload?.price && (res.price = payload?.price);
      //           payload?.address && (res.address = payload?.address);
      //           return res;
      //         } else {
      //           return res;
      //         }
      //       }
      //     );
      //     setAllCourse({
      //       ...allCourse,
      //       results: updatedCourse
      //     });
      //     setOpen(false);
      //     toast({
      //       title: "Update Course successfully",
      //       description: response?.message
      //     });
      //   } else {
      //     toast({
      //       variant: "destructive",
      //       title: response?.errorMessage ? response?.errorMessage : "Uh oh! Something went wrong.",
      //       description: response?.error
      //     });
      //   }
      // })
    }else{
     await addCourse(body).then((res: any) => {
        if (!res?.error) {
          const newCourse = {
            id: res?.id,
            title: values.title,
            description: values.description,
            amount: values.amount,
            media: "course/"+values.coverImage,
            status: "active",
            createdAt: new Date(),
          }

          setAllCourse({
            ...allCourse,
            results: [newCourse, ...(allCourse?.results || [])]
          });
          setOpen(false);
          toast({
            title: "Add Course successfully.",
            description: res?.message
          });
        } else {
          toast({
            variant: "destructive",
            title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
            description: res?.error
          });
        }
      });
    }
  }


// function is to select image.
const selectFile = async (event:any) => {
  const img = new Image();
  let imageRatio: any
  img.onload = () => { imageRatio = (img.width + 'x' + img.height) }
  img.src = URL.createObjectURL(event.target.files[0]);
  const video: any = document.createElement('video');
  video.addEventListener('loadedmetadata', () => {
      imageRatio = (video.videoWidth + 'x' + video.videoHeight);
  });
  video.src = URL.createObjectURL(event.target.files[0]);

  const selectedFile = event.target.files[0];
  if (selectedFile) {
    setProgress(10);
    if (selectedFile) {
      setProgress(30);
      const epochNow = new Date().getTime();
      const randomFileName =
        'dev-3U-' + epochNow + '.' + selectedFile.name.split('.').pop();
      const sendData: any = {
        randomFileName: randomFileName,
        fileType: selectedFile?.type,
      };
  await getPresignedPostData(sendData).then(async(data: any) =>{
    setProgress(60);
    if(data){
      setProgress(80);
      await uploadFileToS3(data, selectedFile ).then(() =>{

        const mimeType = selectedFile?.type;
        // setImageContent((prev: any) => ([
        //   ...prev,
        //   {
        //       mimeType: mimeType,
        //       path: randomFileName,
        //       ratio: imageRatio ? imageRatio : "50x50",
        //       poster: "",
        //       type: mimeType?.split("/")[0]
        //   }
        // ]));

        const content = {
              mimeType: mimeType,
              path: previewImgUrl + "temp/" + randomFileName,
              ratio: imageRatio ? imageRatio : "50x50",
              poster: "",
              type: mimeType?.split("/")[0]
          }
        setImageContent([content])
        form.setValue("coverImage", randomFileName);
        setProgress(100);
        toast({title: "Upload Image successfully."});
      })
    }
  })

} else {
  setProgress(0)
  toast({title: "Please select image as have type jpg, jpeg or png."});
  }
}
};

// const removeContent=(image:any, type:string)=>{
//   let update:any = imageContent.map((img:any)=>img.path!=image.path);
//   setImageContent(update);
//   setDeleteContent((prev: any) => ([...prev,image]));
// }


  return (
    <>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4 max-h-[calc(100vh_-_226px)] overflow-auto px-2">

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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <div className="space-y-2">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                    <Input placeholder="Enter experience" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>




            <div className="space-y-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter your price" {...field} onChange={(e) => { field.onChange(Number(e.target.value));}}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


                    <div className="space-y-2">
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="deleted">Deleted</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              <div className="space-y-2 min-w-full">
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <div className="relative w-20 h-20">
                      <Avatar className="w-20 h-20 border border-gray-700">
                        <AvatarImage
                          src={imageContent ? imageContent?.[0]?.path :  editData?.userGallery?.[0]?.image}
                          alt="Cover Image"
                        />
                        <AvatarFallback>
                          {formatName("cover image")}
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="image-upload"
                        className={`absolute bottom-0 right-0 p-1 dark:bg-black bg-white rounded-full cursor-pointer`}
                      >
                        <Camera className="w-5 h-5" />
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/jpg,image/png,image/jpeg"
                        className="hidden"
                        onChange={selectFile}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
            {/* <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Upload Image</label>
            <div className="relative size-[70px] border rounded">
              <label htmlFor="image-upload" className={`absolute inset-0 m-auto size-5 ${theme =='dark' ? 'bg-black' : 'bg-white'} rounded-full cursor-pointer`}>
                <Camera className="w-5 h-5" />
              </label>
              <input id="image-upload" type="file" className="hidden" onChange={selectFile} />
            </div>
            </div>
            <div className="flex flex-wrap overflow-auto gap-3">
              { !imageContent?.length ? "" :
                imageContent?.map((image:any, i:number)=>{
                  return (
                    <div className="relative  w-20 h-20" key={i}>
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={image?.path ? (image?.path?.includes('course') ? previewImgUrl+image?.path : previewImgUrl+'temp/'+image?.path) : ""} />
                        <AvatarFallback>Image</AvatarFallback>
                      </Avatar>
                      <label className={`absolute bottom-0 right-0 p-1 ${theme =='dark' ? 'bg-black' : 'bg-white'} rounded-full cursor-pointer`} onClick={()=>removeContent(image, type)}>
                        <X className="w-5 h-5" />
                      </label>
                    </div>
                  )
                })
              }
            </div> */}
            {  progress && <Progress value={progress} className="w-[15%]" /> }

          </div>
            <div className="flex justify-end">
              <Button type="submit" className="w-full sm:w-auto">
                {type ? type : "Add"} Course
              </Button>
            </div>
        </form>
      </Form>
    </>
  )
}

export default AddEditCourse
