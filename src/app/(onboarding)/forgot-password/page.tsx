"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthService from "@/api/auth/AuthService";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().trim().min(1, { message: "Email is required." }).email({ message: "Invalid email address." }),
});

const Page = () => {
  const { forgotPassword } = AuthService();
  const route = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await forgotPassword(values.email).then((res:any) => {
        if(!res.error){
          route.push("/verify-code?email=" + values.email);
          toast({
            title: "Email Sent.",
            description: "A password reset email has been sent.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: res?.errorMessage
          });
        }
      });
    } catch (error:any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error?.message
      });
    }
  }

  return (
    <>
      <div className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center !mb-3">Forgot Password</CardTitle>
          <CardDescription className="!text-center">
            No worries, we’ll send you reset instructions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full !bg-btn"
                >
                  {form.formState.isSubmitting ? (
                    <Spinner size="small" />
                  ) : (
                    "Send"
                  )}
                </Button>
                <div className="text-center">
                  <Link className="px-8 text-sm text-muted-foreground" href="/">
                    Back to log In
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </div>
    </>
  );
};

export default Page;
