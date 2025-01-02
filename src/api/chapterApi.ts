import routes from './routes';
import { getAccessToken } from './authToken';
import { logoutUser } from "@/lib/slices/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import appConstant from "../../public/json/appConstant.json";
import { useToast } from '@/components/ui/use-toast';

export default function ChapterApi() {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    //get Chapters details
    const chaptersDetail = async (id: string, chapterId: string) => {
        try {
            const url = routes.CHAPTER_DETAIL(id, chapterId);
            const accessToken = await getAccessToken();
            const response: any = (await fetch(
                url, { headers: { Authorization: 'Bearer ' + accessToken } }
            ))
            const responseData = await response.json();
            if (!response.ok) {
                if (response?.status === 401 || response?.status === 403) {
                    errorHandle(response?.status);                }
            };
            return responseData;
        } catch (error) {
            console.error('Error:', error);
            throw error;
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

    return { chaptersDetail }
}
