import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";
import NextTopLoader from "nextjs-toploader";

import { ThemeProvider } from "@/providers/theme-provider";
import StoreProvider from "@/lib/StoreProvider";
import AuthWrapper from "@/lib/AuthWrapper";
import { Toaster } from "@/components/ui/toaster";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Beauty Connect Admin",
  description: "Beauty Connect Admin",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    url: "/",
    title: "Beauty Connect Admin",
    description: "Beauty Connect Admin",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Beauty Connect Admin",
    description: "Beauty Connect Admin"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="favicon.ico" />
      </head>
      <body className={GeistSans.className}>
        <StoreProvider>
          <AuthWrapper>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <NextTopLoader
                color="blue"
                initialPosition={0.035}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0 10px #2299DD,0 0 5px #2299DD"
                template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                zIndex={1600}
                showAtBottom={false}
              />
              <Toaster />
              {children}
            </ThemeProvider>
          </AuthWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
