"use client";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/demo/mode-toggle";
import { useTheme } from "next-themes";
import moment from 'moment';

export default function OnBoardLayout({
  children,
  ...props
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();
  const router = useRouter();
  const currentYear = moment().format('YYYY'); 
  
  const { isAuthenticated, isLoading } = useAppSelector((state: any) => state.auth)
  useEffect(() => {
    if(!isLoading){
      if (isAuthenticated) {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated,isLoading, router])
  return (
    <>
{/*     
      <div className="flex flex-col min-h-screen">
        <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
          <div className="container h-14 flex items-center">
            <Link href="/" className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300"
            >
              <Image src="/logo.svg" alt="Logo" width={40} height={40} priority />
              <Image className="pl-4" src={theme=='light' ? "/logo_name.svg" : "/logo_name 1.svg"} alt="Logo" width={120} height={30} priority />
            </Link>
            <nav className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full w-8 h-8 bg-background" asChild ></Button>
              <ModeToggle />
            </nav>
          </div>
        </header>
        <main className="min-h-[calc(100vh-57px-97px)] flex-1">
          <div className="container relative pb-10">
            <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
              <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
                Admin Panel
              </h1>
              {children}
            </section>
          </div>
        </main>
        <footer className="py-6 md:py-0 border-t border-border/40">
          <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            © 2024, Dental Network Admin
            </p>
          </div>
        </footer>
      </div>
 */}
    <div className="container relative min-h-screen flex-col items-center justify-center flex lg:grid lg:max-w-none lg:grid-cols-2 !p-0" >
         <div className="justify-center items-center relative lg:h-full flex-col bg-mainBg lg:p-10 text-white lg:dark:border-r hidden lg:flex">
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
              // src={theme=='light' ? "/logo_name.svg" : "/logo_name 1.svg"}
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
                  <p className="text-balance text-center text-sm leading-loose text-white">
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

            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px] ">
          <section className="lg:mt-4 max-w-[980px] flex-col items-center gap-2 py-5  lg:py-8  shadow-none lg:shadow-[2px_2px_2px_2px_#0000000F] bg-[#FFF] dark:bg-[#000] rounded-[10px] border border-[#c9c9c96e]">
              {/* <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
                Admin Panel
              </h1> */}
              {children}
            </section>
          </div>
        </div>
        <div className="z-20 justify-center w-full lg:mt-auto sticky bottom-0 flex lg:hidden dark:bg-black bg-white mt-5">
            <blockquote className="space-y-2">
              <footer className="text-sm">
                <div className="container flex flex-col items-center justify-center gap-4 lg:h-24 md:flex-row">
                  <p className="text-balance text-center text-sm leading-loose text-white">
                    © {currentYear}, Beauty Connect Admin
                  </p>
                </div>
              </footer>
            </blockquote>
          </div>
      </div>
    </>
  )
}