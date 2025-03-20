import routes from './routes';
import { getAccessToken } from './authToken';
import { logoutUser } from "@/lib/slices/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import appConstant from "../../public/json/appConstant.json";
import { useToast } from '@/components/ui/use-toast';
import { Course } from '@/types/Courses';

export default function CourseCategoryApi() {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    //add new course category

    const addCourseCategory = async (info: Course) => { 
        try {
            const url = routes.ADD_COURSE_CATEGORY();
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
            console.log('responseData', responseData);

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

    // update course category
    const updateCourseCategory = async (data: any, id: string) => {
        try {
            const url = routes.ADD_COURSE_CATEGORY() + "/" + id;
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
        } catch (error: any) {
            return { error: true, errorMessage: error?.message };
        }
    }

    // delete skills    
    // const deleteSkills = async (id:string) =>{
    //     try {
    //         const url = routes.SKILL()+"/"+id;
    //         const accessToken = await getAccessToken();
    //         const options = {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: 'Bearer ' + accessToken
    //             },
    //         };
    //         const response = await fetch(url, options);
    //         const responseData = await response.json();
    //         if (!response.ok) {
    //             if (response?.status === 401 || response?.status === 403) {
    //                 errorHandle(response?.status);
    //             }
    //         }
    //         return responseData;
    //     } catch (error:any) {
    //         return { error: true, errorMessage: error?.message };
    //       }
    // } 

    const deleteCourseCategory = async (id: string) => {
        console.log('id', id);

        try {
            const url = routes.ADD_COURSE_CATEGORY() + "/" + id;
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
        } catch (error: any) {
            return { error: true, errorMessage: error?.message };
        }
    };
    //get skills details
    const courseCategorysDetail = async (id: string) => {
        try {
            const url = routes.ADD_COURSE_CATEGORY() + "/" + id;
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
        } catch (error: any) {
            return { error: true, errorMessage: error?.message };
        }
    }
    const courseCategoryList = async () => {
        try {
            const url = await routes.COURSE_SKILL_LIST();
            const accessToken = await getAccessToken();
            const options = {
                headers: { Authorization: "Bearer " + accessToken },
            }
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
    }

    const errorHandle = (status: any) => {
        const tokenLocalStorageKey: any = `${appConstant.NEXT_PUBLIC_TOKEN}`;
        const userLocalStorageKey: any = `${appConstant.NEXT_PUBLIC_USER_INFO}`;
        localStorage.removeItem(userLocalStorageKey);
        localStorage.removeItem(tokenLocalStorageKey);
        dispatch(logoutUser());
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: status == 401
                ? 'Session expired. Please log in again.'
                : 'You do not have permission to perform this action.',
        });
    }

    return { addCourseCategory, updateCourseCategory, deleteCourseCategory, courseCategorysDetail, courseCategoryList }
}
