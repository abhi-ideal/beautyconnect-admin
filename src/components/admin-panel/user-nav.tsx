"use client";

import Link from "next/link";
import {  LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import AuthService from "@/api/auth/AuthService";
import { useAppSelector } from "@/lib/hooks";
import { formatName } from "@/lib/utils";
import Swal from "sweetalert2";

export function UserNav() {
  const { user }: any = useAppSelector((state: any) => state.auth);
  
  const { logout }: any = AuthService();
  const previewImgUrl = process.env.NEXT_PUBLIC_PREVIEW_IMG_URL;
 
  const logOutUser= ()=>{
    Swal.fire({
      text: 'Are you sure you want to logout?',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: `#18181B`,
      cancelButtonColor: "white",
      // icon: "warning",
       imageUrl: '/logout.svg', // Replace with your image URL
        imageAlt: 'Custom image',
        imageWidth: 90,
        imageHeight: 90,
       customClass: { 
        popup: "max-w-[393px] px-8 py-4 !rounded-[20px]",
        icon: "text-[9.275px] mt-[0!important]",
        htmlContainer:
          "px-[0!important] pb-[0!important] [font-size:16px!important]",
        actions: "-mx-5",
        confirmButton: "[flex:0_0_auto] w-[calc(50%_-10px)] px-[0!important] !bg-btn !rounded-[20px]",
        cancelButton: `w-[calc(50%_-10px)] text-black border border-[#000000B2] border-solid px-[0!important] !rounded-[20px]`,
       },
      showClass: { popup: 'theme-swal' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp theme-swal' },
    }).then(async (result: any) => {
      if (result?.value){ logout('signout') };
    })
  }
  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      user?.profile
                        ? previewImgUrl+ user?.profile
                        : ""
                    }
                    alt="Avatar"
                  />
                  <AvatarFallback className="bg-transparent">
                    {formatName(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name
                ? user?.name
                : "Admin"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email ? user?.email?.trim() : "N/A"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/dashboard" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem> */}
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/account" className="flex items-center">
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => {
            logOutUser();
          }}
        >
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
