import routes from './routes';
import { getAccessToken } from './authToken';
import { logoutUser } from "@/lib/slices/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import appConstant from "../../public/json/appConstant.json";
import { useToast } from '@/components/ui/use-toast';

export default function UserApi() {
    const { toast } = useToast();
    const dispatch = useAppDispatch();

    const deleteUser = async (id:string) =>{
        try {
            const url = routes.USER_DELETE(id);
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

    const updateUser = async (data: any) => {
        try {
            const url = routes.USER_UPDATE();
            const accessToken = await getAccessToken();
            const options = {
                method: 'PATCH',
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

    const userDetail = async (id:string)=>{
        try {
            const url = routes.USER_DETAIL(id);
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

    return { updateUser, deleteUser, userDetail }
}