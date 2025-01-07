"use client"
import UserApi from '@/api/user';
import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatName, titleCase } from '@/lib/utils';
import { useToast } from "../ui/use-toast";
import { format } from "date-fns";
import { Loader2, MapPin } from 'lucide-react';
import { Badge } from '../ui/badge';
import moment from 'moment';
import { Button } from '../ui/button';


const UserDetail = (props: any) => {
    const { toast } = useToast();
    const { userDetail } = UserApi();
    const [userInfo, setUserInfo]: any = useState({});
    const [loading, setLoading]: any = useState(false);
    const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
    const { id, type } = props?.data

    useEffect(() => {
        getUserDetaits(id);
    }, [id]);
    const getUserDetaits = async (id: any) => {
        setLoading(true);
        await userDetail(id).then((res: any) => {
            if (!res.error) {
                setUserInfo(res?.result)
                setLoading(false);
            } else {
                setUserInfo({})
                setLoading(false);
                toast({
                    title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
                    variant: "destructive", description: res?.error
                });
            }
        })
    }

    if (loading) {
        return (
          <div className="flex justify-center items-center p-20 h-[calc(100vh_-_182px)]">
          <Loader2 className="my-28 h-[100px] dark:text-white w-[100px] text-cyan-500 animate-spin" />
          </div>
        );
      }
    const InfoRow = ({ label, value }: any) => (
        <div className="flex items-start gap-20">
            <div className="font-bold min-w-36">{label + " "}:</div>
            <div>{value}</div>
        </div>
    );

    
    const handleNavigateToMap = () => {
        if (userInfo?.address?.latitude && userInfo?.address?.longitude) {
          const googleMapsUrl = `https://www.google.com/maps?q=${userInfo?.address?.latitude},${userInfo?.address?.longitude}`;
          window.open(googleMapsUrl, '_blank');
        }
      };

    return (
        <>
            <div className="max-w-12xl flex flex-col gap-6 pt-8">
                <Card className="flex flex-col p-6 space-y-6">
                    <div className="flex flex-col items-center border-b pb-6">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={userInfo ? previewImgUrl+ userInfo?.profile : ""} />
                            <AvatarFallback className="bg-[#FFC1BB]">
                                {formatName(userInfo?.name) || "N/A"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="font-bold text-lg mt-2">{titleCase(userInfo?.name) || "N/A"}</div>
                        <div className="text-gray-600">{userInfo?.email || ""}</div>
                        <div className="text-gray-600">{userInfo?.about || ""}</div>
                        <div className="text-gray-600">
                        {userInfo?.status ? (
                  <Badge
                    className={
                      userInfo.status.toLowerCase() === "active"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {titleCase(userInfo.status)}
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-500">N/A</span>
                )}

                        </div>
       
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">{type == "User" ? 'User' : 'Employer'} Details:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                {/* <InfoRow label="Role" value={titleCase(userInfo?.role) || 0} /> */}
                                <InfoRow label="Gender" value={titleCase(userInfo?.gender) || "N/A"} />
                                <InfoRow label="Mobile Number" value={userInfo?.mobileNumber || 0} />
                                <InfoRow label="Date of Birth" value={userInfo?.dob ? moment(userInfo.dob, "DD/MM/YYYY").format("DD/MMM/YYYY") : "N/A"} />
                                <InfoRow label="Following" value={userInfo?.totalFollowing || 0} />
                                <InfoRow label="Followers" value={userInfo?.totalFollower || 0} />
                                <InfoRow label="Posts" value={userInfo?.totalPost || 0} />
                                {/* <InfoRow label="Address" value={userInfo?.address || "N/A"} /> */}
                                <InfoRow label="Created At" value={userInfo?.createdAt ? format(new Date(userInfo?.createdAt), "dd MMM, yy 'at' h:mm a") : "N/A"} />
                            </div>
                            <div>
                                
                                {/* <InfoRow label="Role" value={userInfo?.role || "N/A"} /> */}
                                {/* <InfoRow label="Profession" value={userInfo?.professionType || "N/A"} /> */}
                                {/* <InfoRow label="Distance" value={userInfo?.distance || 0} /> */}
                                {/* <InfoRow label="Slot Duration" value={userInfo?.slotDuration || 0} /> */}
                                <InfoRow label="Street" value={userInfo?.address?.street || "N/A"} />
                                <InfoRow label="City" value={userInfo?.address?.city || "N/A"} />
                                <InfoRow label="State" value={userInfo?.address?.state || "N/A"} />
                                <InfoRow label="Country" value={userInfo?.address?.country || "N/A"} />
                                <InfoRow label="Latitude" value={userInfo?.address?.latitude || 0} />
                                <InfoRow label="Longitude" value={userInfo?.address?.longitude || 0} />
                                {/* <InfoRow label="SignIn Provider" value={userInfo?.signInProvider || "N/A"} /> */}
                                {/* <InfoRow label="Languages" value={userInfo?.knowLanguages || "N/A"} /> */}
                                {/* { userInfo?.skills?.map((skill:any)=>{
                                    return <InfoRow label={skill?.title} value={skill?.description || "N/A"} />
                                })} */}
     <div className="flex items-start gap-20">
  <div className="font-bold min-w-36">Location:</div>
  <div className="flex items-center gap-x-2">
    {userInfo?.address?.latitude && userInfo?.address?.longitude ? (
      <Button
        variant="link"
        className="flex items-center text-blue-600 hover:underline p-0"
        onClick={handleNavigateToMap}
      >
        <MapPin className="mr-1 h-5 w-5" />
        Map
      </Button>
    ) : (
      <span className="text-gray-500">N/A</span>
    )}
  </div>
</div>

                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}

export default UserDetail
