import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { Camera, Loader2, X } from 'lucide-react';
import { useTheme } from "next-themes";
import { TimePickerDemo } from "../ui/time-picker-demo";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { cn, formatName, titleCase } from '@/lib/utils';
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
import SkillsApi from "@/api/skills";
import { Spinner } from "../ui/spinner";

import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const formSchema = z.object({
  title: z
    .string().trim().min(1, { message: "Title is required." }),
  description: z
    .string().trim().min(1, { message: "Description is required." }),
  courseFor: z
    .string().trim().min(1, { message: "Course is for required." }),
  learn: z
    .string().trim().min(1, { message: "Learn is required." }),
  category: z
    .string().trim().min(1, { message: "Specialization is required." }),
  experience: z
    .string().trim().min(1, { message: "Experience is required." }),
  amount: z
    .number({ required_error: "required field", invalid_type_error: "Price is required" })
    .positive(),
  coverImage: z
    .string().trim().min(1, { message: "Image is required." }),
});

const AddEditCourse = (props: any) => {
  const { theme } = useTheme();
  const { getPresignedPostData, uploadFileToS3 } = ImageApi();
  const { skillList } = SkillsApi();
    const [loading, setLoading]: any = useState(false);

  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const previewTempImgUrl = process.env.NEXT_PUBLIC_PREVIEW_TEMP_IMG_URL;

  const [progress, setProgress]:any = React.useState()
  const { setOpen, type, editData, setEditData, setAllCourses, allCourses }: any = props?.props;
  const {addCourse, updateCourse} = CourseApi();
  const [skillListInfo, setSkillListInfo]: any = useState([]);
  const { toast } = useToast();
  const [imageContent, setImageContent]: any = useState([]);


  const editor = useRef(null);
  const courseConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Enter course is for...',
    theme: "custom",
    style: {
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      color: theme === "dark" ? "#e5e5e5" : "#000000",
    },
  }), [theme]);

  const learnConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Enter What You learn...',
    theme: "custom",
    style: {
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      color: theme === "dark" ? "#e5e5e5" : "#000000",
    },
  }), [theme]);


  const [formValues, setFormValues] :any = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    courseFor: editData?.courseFor || "",
    learn: editData?.learn || "",
    category: editData?.category?.split(",")[0] || "",
    amount: editData?.amount || "",
    coverImage: editData?.media || "",
    experience: editData?.experience || "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues
  });

  useEffect(() => {
    getSkillsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


// console.log('editData', editData);

// console.log('allCourse', allCourses);

  useEffect(() => {
    form.reset(formValues);
  }, [formValues, form]);



  const getSkillsList = async () => {
    setLoading(true);
    await skillList().then((res: any) => {
      if (!res.error) {
       setSkillListInfo(res.results);
       setLoading(false);
      } else {
        setLoading(false);
        setSkillListInfo([]);
      }
    });
  };






  async function onSubmit(values: z.infer<typeof formSchema>) {

    console.log('values', values);
    
    if(type == "Edit"){
      const payload = {
        ...(editData?.title != values?.title && { "title": values?.title }),
        ...(editData?.description != values?.description && { "description": values?.description }),
        ...(editData?.courseFor != values?.courseFor && { "courseFor": values?.courseFor }),
        ...(editData?.learn != values?.learn && { "learn": values?.learn }),
        ...(editData?.category != values?.category && { "category": values?.category }),
        ...(editData?.amount != values?.amount && { "amount": values?.amount }),
        ...(editData?.experience != values?.experience && { "experience": values?.experience }),
        ...(editData?.media != values?.coverImage && { "coverImage": values?.coverImage }),
    }
    const length = Object.keys(payload).length;
    if (length>0){
      await updateCourse(payload, editData?.id).then((response: any) => {
        if (!response?.error) {
          const updatedCourse = allCourses?.results?.map(
            (res: any) => {
              if (editData?.id == res?.id) {
                payload?.title && (res.title = payload?.title);
                payload?.description && (res.description = payload?.description);
                payload?.courseFor && (res.courseFor = payload?.courseFor);
                payload?.learn && (res.learn = payload?.learn);
                payload?.category && (res.category = payload?.category);
                payload?.amount && (res.amount = payload?.amount);
                payload?.experience && (res.experience = payload?.experience);
                payload?.coverImage && (res.media = payload?.coverImage);
                return res;
              } else {
                return res;
              }
            }
          );
          setAllCourses({
            ...allCourses,
            results: updatedCourse
          });
          setOpen(false);
          toast({
            title: "Update Course successfully",
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
    }else{
     await addCourse(values).then((res: any) => {
        if (!res?.error) {
          const newCourse = {
            id: res?.id,
            title: values.title,
            description: values.description,
            courseFor: values.courseFor,
            learn: values.learn,
            category: values.category,
            amount: values.amount,
            experience:values.experience,
            media: "course/" + values.coverImage,
            status: "active",
            createdAt: new Date(),
          }

          setAllCourses({
            ...allCourses,
            results: [newCourse, ...(allCourses?.results || [])]
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
              path: previewTempImgUrl + "public/" + randomFileName,
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


return (
  <div className="relative max-w-8xl mx-auto">
    {loading && (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70">
        <Loader2 className="h-[100px] w-[100px] text-primary dark:text-white animate-spin" />
      </div>
    )}

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 max-h-[calc(100vh_-_226px)] overflow-auto px-2">
        {/* Image at the top */}
        <div className="flex justify-start mb-4">
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative w-20 h-20">
                    <Avatar className="w-full h-full rounded-full border border-gray-700">
                      <AvatarImage
                        src={imageContent?.length ? imageContent[0]?.path : previewImgUrl + editData?.media}
                        alt="Cover Image"
                        className="object-cover rounded-full"
                      />
                      <AvatarFallback className="rounded-full bg-[#FFC1BB]">Image</AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="image-upload"
                      className="absolute bottom-0 right-0 p-1 bg-white dark:bg-black rounded-full cursor-pointer shadow-sm"
                    >
                      <Camera className="w-4 h-4" />
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
        {progress > 0 && <Progress value={progress} className="w-[12%]" />}
          {/* Two fields in a row */}
          <div className="grid grid-cols-2 gap-4">
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

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specializations</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Specialization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {skillListInfo?.map((info:any, i:number) => (
                          <SelectItem key={i} value={info?.id?.toString()}>
                            {info?.title ? titleCase(info?.title?.trim()) : "N/A"}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

                    {/* Two fields in a row */}
                    <div className="grid grid-cols-2 gap-4">
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

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseFor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course is for</FormLabel>
                <FormControl>
                  {/* <Textarea placeholder="Enter course is for" {...field} /> */}
                  {<JoditEditor ref={editor} value={formValues?.courseFor} config={courseConfig} onBlur={field?.onChange} onChange={(newContent) => { }} />}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="learn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What You'll Learn</FormLabel>
                <FormControl>
                  {/* <Textarea placeholder="Enter what You'll learn" {...field} /> */}
                  {<JoditEditor ref={editor} value={formValues?.learn} config={learnConfig} onBlur={field?.onChange} onChange={(newContent) => { }} />}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <div className="flex justify-end">
          <Button type="submit" className="w-full sm:w-auto min-w-[150px]" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Spinner size="small" /> : `${type === "Edit" ? "Edit" : "Add"} Course`}
          </Button>
        </div>
      </form>
    </Form>
  </div>
)
}

export default AddEditCourse
