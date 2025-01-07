import routes from './routes';
import { getAccessToken } from './authToken';
import { logoutUser } from "@/lib/slices/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import appConstant from "../../public/json/appConstant.json";
import { useToast } from '@/components/ui/use-toast';

export default function LessonApi() {
    const dispatch = useAppDispatch();
    const { toast } = useToast();


    //add new Lesson
    const addLesson = async (info: any) => {
        try {
            const url = routes.ADD_LESSON();
            const accessToken = await getAccessToken();
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessToken
                },
                body: JSON.stringify(info)
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

    //update Lesson
    const updateLesson = async (data: any, id:any) => {
        try {
            const url = routes.UPDATE_LESSON(id);
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


    const deleteLesson = async (id:string) =>{
        try {
            const url = routes.DELETE_LESSON(id);
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
    };

    //get Lessons details
    const lessonsDetail = async (id: string) => {
        try {
            const url = routes.LESSON_DETAIL() + id;
            const accessToken = await getAccessToken();
            const response: any = (await fetch(
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

    return { addLesson, updateLesson, deleteLesson,lessonsDetail }
}
