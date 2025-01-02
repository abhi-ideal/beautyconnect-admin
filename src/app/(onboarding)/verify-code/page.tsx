"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import AuthService from "@/api/auth/AuthService";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Button } from '@/components/ui/button';
import { Suspense } from "react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().trim().min(1, { message: "Email is required." }).email({ message: "Invalid email address." }),
  newPassword: z.string()
  .max(50, { message: "Maximum length is 50" })
  .min(6, { message: "New Password must be at least 6 characters." }),
  confirmPassword: z.string(),
  otp: z.string().min(6, { message: "Your one-time password must be 6 characters.", }),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  message: "The passwords must match.",
  path: ["confirmPassword"]
});

const Page = () => {
  const routers: any = useSearchParams();
  const email = routers.get("email");
  const [isLoading, setIsLoading] = useState(false);
  const { ConfirmPassword } = AuthService();
  const { toast } = useToast();
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setFormValues({ email: email || "", newPassword: "", confirmPassword: "", otp: "" });
  }, [email]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues
  });

  useEffect(() => {
    form.reset(formValues);
  }, [formValues, form]);

  const onSubmit = async (value: any) => {
    const body={
      "email" : email,
      "confirmationCode" : value.otp,
      "newPassword" : value.newPassword,
  };
    ConfirmPassword(body).then((res: any) => {
      if(!res?.error){
        toast({
          title: "Password Update Successfully!",
          description: res?.message
        });
        router.push("/");
      }else {
        toast({
          title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
          variant: "destructive", description: res?.error
        });
      }
    })
  }

  const togglePasswordVisibility = (type: string) => {
    if (type == "new") {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    };
  };

  const resend = () => {
    try {
      setIsLoading(true);
      const ActionCodeSettings: any = {
        url: process.env.NEXT_PUBLIC_REDIRECT_URL,
        handleCodeInApp: true
      };
      // sendPasswordResetEmail(auth, email, ActionCodeSettings)
      //   .then(() => {
      //     setIsLoading(false);
      //   })
      //   .catch(() => {
      //     setIsLoading(false);
      //   });
    } catch (error: any) {
      setIsLoading(false);
    }
  };

return (
  <>
    <Suspense>
        <div className="mx-auto max-w-sm">
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
                          <Input readOnly
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
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="password"
                              {...field}
                            />
                            <div
                              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                              onClick={() => togglePasswordVisibility('new')}
                            >
                              {showNewPassword ? <Eye /> : <EyeOff />}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="password"
                              {...field}
                            />
                            <div
                              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                              onClick={() => togglePasswordVisibility('confirm')}
                            >
                              {showConfirmPassword ? <Eye /> : <EyeOff />}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


                <div className="space-y-2 w-full" >
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One-Time Password</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup className="w-full flex justify-between" >
                              <InputOTPSlot index={0} className="border border-gray-700" />
                              <InputOTPSlot index={1} className="border border-gray-700" />
                              <InputOTPSlot index={2} className="border border-gray-700" />
                              <InputOTPSlot index={3} className="border border-gray-700" />
                              <InputOTPSlot index={4} className="border border-gray-700" />
                              <InputOTPSlot index={5} className="border border-gray-700" />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription>
                          Please enter the one-time password sent to your email.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full"
                >
                  {form.formState.isSubmitting ? (
                    <Spinner size="small" />
                  ) : (
                    "Submit"
                  )}
                </Button>
                <div className="text-center mt-3">
              <Link className="px-8 text-sm text-muted-foreground" href="/">
                Back to log In
              </Link>
            </div>
              </div>
            </form>
          </Form>
        </div>
      </Suspense>
  </>
)
}

export default Page
