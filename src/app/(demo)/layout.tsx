"use client"
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { useAppSelector } from "@/lib/hooks";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const route = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAppSelector((state: any) => state.auth)
  useEffect(() => {
    if (pathname) {
      document.cookie = `redirectUrl=${pathname}; path=/; max-age=${24 * 60 * 60}`; // Expires in 1 day
    }
    if (!isLoading && !isAuthenticated) {
      route.push('/');
    }
  }, [isAuthenticated, isLoading, route, pathname])
  // if (!isLoading && isAuthenticated) {
  //   return (
  //     <>
  //     <AdminPanelLayout>{children}</AdminPanelLayout>;
  //     </>
  //   );
  // }
  // if (isLoading || !isAuthenticated) {
  //   return (
  //     <div className="flex items-center gap-3">
  //       "Spinner"
  //     </div>
  //   )
  // }
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
