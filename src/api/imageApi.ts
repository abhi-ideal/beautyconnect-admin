import routes from "./routes";
import { getAccessToken } from "./authToken";
import { useAppDispatch } from "@/lib/hooks";
import { logoutUser } from "@/lib/slices/authSlice";
import appConstant from '../../public/json/appConstant.json';
import { useToast } from "@/components/ui/use-toast";

export default function ImageApi() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const getPresignedPostData = async (file: any) => {
    try {
    //   const fileType = file?.fileType;
      const imageData = {
        fileName: "public/" + file.randomFileName,
        fileType: file.fileType
      };
      const url = routes.IMAGE_URL();
      const accessFileToken = await getAccessToken();
   
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessFileToken
        },
        body: JSON.stringify(imageData)
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        errorHandle(response?.status);
      }
      return responseData;
    } catch (error:any) {
      return { error: true, errorMessage: error?.message };
  }
  };

  const uploadFileToS3 = async (data: any, file: any) => {
    try {
      const response = await fetch(data?.url, {
        method: "PUT",
        headers: {
          "Content-Type": file?.type
        },
        body: file
      });

      if (!response.ok) {
        errorHandle(response?.status);
      }
      return response;
    } catch (error:any) {
      return { error: true, errorMessage: error?.message };
  }
  };


  const errorHandle = (status :any)=>{
    const tokenLocalStorageKey: any = `${appConstant.NEXT_PUBLIC_TOKEN}`;
    const userLocalStorageKey: any = `${appConstant.NEXT_PUBLIC_USER_INFO}`;
    localStorage.removeItem(userLocalStorageKey);
    localStorage.removeItem(tokenLocalStorageKey);
    dispatch(logoutUser());
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description:  status == 401 
      ? 'Session expired. Please log in again.' 
      : 'You do not have permission to perform this action.',
    });
}

  return { uploadFileToS3, getPresignedPostData };
}
