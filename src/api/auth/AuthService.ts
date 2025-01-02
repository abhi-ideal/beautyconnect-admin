import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import appConstant from "../../../public/json/appConstant.json";
import {
  decryptAccessToken,
  encryptAccessToken
} from "@/service/EncryptionUtil";
import { setUser, logoutUser } from "@/lib/slices/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import Profile from "../profile";
import { useToast } from "@/components/ui/use-toast";
import routes from "../routes";
import { getAccessToken } from "../authToken";
import ChangePassword from "@/components/form/ChangePassword";


const AuthService = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [userLocalInfo, setUserInfoStorageState]: any = useState({});

  const tokenLocalStorageKey: any = `${appConstant.NEXT_PUBLIC_TOKEN}`;
  const userLocalStorageKey: any = `${appConstant.NEXT_PUBLIC_USER_INFO}`;
  const route = useRouter();
  const { getProfileDetail } = Profile();

  const login = async (data: any) => {
    if (data) {
      try {
        const url :any = routes.ADMIN_LOGIN();
        const body= { username : data.email, password : data.password, deviceDetails : "", deviceType : "web" };
        const options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
        const response:any = await fetch(url, options);
        const user: any = await response.json();
        const token: any = user?.token;
        if(response?.status==200){
          setLocalStorage(token, tokenLocalStorageKey);
          const res:any = await getProfileDetail();
          setLocalStorage(res?.responseData?.result, userLocalStorageKey);
          dispatch(setUser(res?.responseData?.result));
          // route.push("/dashboard");
        }
        return user;
      } catch (error:any) {
        return { error: true, errorMessage: error?.message || "Something went wrong." };
      }
    }
  };

  const logout = async (id:string) => {
    try {
        const url = routes.ADMIN_LOGOUT();
        const accessToken = await getAccessToken();
        sessionStorage.clear();
        const options = { method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken
          },
          body: JSON.stringify({ deviceId : "342432",}),
        };
        const res :any = await fetch(url, options);
        if(res?.ok){
          localStorage.removeItem(userLocalStorageKey);
          localStorage.removeItem(tokenLocalStorageKey);
          dispatch(logoutUser());
          route.push("/");
          toast({ title: "Logout successfully! 11" + id, });
        }else{ 
          localStorage.removeItem(userLocalStorageKey);
          localStorage.removeItem(tokenLocalStorageKey);
          dispatch(logoutUser());
          route.push("/");
          toast({ title: "Logout successfully! " + id, });
        }
    } catch (error:any) {
      return { error: true, errorMessage: error?.message || "Something went wrong." };
    }
  }


  const forgotPassword = async (email: any) => {
    try {
      const url :string = routes.FORGOT_PASSWORD();
      const options = { method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email : email }),
      };
      const res :any = await fetch(url, options);
      if(res.ok) {
        return { success: true, message: 'Password reset email sent successfully.' };
      } else{
        return { error: true, errorMessage: "Something went wrong." };
      }
    } catch (error: any) {
      return { error: true, errorMessage: error?.message };
    }
  };

  const ConfirmPassword = async ( data: any) => {
    try {
      const url :string = routes.CONFIRM_PASSWORD();
      const options = { method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      };
      const res :any = await fetch(url, options);
      const response = res.json();
      if(res.ok) {
        return { success: true, message: 'Password Update Successfully.' };
      } else{
        return { error: true, errorMessage: "Something went wrong." };
      }
    } catch (error: any) {
      return { error: true, errorMessage: error?.message };
    }
  };

  const setLocalStorage = async (response: any, key: string): Promise<any> => {
    const encryptedData = encryptAccessToken(response);
    encryptedData ? localStorage.setItem(key, encryptedData) : "";
  };

  return { login, logout, forgotPassword, ConfirmPassword };
};

export default AuthService;
