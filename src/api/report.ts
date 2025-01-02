import routes from './routes';
import { getAccessToken } from './authToken';
import { logoutUser } from "@/lib/slices/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import appConstant from "../../public/json/appConstant.json";
import { useToast } from '@/components/ui/use-toast';

export default function ReportApi() {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const deleteFlaggedUser = async (id:number) =>{
        try {
            const url = routes.USER_REPORT(id);
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

    const flaggedUserDetail = async (id:string)=>{
        try {
            const url = routes.USER_REPORT(id);
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


    const deleteFlaggedPost = async (id:string) =>{
        try {
            const url = routes.FEED_REPORT(id);
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
    const flaggedReasonList = async (id:string)=>{
        try {
            const url = routes.FLAGGED_REASONS();
            const response : any =  (await fetch(url));
            const responseData = await response.json();
            if (!response.ok) {
                if (response?.status === 401 || response?.status === 403) {
                    errorHandle(response?.status);
                }
            };
            return responseData?.[id];
        } catch (error:any) {
            return { error: true, errorMessage: error?.message };
        };
    }

    const flaggedPostDetail = async (id:string)=>{
        try {
            const url = routes.FEED_REPORT(id);
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

    return {deleteFlaggedUser, flaggedUserDetail, deleteFlaggedPost, flaggedPostDetail, flaggedReasonList, }
}