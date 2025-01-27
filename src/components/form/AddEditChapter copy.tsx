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
import { Spinner } from "../ui/spinner";
import Image from 'next/image'
import { CardHeader, Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import ChapterApi from "@/api/chapterApi";

const formSchema = z.object({
  title: z
    .string().trim().min(1, { message: "Title is required." }),
  fileContent:z
    .string().trim().min(1, { message: "File Content is required." }),
});

const AddEditChapter = (props: any) => {
  const { getPresignedPostData, uploadFileToS3 } = ImageApi();
  const [loading, setLoading]: any = useState(false);
  const [deleteContent, setDeleteContent]: any = useState([]);
  const { lessonId, setOpen, type, editData, setEditData, allChapters, setAllChapters }: any = props?.props;

    const {addChapter, updateChapter } = ChapterApi()
  
  const imageHaveType = ["mp4", "m3u8", "pdf"];
  const { toast } = useToast();
  const [fileContents, setFileContents]: any = useState(null);
  const [formValues, setFormValues] :any = useState({
    title: editData?.title || "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues
  });


// console.log('editData', editData);



// console.log('fileContents', fileContents);



  useEffect(() => {
    form.reset(formValues);
  }, [formValues, form]);




  async function onSubmit(values: z.infer<typeof formSchema>) {

 console.log('form values', values);
 
 	
    const body:any ={
      "lessonContents" : [{
          title : values?.title,
          media: fileContents
        }
      ]
  }


     await addChapter(body, lessonId).then((res: any) => {
        if (!res?.error) {
          const newLesson = {
            id: res?.id,
            title: values.title,
          lessonContentInfo: fileContents,
            status: "active",
            createdAt: new Date(),
          }
          setAllChapters({
            ...allChapters,
            results: [newLesson, ...(allChapters?.results || [])]
          });
          setOpen(false);
          toast({
            title: "Add Lesson Content successfully.",
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


// function is to select image.
const selectFile = async (event:any) => {
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
      setLoading(true);
    if (imageHaveType.includes(selectedFile?.name.split(".").pop())) {
     
      const epochNow = new Date().getTime();
      const randomFileName =
        'dev-3U-' + epochNow + '.' + selectedFile.name.split('.').pop();
      const sendData: any = {
        randomFileName: randomFileName,
        fileType: selectedFile?.type,
      };      
  await getPresignedPostData(sendData).then(async(data: any) =>{
    if(data){
      await uploadFileToS3(data, selectedFile ).then(() =>{
        const mimeType = selectedFile?.type;
          setFileContents({
                mimeType: mimeType,
                file: randomFileName,
                ratio: imageRatio ? imageRatio : "50x50",
                poster: "",
                type: mimeType?.split("/")[0]
            });
      setLoading(false) 
      form.setValue("fileContent", randomFileName);
        toast({title: "Upload File successfully."});
      })
    }else {
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
  toast({title: "Please select video/pdf as have type pdf, m3u8 or mp4."});
  }
}
};


return (
  <div className="max-w-2xl mx-auto p-4">
    <Card className="w-full">
      <CardHeader>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6 max-h-[calc(100vh_-_300px)] overflow-auto px-2">
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
                        onChange={(e) => selectFile(e)}
                      />
                    </label>
                  </div>
                </FormControl>
              </div>

              {/* Preview Selected Files */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div
                      className="relative w-full h-28 border border-gray-300 dark:border-gray-700 rounded flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900"
                    >
                      {fileContents?.mimeType.includes("video") || fileContents?.mimeType.includes("m3u8") ? (
                        <>
                          <SquarePlay className="w-12 h-12 text-muted-foreground" />
                          <span className="text-xs mt-2 text-center truncate w-full px-2">{fileContents.file}</span>
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
                          <span className="text-xs mt-2 text-center truncate w-full px-2">{fileContents.file}</span>
                        </>
                      )}
                    </div>
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
                  `${type === "edit" ? "Edit" : "Add"} Lesson Content`
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

export default AddEditChapter
