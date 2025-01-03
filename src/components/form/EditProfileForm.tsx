import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Profile from "@/api/profile";
import ImageApi from "@/api/imageApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { formatName, setLocalStorage } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import appConstant from "../../../public/json/appConstant.json";
import { setUser } from "@/lib/slices/authSlice";
import { Camera } from 'lucide-react';
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes";
import { Spinner } from "../ui/spinner";

const formSchema = z.object({
  name: z.string().min(5, { message: "Name must be at least 5 characters." }),
  email: z.string().min(5, { message: "Email must be at least 5 characters." })
});

const EditProfileForm = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();
  const { user }: any = useAppSelector((state: any) => state.auth);
  const { getProfileDetail, updateProfile } = Profile();
  const { getPresignedPostData, uploadFileToS3 } = ImageApi();
  const userLocalStorageKey: any = `${appConstant.NEXT_PUBLIC_USER_INFO}`;
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const dispatch = useAppDispatch();
  const imageHaveType = ['jpg', 'jpeg','png'];
  const [formValueChanged, setFormValueChanged] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [progress, setProgress]:any = React.useState()
  const [showUploadImage, setShowUploadImage]: any = useState([]);
  const tempData: any = {};
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email
    }
  });

console.log('user', user);


  useEffect(() => {
    form.reset({
      name: user?.name,
      email: user?.email
    });
  }, [user, form]);

  React.useEffect(() => {
    let timer:any;
    if (progress > 0 && progress < 100) {
      timer = setInterval(() => {
        setProgress((prevProgress:any) => (prevProgress >= 100 ? 100 : prevProgress + 2));
      }, 100);
    }
    return () => clearInterval(timer);
  }, [progress]);
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if(values.name) tempData.name = values.name;
    if(user?.id) tempData.id = user?.id;
    if(showUploadImage?.path){
      tempData.profile = {
        path:showUploadImage?.path?.split('/').pop() || '',
        type:showUploadImage?.type,
      };
    }
    const res = await updateProfile(tempData);
    if (!res.error) {
      const data:any = await getProfileDetail();
  if (!data?.responseData?.error) {
      setLocalStorage(data?.responseData?.result, userLocalStorageKey);
      dispatch(setUser(data?.responseData?.result));
      router.push("/dashboard");
      toast({
        title: "Update Profile successfully",
        description: res.message
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: data?.response?.error,
      });
    }
    } else {
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: res?.errorMessage,
      });
    }
  }

  //function is for change profile.
  const handleChange = (event: any, type: string) => {
    const value = event.target.value;
    let nameChanged = false;
    if (value) {
      if (type === "name") {
        nameChanged = value !== user?.name;
      }
      setFormValueChanged(nameChanged);
    }
  };

// function is to select image.
  const selectFile = async (event:any) => {
    const img = new Image();
    let fileRatio: any
    img.onload = () => { fileRatio = (img.width + 'x' + img.height) }
    img.src = URL.createObjectURL(event.target.files[0]);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setProgress(10);
      setImageChanged(true)
      if (imageHaveType.includes(selectedFile?.name.split('.').pop())) {
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
        // setTimeout(() => {
          // setShowUploadImage(previewImgUrl +'temp/'+ randomFileName)
          setProgress(80);
        // }, 2000)
        await uploadFileToS3(data, selectedFile ).then(() =>{
          const mimeType = selectedFile?.type;
          const content = {
            mimeType: mimeType,
            path: previewImgUrl +'temp/'+ randomFileName,
            ratio: fileRatio ? fileRatio : "50x50",
            type: mimeType?.split("/")[0]
          }
          setShowUploadImage(content);
          setProgress(100);
          toast({title: "Upload Image successfully"});
        })
      }
    })

  } else {
    setProgress(0)
    setImageChanged(false)
    toast({title: "Please select image as have type jpg, jpeg or png."});
    }
  }
  };





  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
             <div className="relative w-20 h-20">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={showUploadImage?.path ? showUploadImage?.path : previewImgUrl+ user?.profile}
                />
                <AvatarFallback>{formatName(user?.name)}</AvatarFallback>
              </Avatar>
              <label htmlFor="image-upload" className={`absolute bottom-0 right-0 p-1 ${theme=='dark' ? 'bg-black' : 'bg-white'} rounded-full cursor-pointer`}>
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
              {
                progress && <Progress value={progress} className="w-[15%]" />
              }
            
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          handleChange(e, "name");
                          field.onChange(e); 
                        }}
                        placeholder="Enter your name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-20" disabled={!formValueChanged && !imageChanged || form.formState.isSubmitting } type="submit">
            {" "}
              {form.formState.isSubmitting ? (
                <Spinner size="small" />
              ) : (
                "Update"
              )}{" "}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default EditProfileForm;
