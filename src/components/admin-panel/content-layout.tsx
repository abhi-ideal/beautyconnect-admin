"use client"
import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      {/* <div className="container pt-8 pb-8 px-4 sm:px-8">{children}</div> */}
      <div className="pt-6 sm:pt-8 pb-8 px-4 sm:px-5">{children}</div>
    </div>
  );
}
