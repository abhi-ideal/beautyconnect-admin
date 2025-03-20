"use client"
import UserApi from '@/api/user';
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatName, titleCase } from '@/lib/utils';
import { useToast } from "../ui/use-toast";
import { format } from "date-fns";
import { Badge } from '../ui/badge';
import moment from 'moment';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, MapPin, Users, Calendar, Globe2, Flag, MessageSquare, Map, Gem, } from 'lucide-react'

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
          <Loader2 className="my-28 h-[80px] dark:text-white w-[80px] text-primary animate-spin" />
          </div>
        );
      }


    const handleNavigateToMap = () => {
        if (userInfo?.address?.latitude && userInfo?.address?.longitude) {
          const googleMapsUrl = `https://www.google.com/maps?q=${userInfo?.address?.latitude},${userInfo?.address?.longitude}`;
          window.open(googleMapsUrl, '_blank');
        }
      };


      
      function formatMobileNumber(number: string): string {
        const match = number.match(/^\+(\d{1,3})(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          const [, countryCode, part1, part2, part3] = match;
          return `+${countryCode} ${part1} ${part2} ${part3}`;
        }
        return number; // Return the original number if it doesn't match the expected format
      }
      

    return (
        <>
   <div className=" pt-8">
      <Card className="mx-auto max-w-full">
        <CardHeader className="flex flex-col items-center space-y-4 pb-8 p-2">
          <Avatar className="h-24 w-24">
              <AvatarImage src={userInfo ? previewImgUrl+ userInfo?.profile : ""} />
            <AvatarFallback className="bg-[#FFC1BB] text-2xl font-medium">
           {formatName(userInfo?.name) || "N/A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-2xl font-bold">{titleCase(userInfo?.name?.trim()) || "N/A"}</h1>
            <p className="text-sm text-muted-foreground">{userInfo?.email?.trim() || ""}</p>
            <p className="text-sm text-muted-foreground">{userInfo?.about?.trim() || ""}</p>
                        {userInfo?.status ? (
                  <Badge
                    className={
                      userInfo.status.toLowerCase() === "active"
                        ? "bg-green-500 text-white mt-2"
                        : "bg-red-500 text-white mt-2"
                    }
                  >
                    {titleCase(userInfo.status)}
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-500 mt-2">N/A</span>
                )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
        <Separator/>

          <div>
            <h2 className="text-xl font-semibold mb-4">Profile Overview:</h2>
            <div className="">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between ">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="font-medium">{titleCase(userInfo?.gender) || "N/A"}</span>
                </div>
                <div className="flex justify-between ">
                  <span className="text-muted-foreground">Mobile</span>
                  <span className="font-medium">{userInfo?.mobileNumber ? formatMobileNumber(userInfo.mobileNumber) : 'N/A'}</span>
                </div>
                <div className="flex justify-between ">
                  <span className="text-muted-foreground">Date of Birth</span>
                  <span className="font-medium">{userInfo?.dob ? moment(userInfo.dob, "DD/MM/YYYY").format("DD/MMM/YYYY") : "N/A"}</span>
                </div>

                <div className="flex justify-between ">
                  <span className="text-muted-foreground">Created At</span>
                  <span className="font-medium">{userInfo?.createdAt ? format(new Date(userInfo?.createdAt), "dd MMM, yy 'at' h:mm a") : "N/A"}</span>
                </div>

              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Following</span>
                  </div>
                  <span className="font-medium">{userInfo?.totalFollowing || 0}</span>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Followers</span>
                  </div>
                  <span className="font-medium">{userInfo?.totalFollower || 0}</span>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Posts</span>
                  </div>
                  <span className="font-medium">{userInfo?.totalPost || 0}</span>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-2">
                    <Gem className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Diamonds</span>
                  </div>
                  <span className="font-medium">{userInfo?.diamond || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* <Separator /> */}

          {/* <div>
            <h2 className="text-xl font-semibold mb-4">Location Information</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Street</span>
                  </div>
                  <span className="font-medium">{userInfo?.address?.street || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between w-80">
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">City</span>
                  </div>
                  <span className="font-medium">{userInfo?.address?.city || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between w-80">
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">State</span>
                  </div>
                  <span className="font-medium">{userInfo?.address?.state || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between w-80">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Country</span>
                  </div>
                  <span className="font-medium">{userInfo?.address?.country || "N/A"}</span>
                </div>
              </div>
              <div className="space-y-6">
              <div className="flex justify-between w-80">
                  <span className="text-muted-foreground">Location</span>
                  {userInfo?.address?.latitude && userInfo?.address?.longitude ? (
                  <Button
                    variant="link"
                    className="h-auto p-0 text-blue-600 hover:text-blue-600"
                    onClick={handleNavigateToMap}
                  >
                    <MapPin className="mr-1 h-6 w-6" />
                    <span className="text-lg font-medium">Map</span>
                  </Button>
                ) : (
                  <span className="font-medium">N/A</span>
                )}
                </div>
                <div className="flex justify-between w-80">
                  <span className="text-muted-foreground">Latitude</span>
                  <span className="font-medium">{userInfo?.address?.latitude || "N/A"}</span>
                </div>
                <div className="flex justify-between w-80">
                  <span className="text-muted-foreground">Longitude</span>
                  <span className="font-medium">{userInfo?.address?.longitude || "N/A"}</span>
                </div>
              </div>
            </div>
          </div> */}

          <Separator />
  
          <div className="flex items-center gap-10 justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Address</span>
            </div>
            <span className="font-medium">  { userInfo?.address ? `${userInfo?.address?.street ? userInfo?.address?.street+',' : ''} ${userInfo?.address?.city ? userInfo?.address?.city+',' : ''} ${userInfo?.address?.state ? userInfo?.address?.state+',' : ''} ${userInfo?.address?.country ? userInfo?.address?.country : ''}` : "N/A" }</span>
          </div>
        </CardContent>
      </Card>
    </div>
        </>
    )
}

export default UserDetail
