import routes from './routes';
import { getAccessToken } from './authToken';
import moment from 'moment';
import { logoutUser } from "@/lib/slices/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import appConstant from "../../public/json/appConstant.json";
import { useToast } from '@/components/ui/use-toast';

export default function dashboardApi() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const getDashboardCount = async (data:any) => {
    try {
      const api = (data?.startDate !== "" ? '?startDate='+ moment(data?.startDate).format('YYYY-MM-DD')+'&' : "")+(data?.endDate !== "" ? 'endDate=' + moment(data?.endDate).format('YYYY-MM-DD') : "");
      const url1 = routes.DASHBOARD();
      const accessToken = await getAccessToken();
      const response1 :any = (await fetch(url1+api, { headers: { Authorization: 'Bearer ' + accessToken } }));

      const responseData1 = await response1.json();
      if (!(response1.ok)) {
          if (response1?.status === 401 || response1?.status === 403 ) {
               errorHandle(response1?.status);
          }
      }
      return { responseData1 };
    } catch (error:any) {
      return { error: true, errorMessage: error?.message };
    }
  }

  const getGraphData = async (data:any) => {
    try{
      const url = routes.USERGRAPG(data);
      const accessToken = await getAccessToken();
      const response = await (await fetch(url, { headers: { Authorization: 'Bearer ' + accessToken } }))
      const responseData = await response.json();
      if (!response.ok) {
          if (response?.status === 401 || response?.status === 403) {
               errorHandle(response?.status);
          }
      }
      return responseData;
    }catch (error:any) {
      return { error: true, errorMessage: error?.message };
    }
  }

  const getRevenueGraphData = async (data:any) => {
    try{
      const url = routes.REVENUE_GRAPH(data);

      const accessToken = await getAccessToken(); 
       const options =  {
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
    }catch (error:any) {
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

  return { getDashboardCount, getGraphData, getRevenueGraphData }
}