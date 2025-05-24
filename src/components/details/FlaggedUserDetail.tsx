"use client";
import React, { useEffect, useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatName, titleCase } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "../ui/use-toast";
import ReportApi from "@/api/report";
import { useRouter } from "next/navigation";
import {
  CircleX,
  Loader2,
  LockKeyhole,
  LockKeyholeOpen,
  MessageCircle,
  MoreHorizontal,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Swal from "sweetalert2";

const FlaggedUserDetail = (props: any) => {
  const { toast } = useToast();
  const { flaggedUserDetail, flaggedReasonList, deleteFlaggedUser } = ReportApi();
  const [reason, setReason]: any = useState([]);
  // const [user, setUser]: any = useState({});
  const [userInfo, setUserInfo]: any = useState(null);
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
  const { id, type } = props?.data;
  const router = useRouter();
  const [loading, setLoading]: any = useState(false);
  
  const reportReasons: any = {
    "1": "Sexual content",
    "2": "Violent or repulsive content",
    "3": "Hateful or abusive content",
    "4": "Harassment or bullying",
    "5": "Harmful or dangerous acts",
    "6": "Child abuse",
    "7": "Promotes terrorism",
    "8": "Spam or misleading",
    "9": "Infringes my rights",
    "10": "Captions issue",
    "11": "Others",
  };
  
  useEffect(() => {
    getUserDetaits(id);
    getReportReasonData();
  }, [id]);

  const getReportReasonData = async () => {
    await flaggedReasonList("userReportReason").then((res: any) => {
      if (!res?.error) {
        setReason(res);
      } else {
        setReason([]);
      }
    });
  };

  const getUserDetaits = async (id: any) => {
    setLoading(true);
    await flaggedUserDetail(id).then((res: any) => {
      if (!res.error) {
        setUserInfo(res?.results);
        setLoading(false);
      } else {
        setUserInfo(null);
        setLoading(false);
        toast({
          title: res?.errorMessage
            ? res?.errorMessage
            : "Uh oh! Something went wrong.",
          variant: "destructive",
          description: res?.error,
        });
      }
    });
  };

  async function cancelReport(data: any) {
    Swal.fire({
      // title: "Delete",
      text: `Are you sure you want to UnFlagged this user ?`,
      showCancelButton: true,
      confirmButtonColor: `#18181B`,
      cancelButtonColor: "white",
      confirmButtonText: "Confirm Delete",
      icon: "warning",
          customClass: { 
        popup: "max-w-[393px] px-8 py-4 !rounded-[20px]",
        icon: "text-[9.275px] mt-[0!important]",
        htmlContainer:
          "px-[0!important] pb-[0!important] [font-size:16px!important]",
        actions: "-mx-5",
        confirmButton: "[flex:0_0_auto] w-[calc(50%_-10px)] px-[0!important] !bg-btn !rounded-[20px]",
        cancelButton: `w-[calc(50%_-10px)] text-black border border-[#000000B2] border-solid px-[0!important] !rounded-[20px]`,
       },
    }).then(async (result: any) => {
      if (result.value) {
        await deleteFlaggedUser(data?.actionId).then((res: any) => {
          if (!res.error) {
            toast({
                title: "Report cancelled sucessfully.",
                description: res?.message,
              });
              router.push("/flagged-users");
          } else {
            toast({
              variant: "destructive",
              title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
              description: res?.error
            });
          }
        });
      }
    });
  }



  if (loading) {
    return (
      <div className="flex justify-center items-center p-20 h-[calc(100vh_-_182px)]">
        <Loader2 className="my-28 h-[80px] dark:text-white w-[80px] text-primary animate-spin" />
      </div>
    );
  }



  return (
    <>
      <div className="mx-auto pt-8">
        <div className="flex flex-col gap-8">
          {/* user Details */}
          <Card>
            <CardContent className="p-6">
              {/* Author */}
              <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold">Reported To:</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuItem
                        onClick={() => updateStatus(userInfo)}
                        className="flex items-center space-x-2"
                      >
                        {userInfo?.userData?.status == "active" ? (
                          <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <LockKeyholeOpen className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>
                          {userInfo?.userData?.status
                            ? userInfo?.userData?.status == "active"
                              ? "Inactive"
                              : "Active"
                            : "N/A"}
                        </span>
                      </DropdownMenuItem> */}
                    <DropdownMenuItem
                      onClick={() => cancelReport(userInfo)}
                      className="flex items-center space-x-2"
                    >
                      <CircleX className="h-4 w-4 text-muted-foreground" />
                      <span>Cancel Report</span>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem
                      onClick={() => deleteData(userInfo)}
                      className="flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                      <span>Delete</span>
                    </DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col items-center pb-6">
                <Link
                  href={
                    userInfo?.userData?.id
                      ? `/users/${userInfo?.userData?.id}`
                      : "#"
                  }
                >
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={
                        userInfo?.userData?.profile?.startsWith("https://")
                          ? userInfo?.userData?.profile
                          : previewImgUrl +
                            userInfo?.userData?.profile?.trim()
                      }
                      alt={userInfo?.userData?.name || "User Image"}
                    />
                    <AvatarFallback className="bg-[#FFC1BB]">
                      {formatName(userInfo?.userData?.name) || "N/A"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Link
                  href={
                    userInfo?.userData?.id
                      ? `/users/${userInfo?.userData?.id}`
                      : "#"
                  }
                >
                  <div className="font-bold text-lg mt-2">
                    {userInfo?.userData?.name
                      ? titleCase(userInfo.userData.name?.trim())
                      : "N/A"}
                  </div>
                </Link>
                <div className="text-gray-600 dark:text-[#aab2bb] pt-2">
                  {userInfo?.userData?.email
                    ? userInfo?.userData?.email?.trim()
                    : "N/A"}
                </div>
                <div className="text-gray-600 dark:text-[#aab2bb] pt-2">
                  {userInfo?.userData?.about || ""}
                </div>
                <div className="text-gray-600 dark:text-[#aab2bb] pt-2">
                  {userInfo?.userData.status ? (
                    <Badge
                      className={
                        userInfo?.userData.status.toLowerCase() === "active"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }
                    >
                      {titleCase(userInfo?.userData.status)}
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-500">N/A</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reported Users List */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Reported By:</h3>
            <Card>
              <CardContent className="p-0">
                {userInfo?.reportedUser?.length === 0 ? (
                  <div className="flex flex-col p-6 h-full justify-center items-center">
                    <Image
                      src="/no-data.svg"
                      alt="No data"
                      width={150}
                      height={150}
                      priority
                      className="size-[150px]"
                    />
                    <span className="font-semibold text-lg">
                      No Record Found
                    </span>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] rounded-md">
                    <Table>
                      <TableHeader className="sticky top-0 z-[1]">
                        <TableRow>
                          <TableHead>S.N.</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Reported On</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userInfo?.reportedUser?.map((report: any, i: any) => (
                          <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Avatar className="border border-border">
                                  <AvatarImage
                                    src={
                                      report?.users?.profile?.startsWith(
                                        "https://"
                                      )
                                        ? report?.users?.profile
                                        : previewImgUrl +
                                          report?.users?.profile?.trim()
                                    }
                                  />
                                  <AvatarFallback className="bg-[#FFC1BB]">
                                    {formatName(report?.users?.name) || "DI"}
                                  </AvatarFallback>
                                </Avatar>
                                <Link
                                  href={
                                    report?.users?.id
                                      ? `/users/${report.users.id}`
                                      : "#"
                                  }
                                  className="hover:underline"
                                >
                                  {report?.users?.name
                                    ? titleCase(report.users.name?.trim())
                                    : "N/A"}
                                </Link>
                              </div>
                            </TableCell>
                            <TableCell>
                              {/* {reportReasons[report?.reasonId]} */}
                              {report?.reasonId
                                  ? reason?.map(
                                      (reason: any, i: any) => {
                                        if (reason?.id == report?.reasonId) {
                                          return (
                                            <p key={i}>{reason?.title}</p>
                                          );
                                        }
                                      }
                                    )
                                  : "N/A"}
                            </TableCell>
                            <TableCell>
                              { report?.createdAt ? format(
                                new Date(report?.createdAt),
                                "dd MMM, yy 'at' h:mm a"
                              ) : "N/A"}
                            </TableCell>
                            <TableCell>
                              {report?.users?.status ? (
                                <Badge
                                  className={
                                    report?.users?.status?.toLowerCase() ===
                                    "active"
                                      ? "bg-green-500 text-white"
                                      : "bg-red-500 text-white"
                                  }
                                >
                                  {titleCase(report?.users?.status)}
                                </Badge>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlaggedUserDetail;
