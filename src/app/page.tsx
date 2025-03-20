"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/demo/mode-toggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  decryptAccessToken,
  encryptAccessToken
} from "@/service/EncryptionUtil";
import appConstant from "../../public/json/appConstant.json";
import AuthService from "@/api/auth/AuthService";
import { Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";
import moment from 'moment';
import { useTheme } from "next-themes";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  remember: z.boolean().default(false).optional()
});

export default function HomePage() {
  const { login } = AuthService();
  const { toast } = useToast();
  const route = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
   const currentYear = moment().format('YYYY'); 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const rememberMeKey = `${appConstant.NEXT_PUBLIC_REMEMBER_ME}`;
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    remember: false
  });

  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector(
    (state: any) => state.auth
  );
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, router]);
  useEffect(() => {
    const rememberMeStorage = localStorage.getItem(rememberMeKey);
    if (rememberMeStorage) {
      const rememberMeData = decryptAccessToken(rememberMeStorage);
      if (rememberMeData) {
        setFormValues({
          email: rememberMeData.email || "",
          password: rememberMeData.password || "",
          remember: true
        });
      }
    }
  }, [rememberMeKey]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues
  });

  useEffect(() => {
    form.reset(formValues);
  }, [formValues, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await login(values);
    
    if (!res?.error) {
      if (values.remember) {
        const rememberMeStorage = encryptAccessToken(values);
        if (rememberMeStorage) {
          localStorage.setItem(rememberMeKey, rememberMeStorage);
        }
        toast({
          title: "Login successfully!",
        });
        // const redirectUrl = Cookies.get("redirectUrl") || "/";
        // route.push(redirectUrl || "/dashboard");
        route.push("/dashboard");
      } else {
        localStorage.removeItem(rememberMeKey);
      }
    } else {
      toast({ variant: "destructive", title: res?.errorMessage ? res?.errorMessage : "INVALID LOGIN CREDENTIALS", });
      // console.log(res.error, "+++++++++");
    }
  }
  return (
  <>
    <div className="container relative min-h-screen flex-col items-center justify-center flex lg:grid lg:max-w-none lg:grid-cols-2 !p-0" >
      
        <div className="justify-center items-center relative lg:h-full flex-col lg:dark:bg-[#161616] lg:bg-black lg:p-10 text-white lg:dark:border-r flex">
         
          <div className="" />
            <div className="py-4 lg:py-0 mt-10 lg:mt-0">
            <Image
              className="mb-3 lg:mb-5 object-contain w-full  mx-auto hidden lg:block"
              src="/logoWhite.png"
              alt="Logo"
              width={400}
              height={100}
            
            />
              <Image
               className="block lg:hidden max-w-[250px]"
                src={theme=='light' ? "/logoBlack.png" : "/logoWhite.png"}
                alt="Logo"
                width={400}
                height={100}
                priority
                      />
            {/* <Image
              className="object-contain w-full max-w-[200px] dark:invert-0 invert lg:invert-0"
              src={'/logo_name 1.svg'}
              alt="Logo"
              width={400}
              height={100}
              priority
            /> */}
            </div>
          <div className="absolute bottom-0 z-20 hidden lg:flex">
            <blockquote className="space-y-2">
              <footer className="text-sm">
                <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
                  <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                    © {currentYear}, Beauty Connect Admin
                  </p>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
        <div className="justify-end flex items-center gap-2 absolute top-2 right-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-8 h-8 bg-background"
              asChild
            ></Button>
            <ModeToggle />
          </div>

          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">

       
          <section className="lg:mt-6 max-w-[980px] flex-col items-center gap-2 pb-8 md:pb-8 lg:pt-24 lg:pb-6">
            {/* <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
              Login
            </h1> */}
            <div className="flex justify-center" >
             <Image
              className="object-contain w-full max-w-[200px] text-center hidden lg:block"
              src={theme == 'dark' ? "/logoWhiteText.png": "/logoBlackText.png"}
              alt="Logo"
              width={400}
              height={100}
              priority
            />
            </div>

            <div className="mx-auto max-w-sm mt-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="password"
                                    {...field}
                                  />
                                  <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                  >
                                    {showPassword ? <Eye /> : <EyeOff />}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="remember"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center  justify-between space-x-3 space-y-0 py-2">
                            <div className="flex gap-2 items-center">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Remember Me</FormLabel>
                            </div>
                            </div>
                            <Link
                          className=" text-sm text-muted-foreground"
                          href="/forgot-password"
                        >
                          Forgot Password?
                        </Link>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="w-full"
                      >
                        {form.formState.isSubmitting ? (
                          <Spinner size="small" />
                        ) : (
                          "Login"
                        )}
                      </Button>
                      {/* <div className="text-center">
                        <Link
                          className="px-8 text-sm text-muted-foreground"
                          href="/forgot-password"
                        >
                          Forgot Password?
                        </Link>
                      </div> */}
                    </div>
                  </form>
                </Form>
            </div>
          </section>
          </div>
        </div>
        <div className="z-20 justify-center w-full mt-auto sticky bottom-0 flex lg:hidden dark:bg-black bg-white">
            <blockquote className="space-y-2">
              <footer className="text-sm">
                <div className="container flex flex-col items-center justify-center gap-4 lg:h-24 md:flex-row">
                  <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                    © {currentYear}, Beauty Connect Admin
                  </p>
                </div>
              </footer>
            </blockquote>
          </div>
      </div>
    </>
  );
}
