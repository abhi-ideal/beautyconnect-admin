"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { setUser, setLoading } from "./slices/authSlice";
import { decryptAccessToken } from "@/service/EncryptionUtil";
import appConstant from "../../public/json/appConstant.json";

const AuthWrapper = ({ children }: any) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state: any) => state.auth);
  // const { language } = useAppSelector((state: any) => state.user)
  useEffect(() => {
    (async () => {
      let userInfo: any;
      const localEncryptedData: any = localStorage.getItem(
        `${appConstant.NEXT_PUBLIC_USER_INFO}`
      );
      if (localEncryptedData) {
        userInfo = await decryptAccessToken(localEncryptedData);
        dispatch(setUser(userInfo));
        }else {
          dispatch(setLoading(false));
        }
    })();
  }, [dispatch]);

  return !isLoading && children;
};

export default AuthWrapper;
