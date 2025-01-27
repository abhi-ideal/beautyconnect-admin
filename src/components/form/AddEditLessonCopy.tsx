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
import { Progress } from "@/components/ui/progress"
import ImageApi from "@/api/imageApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, SquarePlay, UploadCloud, X } from 'lucide-react';
import { useTheme } from "next-themes";
import { Spinner } from "../ui/spinner";
import LessonApi from "@/api/lessonApi";
import Image from 'next/image'
import { CardHeader, Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const formSchema = z.object({
  title: z
    .string().trim().min(1, { message: "Title is required." }),
  image: z
    .string().trim().min(1, { message: "Image is required." }),
});

const AddEditLesson = (props: any) => {
  const { theme } = useTheme();
  const { getPresignedPostData, uploadFileToS3 } = ImageApi();
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const previewTempImgUrl = process.env.NEXT_PUBLIC_PREVIEW_TEMP_IMG_URL;

  const [progress, setProgress]:any = React.useState()
  const [loading, setLoading]: any = useState(false);
  const [deleteContent, setDeleteContent]: any = useState([]);
  const { courseId, setOpen, type, editData, setEditData, allLessons, setAllLessons }: any = props?.props;
  const {addLesson, updateLesson } = LessonApi();
  const imageHaveType = ["jpg", "jpeg", "png", "mp4", "pdf"];
  const { toast } = useToast();
  const [imageContent, setImageContent]: any = useState(null);
  const [fileContents, setFileContents]: any = useState( editData?.lessonContentInfo?.length ? editData?.lessonContentInfo :  []);
  const [formValues, setFormValues] :any = useState({
    title: editData?.title || "",
    image: editData?.image?.imageUrl || "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues
  });


// console.log('editData', editData);

// console.log('imageContent', imageContent);


// console.log('fileContents', fileContents);

  useEffect(() => {

  }, [editData?.id]);

  useEffect(() => {
    form.reset(formValues);
  }, [formValues, form]);




  async function onSubmit(values: z.infer<typeof formSchema>) {
    const body:any =  {
        title: values?.title,
        image:  values?.image,
        courseId: courseId,
        lessonContent: fileContents
    }
     
    if(type == "edit"){
      // Filter new contents
      const filterContents = fileContents.filter((file: any) => {
        const isExistingContent = editData?.lessonContentInfo.some(
          (existing: any) => existing.id === file.id
        );
        return !isExistingContent; 
      });

      const payload={
        ...(editData?.title != values?.title && { "title": values?.title }),
        ...(editData?.image?.imageUrl != values?.image && { "image": values?.image }),
        ...(filterContents?.length && { "lessonContents": filterContents }),
        ...(deleteContent?.length && { "deleteData": [{"lessonContents": deleteContent}]}),
      }

      const length = Object.keys(payload).length;
      if (length>0){

      await updateLesson(payload, editData?.id).then((response: any) => {
        if (!response?.error) {
          const updatedLessons = allLessons?.results?.map(
            (res: any) => {
              if (editData?.id == res?.id) {
                payload?.title && (res.title = payload?.title);
                payload?.image && (res.image = {fileType: "image",imageUrl: "lesson/"+payload?.image,});
                payload?.lessonContents && (res.lessonContentInfo = fileContents);
                return res;
              } else {
                return res;
              }
            }
          );
          setAllLessons({
            ...allLessons,
            results: updatedLessons
          });

            setEditData({});
          setOpen(false);
          toast({
            title: "Update Lesson successfully.",
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
     await addLesson(body).then((res: any) => {
        if (!res?.error) {
          const newLesson = {
            id: res?.id,
            title: values.title,
            image: {
              fileType: "image",
              imageUrl: "lesson/"+values.image,
          },
          lessonContentInfo: fileContents,
            status: "active",
            createdAt: new Date(),
          }
          setAllLessons({
            ...allLessons,
            results: [newLesson, ...(allLessons?.results || [])]
          });
          setOpen(false);
          toast({
            title: "Add Lesson successfully.",
            description: res?.message
          });
        } else {
          toast({
            variant: "destructive",
            title: res?.errorMessage || "Uh oh! Something went wrong.",
            description: res?.error
          });
        }
      });
    }
  }


// function is to select image.
const selectFile = async (event:any, type:any) => {
  const imgElement = new globalThis.Image();
  let imageRatio: any
  imgElement.onload = () => { imageRatio = (imgElement.width + 'x' + imgElement.height) }
  imgElement.src = URL.createObjectURL(event.target.files[0]);
  const video: any = document.createElement('video');
  video.addEventListener('loadedmetadata', () => {
      imageRatio = (video.videoWidth + 'x' + video.videoHeight);
  });
  video.src = URL.createObjectURL(event.target.files[0]);

  const selectedFile = event.target.files[0];

  if (selectedFile) {
    type == "file" ? setLoading(true) : setProgress(10);
    if (imageHaveType.includes(selectedFile?.name.split(".").pop())) {
      type == "file" ? setLoading(true) : setProgress(30);
      const epochNow = new Date().getTime();
      const randomFileName =
        'dev-3U-' + epochNow + '.' + selectedFile.name.split('.').pop();
      const sendData: any = {
        randomFileName: randomFileName,
        fileType: selectedFile?.type,
      };      
  await getPresignedPostData(sendData).then(async(data: any) =>{
    type == "file" ? setLoading(true) : setProgress(60);
    if(data){
      type == "file" ? setLoading(true) : setProgress(80);
      await uploadFileToS3(data, selectedFile ).then(() =>{

        const mimeType = selectedFile?.type;
        if (type == "file"){
          setFileContents((prev: any) => ([
            ...prev,
            {
                mimeType: mimeType,
                file: randomFileName,
                ratio: imageRatio ? imageRatio : "50x50",
                poster: "",
                type: mimeType?.split("/")[0]
            }
          ]));
          setLoading(false) 
        } else {
          const content = {
            mimeType: mimeType,
            path:  randomFileName,
            ratio: imageRatio ? imageRatio : "50x50",
            poster: "",
            type: mimeType?.split("/")[0]
        }
      setImageContent(content)
      form.setValue("image", randomFileName);
      setProgress(100);
        }

        toast({title: "Upload File successfully."});
      })
    }else {
      setProgress(0)
      setLoading(false) 
      toast({
        variant: "destructive",
        title: data?.errorMessage || "Uh oh! Something went wrong in uploading.",
        description: data?.error
      });
    }
  })

} else {
  setLoading(false) 
  setProgress(0)
  toast({title: "Please select image as have type jpg, jpeg or png."});
  }
}
};



// Function for removing file content.
const removeContent = (fileContent: any, index: number) => {
  // Remove file from `fileContents`
  setFileContents((prevContents: any[]) => 
    prevContents.filter((_, i) => i !== index)
  );

  // Add to `deleteContent` if in edit mode
  if (type === "edit") {
    editData?.lessonContentInfo.forEach((data: any) => {
      if (data.id === fileContent?.id) {
        setDeleteContent((prev: any[]) => [...prev, fileContent?.id]);
      }
    });
  }
};


return (
  <div className="max-w-2xl mx-auto p-4">
    <Card className="w-full">
      <CardHeader>
        {/* <CardTitle>{type === "edit" ? "Edit" : "Add"} Lesson</CardTitle> */}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6 max-h-[calc(100vh_-_300px)] overflow-auto px-2">
              {/* Image Upload */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <div className="relative w-32 h-32 mx-auto">
                          <Avatar className="w-32 h-32 border border-gray-300 dark:border-gray-700">
                            <AvatarImage
                              src={
                                imageContent
                                  ? previewTempImgUrl + "public/" + imageContent?.path
                                  : previewImgUrl + editData?.image?.imageUrl
                              }
                              alt="Image"
                            />
                            <AvatarFallback className="bg-[#FFC1BB] text-black">Image</AvatarFallback>
                          </Avatar>
                          <label
                            htmlFor="image-upload"
                            className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                          >
                            <Camera className="w-5 h-5" />
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/jpg,image/png,image/jpeg"
                            className="hidden"
                            onChange={(e) => selectFile(e, "image")}
                          />
                          <div className="pt-2">{progress > 0 && <Progress value={progress} className="w-full" />}</div>
                          
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
              </div>

              {/* Title Field */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* PDF/Video Upload */}
              <div className="space-y-2">
                <FormLabel>Upload PDF/Video File</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="pdf-video-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        { loading ? <Spinner className="mb-4" size="medium" /> : <UploadCloud className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />}
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                         { loading ? <span className="font-semibold" >Uploading...</span> : <> <span className="font-semibold">Click to upload</span> <span>or drag and drop</span></> } 
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF or Video files</p>
                      </div>
                      <Input
                        id="pdf-video-upload"
                        type="file"
                        accept="application/pdf,video/mp4,video/m3u8"
                        className="hidden"
                        multiple
                        onChange={(e) => selectFile(e, "file")}
                      />
                    </label>
                  </div>
                </FormControl>
              </div>

              {/* Preview Selected Files */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {fileContents?.length > 0 &&
                  fileContents.map((fileContent: any, index: number) => (
                    <div
                      key={index}
                      className="relative w-full h-28 border border-gray-300 dark:border-gray-700 rounded flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900"
                    >
                      {fileContent?.mimeType.includes("video") || fileContent?.mimeType.includes("m3u8") ? (
                        <>
                          <SquarePlay className="w-12 h-12 text-muted-foreground" />
                          <span className="text-xs mt-2 text-center truncate w-full px-2">{fileContent.file}</span>
                        </>
                      ) : (
                        <>
                          <Image
                            src="/pdf.png" 
                            width={48}
                            height={48}
                            className="w-12 h-12 dark:invert invert-0"
                            alt="PDF Preview"
                          />
                          <span className="text-xs mt-2 text-center truncate w-full px-2">{fileContent.file}</span>
                        </>
                      )}
                      <button
                        type="button"
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                        onClick={() => removeContent(fileContent, index)}
                        disabled={loading || form.formState.isSubmitting}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto min-w-[100px]"
                onClick={() => {
                  setEditData({});
                  setOpen(false);
                }}
                disabled={loading || form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto min-w-[100px]"
                disabled={loading || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Spinner size="small" />
                ) : (
                  `${type === "edit" ? "Edit" : "Add"} Lesson`
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  </div>
)


}

export default AddEditLesson
