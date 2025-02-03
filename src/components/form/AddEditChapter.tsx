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
import { Progress } from "@/components/ui/progress";
import ImageApi from "@/api/imageApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, SquarePlay, UploadCloud, X } from "lucide-react";
import { Spinner } from "../ui/spinner";
import {
  CardHeader,
  Card,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import ChapterApi from "@/api/chapterApi";

const formSchema = z.object({
  lessonContents: z
    .array(
      z.object({
        title: z.string().min(1, { message: "Title is required." }),
        media: z.object({
          file: z.string().min(1, { message: "Media is required." }),
        }),
      })
    )
    .min(1, { message: "At least one lesson content is required." }),
});

const AddEditChapter = (props: any) => {
  const { getPresignedPostData, uploadFileToS3 } = ImageApi();
  const [loading, setLoading]: any = useState(false);
  const [deleteContent, setDeleteContent]: any = useState([]);
  const {
    lessonId,
    setOpen,
    type,
    editData,
    setEditData,
    allChapters,
    setAllChapters,
  }: any = props?.props;

  const { addChapter, updateChapter } = ChapterApi();

  const imageHaveType = ["mp4", "m3u8", "pdf"];
  const { toast } = useToast();
  const [fileContents, setFileContents]: any = useState(null);
  const [formValues, setFormValues]: any = useState({
    title: editData?.title || "",
  });
  const [lessonContents, setLessonContents] = useState<any[]>([
    { title: "", media: { file: "" } },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { lessonContents },
  });

  // console.log('editData', editData);

  // console.log("lessonContents", lessonContents);

  useEffect(() => {
    form.reset(formValues);
  }, [formValues, form]);

  const handleAddMore = () => {
    if (lessonContents.length < 5) {
      setLessonContents([...lessonContents, { title: "", media: "" }]);
    }
  };

  const handleRemove = (index: number) => {
    const updated = lessonContents.filter((_, i) => i !== index);
    setLessonContents(updated);
    form.setValue("lessonContents", updated);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedLessonContents = lessonContents.map((content) => ({
      title: content.title,
      media: [content.media],
    }));

    const body = { lessonContent: updatedLessonContents };

    await addChapter(body, lessonId).then((res: any) => {
      if (!res?.error) {
        const newLesson = {
          id: res?.id,
          title: lessonContents[0].title,
          file: lessonContents?.[0]?.media?.type == "application" ? "lesson/"+ lessonContents?.[0]?.media?.file : lessonContents?.[0]?.media?.file,
          mimeType:lessonContents?.[0]?.media?.mimeType,
          type:
            lessonContents?.[0]?.media?.type == "application" ? "pdf" : "video",
          createdAt: new Date(),
        };
        setAllChapters({
          ...allChapters,
          results: [newLesson, ...(allChapters?.results || [])],
        });
        setOpen(false);
        toast({
          title: "Add Lesson Content successfully.",
          description: res?.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: res?.errorMessage || "Uh oh! Something went wrong.",
          description: res?.error,
        });
      }
    });
  }

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedContents = [...lessonContents];
    updatedContents[index][field] = value;
    setLessonContents(updatedContents);

    // Update form state for validation
    if (field === "title") {
      form.setValue(`lessonContents.${index}.title`, value);
    } else if (field === "media") {
      form.setValue(`lessonContents.${index}.media.file`, value.file);
    }
  };

  // function is to select image.
  const selectFile = async (selectedFile: any, index: any) => {
    if (selectedFile) {
      setLoading(true);

      if (imageHaveType.includes(selectedFile?.name.split(".").pop())) {
        const epochNow = new Date().getTime();
        const randomFileName =
          "dev-2C-" + epochNow + "." + selectedFile.name.split(".").pop();

        const sendData: any = {
          randomFileName: randomFileName,
          fileType: selectedFile?.type,
        };

        await getPresignedPostData(sendData).then(async (data: any) => {
          if (data) {
            await uploadFileToS3(data, selectedFile).then(async() => {
              const mimeType = selectedFile?.type;
        if (selectedFile.type.startsWith("video")) {
          const videoMetadata = await getVideoMetadata(selectedFile);
          const { duration, ratio } = videoMetadata;

          handleInputChange(index, "media", {
            mimeType: mimeType,
            file: randomFileName,
            ratio: ratio,
            poster: "",
            type: mimeType.split("/")[0],
            duration: duration, 
          });
        } else {
          // Default ratio for pdf files
          handleInputChange(index, "media", {
            mimeType: mimeType,
            file: randomFileName,
            ratio: "50:50",
            poster: "",
            type: mimeType.split("/")[0],
            duration: 0, 
          });
        }

              setLoading(false);
              toast({ title: "Upload File successfully." });
            });
          } else {
            setLoading(false);
            toast({
              variant: "destructive",
              title:
                data?.errorMessage ||
                "Uh oh! Something went wrong in uploading.",
              description: data?.error,
            });
          }
        });
      } else {
        setLoading(false);
        toast({
          title:
            "Please select video/pdf as supported types are pdf, m3u8, or mp4.",
        });
      }
    }
  };

  //function is for retuning ratio and duration.
  const getVideoMetadata = (file: File): Promise<{ duration: number; ratio: string }> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
  
      video.onloadedmetadata = () => {
        const duration = Math.round(video.duration); // in seconds
        const width = video.videoWidth;
        const height = video.videoHeight;
  
        const ratio = width && height ? `${width}:${height}` : "50:50";
        resolve({ duration, ratio });
      };
  
      video.onerror = () => {
        // reject(new Error("Failed to load video metadata."));
        console.error("Failed to load video metadata.");
        resolve({ duration: 0, ratio: "50:50" });
      };
  
      // Create a blob URL for the video file and set it as the source
      video.src = URL.createObjectURL(file);
    });
  };
  


  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          {/* <h3 className="text-lg font-medium">Add Lesson Content</h3> */}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {lessonContents.map((content, index) => (
                <div
                  key={index}
                  className="relative flex items-start gap-4 border p-4 rounded"
                >
                  {/* Remove Button */}
                  {lessonContents.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute top-0 right-0 text-red-500"
                      onClick={() => handleRemove(index)}
                      disabled={loading || form.formState.isSubmitting}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}

                  {/* Title Input */}
                  <FormField
                    control={form.control}
                    name={`lessonContents.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter title"
                            value={content.title}
                            onChange={(e) => {
                              const updated = [...lessonContents];
                              updated[index].title = e.target.value;
                              setLessonContents(updated);
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Media Upload */}
                  <FormField
                    control={form.control}
                    name={`lessonContents.${index}.media.file`}
                    render={({ field }) => (
                      <div className="flex-1">
                        <FormLabel>Media</FormLabel>
                        <FormControl>
                          <>
                            <label
                              htmlFor={`media-upload-${index}`}
                              className="block border border-dashed rounded p-2 cursor-pointer"
                            >
                              {content.media?.file ? (
                                <span>{content.media.file}</span>
                              ) : (
                                <div className="flex items-center gap-2 text-gray-500">
                                  {loading ? (
                                    <Spinner size="small" />
                                  ) : (
                                    <UploadCloud className="w-5 h-5" />
                                  )}
                                  <span>
                                    {loading
                                      ? "Uploading..."
                                      : "Upload PDF/Video"}
                                  </span>
                                </div>
                              )}
                            </label>
                            <input
                              id={`media-upload-${index}`}
                              type="file"
                              accept="application/pdf,video/mp4,video/m3u8"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  selectFile(file, index);
                                  field.onChange({ file: file.name });
                                }
                              }}
                            />
                          </>
                        </FormControl>
                        <FormMessage className="pt-1" />
                      </div>
                    )}
                  />
                </div>
              ))}

              {/* Add More Button */}
              {lessonContents.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddMore}
                  disabled={loading || form.formState.isSubmitting}
                >
                  + Add More
                </Button>
              )}

              {/* Submit and Cancel Buttons */}
              <div className="flex justify-end gap-4">
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
                    `${type === "edit" ? "Submit" : "Submit"}`
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditChapter;
