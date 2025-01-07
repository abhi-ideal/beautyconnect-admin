import routes from './routes';
import { getAccessToken } from './authToken';
import { logoutUser } from "@/lib/slices/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import appConstant from "../../public/json/appConstant.json";
import { useToast } from '@/components/ui/use-toast';

export default function PostApi() {
    const dispatch = useAppDispatch();
    const { toast } = useToast();

    const deletePost = async (id:string) =>{
        try {
            const url = routes.POST(id);
            const accessToken = await getAccessToken();
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessToken
                },
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
    }

    const updatePost = async (data: any) => {
        try {
            const url = routes.POST(data?.id);
            const accessToken = await getAccessToken();
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
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
    }

    const postDetail = async (id:string)=>{
        try {
            const url = routes.POST_DETAIL(id);
            const accessToken = await getAccessToken();
            const response : any =  (await fetch(
                url, { headers: { Authorization: 'Bearer ' + accessToken } }
            ))
            const responseData = await response.json();
            if (!response.ok) {
                if (response?.status === 401 || response?.status === 403) {
                    errorHandle(response?.status);
                }
            };
            return responseData;
        } catch (error:any) {
            return { error: true, errorMessage: error?.message };
          }
    }
    
    const postComments = async (id: string, offset = 0, limit = 5) => {
        try {
            const param = { id, offset, limit };
            const url = await routes.COMMENT_LIST(param);
            const accessToken = await getAccessToken();
            const options = {
              headers: { Authorization: "Bearer " + accessToken },
            };
            const response = await fetch(url, options);
            const responseData = await response.json();
        
            if (!response.ok) {
              if (response?.status === 401 || response?.status === 403) {
                errorHandle(response?.status);
              }
            }
            return responseData;
          } catch (error: any) {
            return { error: true, errorMessage: error?.message };
          }
    };

    const viewMoreComments = async (data:any) => { 
        try {
           const param = {
                offset: data?.offset || 0,
                limit: data?.limit || 5,
                commentId:data?.commentId,
                id:data?.id
            }
            const url = routes.CHILD_COMMENT_LIST(param);
            const accessToken = await getAccessToken();
            const options = {
              headers: { Authorization: "Bearer " + accessToken },
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

    const errorHandle=(status :any)=>{
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

    return { updatePost, deletePost, postDetail, postComments, viewMoreComments }
}