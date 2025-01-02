import routes from './routes';
import { getAccessToken } from './authToken';
import { useAppDispatch } from "@/lib/hooks";
import { logoutUser } from "@/lib/slices/authSlice";
import appConstant from '../../public/json/appConstant.json';
import { useToast } from "@/components/ui/use-toast";
export default function ContentApi() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
    // function is for upload content.
    const updateContent = async (contentData: any, type: string) => {
      const result = await getPresignedPostData(type);
      const uploadContent = uploadFileToS3({file:contentData, url:result?.url});
    };
    
    const getContentFiles = async (id:string) => {
      try {
        const url1:any = routes.GET_CONTENT(id);        
        const responseData = await (await fetch(url1, { cache: "no-store" })).json();
        return  {responseData};
      } catch (error:any) {
        return { error: true, errorMessage: error?.message };
      }
    }


// function is for call api of  invalidate cache clear.   
    const invalidate = async (id:string) => {
      try {
          const url = routes.INVALIDATE_CACHE();
          const data = {
            path :  `/content_pages/${id}.json`
          }
          const accessToken = await getAccessToken();
          const options = {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                  Authorization: 'Bearer ' + accessToken
              },
              body: JSON.stringify(data)
          };
          const response = await fetch(url, options);            
          const responseData = await response.json();
          if (!response.ok) {
            if (response?.status === 401 || response?.status === 403) {
                errorHandle(response?.status);
            }
        }
          return responseData;
      } catch (error:any) {
        return { error: true, errorMessage: error?.message };
      }
  };


  const getPresignedPostData = async (id:any) => {
    try {
      const body = {
        fileName: `content_pages/${id}.json`,
        fileType: 'application/json'
      };
      const url = routes.IMAGE_URL();
      const accessFileToken = await getAccessToken();   
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessFileToken
        },
        body: JSON.stringify(body)
      };
      const response = await fetch(url, options);
      const responseData = await response.json();
      if (!response.ok) {
        if (response?.status === 401 || response?.status === 403) {
            errorHandle(response?.status);
        }
    }
      return responseData;
    } catch (error:any) {
      return { error: true, errorMessage: error?.message };
    }
  };

  const uploadFileToS3 = async (data: any) => {
    try {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data?.file)
      }

      const response = await fetch(data?.url, options);

      if (!response.ok) {
        if (response?.status === 401 || response?.status === 403) {
            errorHandle(response?.status);
        }
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


    return { updateContent , getContentFiles, invalidate }
}