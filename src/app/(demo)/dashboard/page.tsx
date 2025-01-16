"use client"
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, RotateCcw, Users, MicVocal, Package, Gem, BriefcaseBusiness, StickyNote } from "lucide-react";
import { CartesianGrid, XAxis, LabelList, YAxis, Line, LineChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import dashboardApi from "@/api/dashboard";
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import moment from "moment";
import { Badge } from "@/components/ui/badge"

const userChartConfig = {
  users: {
    label: "Users",
    color: "cyan",
  },
  jobs: {
    label: "Jobs",
    color: "blue",
  },
  courses: {
    label: "Courses",
    color: "lime",
  },
  feeds: {
    label: "Posts",
    color: "orange",
  },
} satisfies ChartConfig


export default function DashboardPage() {
  const { toast } = useToast();
  const currentDate = moment();
  const firstOfMonth = currentDate.clone().startOf('month');
  const [date, setDate] = React.useState<any>();
  const [graphDate, setGraphDate] = React.useState<any>({
    from: firstOfMonth.toDate(),
    to: currentDate.toDate(),
  });
  const today = new Date();

  const disabledDates = {
    after: today
  };

  const { getDashboardCount, getGraphData }: any = dashboardApi();
  const [dashboardCount, setDashboardCount]: any = useState({});
  const [chartUser, setChartUser]: any = useState([]);
  const [loading, setLoading]: any = useState(false);
  const [openGraph, setGraphOpen] = React.useState(false);
  const [openCount, setCountOpen] = React.useState(false);
  const router = useRouter();
    // Check if reset button should be shown
    const showResetButton =!(
      moment(graphDate?.from)?.isSame(firstOfMonth, 'day') &&
      moment(graphDate?.to)?.isSame(currentDate, 'day')
    );


  useEffect(() => {
      getData("")
      setCountOpen(false);
  }, [])

  useEffect(() => {
    if (date?.from && date?.to){
      getData("")
      setCountOpen(false);
    }
  }, [date?.to])

  useEffect(() => {
    getGraph();
    setGraphOpen(false);
  }, [graphDate?.to])

  const monthName: any = ["Jan", "Fab", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const getGraph = async () => {
    const body = {
      from: graphDate?.from ? graphDate?.from : '',
      to: graphDate?.to ? graphDate?.to : '',
    }
    await getGraphData(body).then((res: any) => {
      let loop = new Date(body.from);
      const filterDay=[]
      const filterMonths :any= [];
      while (loop <= body.to) {
        filterDay.push(loop.getDate());
        loop.setDate(loop.getDate() + 1);
      }
      const start = moment(body?.from).startOf("month");
      const end = moment(body.to).endOf("month");
      for ( let currentMonth = start.clone(); currentMonth.isSameOrBefore(end); currentMonth.add(1, "month")) {
        filterMonths.push(currentMonth.format('MM'));
      };
      let result=[];
      if (res?.type==="monthly") {
        filterDay.map((day:number)=>{
          const userCount = res?.userGraph?.find((item: any) => item?.day === day)?.counts || 0;
          // const jobCount = res?.jobsGraph?.find((item: any) => item?.day === day)?.counts || 0;
          const courseCount = res?.courseGraph?.find((item: any) => item?.day === day)?.counts || 0;
          const feedCount = res?.feedGraph?.find((item: any) => item?.day === day)?.counts || 0;
          result.push(
            {  
              month: day,
              users: userCount,
              // jobs: jobCount,
              courses: courseCount,
              feeds: feedCount
            }
          );
        })
      } else if(res?.type==="yearly") {
        result = filterMonths?.map((i:number) => {
            const userCount = res?.userGraph?.find((item:any) => item?.month == i)?.counts || 0;
            // const jobCount = res?.jobsGraph?.find((item:any) => item?.month == i)?.counts || 0;
            const courseCount = res?.courseGraph?.find((item:any) => item?.month == i)?.counts || 0;
            const feedCount = res?.feedGraph?.find((item:any) => item?.month == i)?.counts || 0;
        
            return {
                month:monthName[Number(i-1)],
                users: userCount,
                // jobs: jobCount,
                courses: courseCount,
                feeds: feedCount
            };
      });
    }
      setChartUser(result);
    })
  }

  const getData = async (type: any) => {
    setLoading(true)
    const data = {
      startDate: date?.from ? date?.from : '',
      endDate: date?.to ? date?.to : '',
    }
    const body = type == "reset" ? { startDate: "", endDate: "" } : data;
    await getDashboardCount(body).then((res: any) => {
      if (!res?.error) {
        // console.log('res', res);

        const result = { ...res?.responseData1?.result, ...res?.responseData2 };
        // console.log('result', result);
        
        setDashboardCount(result);
        setLoading(false)
      } else {
        toast({
          title: res?.errorMessage ? res?.errorMessage : "Uh oh! Something went wrong.",
          variant: "destructive", description: res?.error
        });
        setLoading(true)
        setDashboardCount({});
      }
    })
  }
  const shimmer = [...Array(4)];
  const resetDate = (type: string) => {
    if (type == 'dashboard') {
      setDate(null);
      getData("reset");
    } else {
      setGraphDate({
        from: firstOfMonth.toDate(),
        to: currentDate.toDate(),
      });
      // getGraph();
    }
  };

  return (
    <ContentLayout title="">

      <main className="flex flex-1 flex-col gap-4 pb-4 md:gap-4">

        <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

          <div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker date={date} setDate={setDate} disabledDates={disabledDates} open={openCount} setOpen={setCountOpen} />
            {/* <Button disabled={loading || !date} onClick={getData} >Date Filter</Button> */}
            {date && ( <Button disabled={loading} onClick={() => resetDate('dashboard')} ><RotateCcw /></Button> )}
            {/* <Button disabled={loading} onClick={() => resetDate('dashboard')} ><RotateCcw /></Button> */}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
            {shimmer.map((index, i) => (
              <Card key={i} x-chunk="dashboard-01-chunk-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-[150px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-[150px]" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          <Link href="/users">
            <Card x-chunk="dashboard-01-chunk-1" className="cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardCount?.totalUsers || 0}</div>
              </CardContent>
            </Card>
            </Link>


            <Link href="/posts">
                <Card x-chunk="dashboard-01-chunk-3">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Posts
                    </CardTitle>
                    <StickyNote className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardCount?.totalFeeds
                        ? dashboardCount?.totalFeeds
                        : 0}
                    </div>
                  </CardContent>
                </Card>
              </Link>

              

              {/* <Link href="/courses"> */}
                <Card x-chunk="dashboard-01-chunk-3">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Courses
                    </CardTitle>
                    <StickyNote className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardCount?.totalCourse
                        ? 0
                        : 0}
                    </div>
                  </CardContent>
                </Card>
              {/* </Link> */}

              {/* <Link href="/skills">
            <Card x-chunk="dashboard-01-chunk-1" className="cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
                <Gem className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardCount?.totalSkills || 0}</div>
              </CardContent>
            </Card>
            </Link> */}
            <Card x-chunk="dashboard-01-chunk-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Course Revenue</CardTitle>
                <Gem className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardCount?.totalSkills || 0}</div>
              </CardContent>
            </Card>

  
          </div>)}



      </main>


      <div className="w-full flex flex-col gap-6 pt-5">
        <div className="grid w-full gap-4 md:gap-6">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-bold tracking-tight">Chart</CardTitle>
                <Badge className={`bg-${userChartConfig?.users?.color}-500`}>{userChartConfig?.users?.label}</Badge>
                <Badge className={`bg-${userChartConfig?.feeds?.color}-500`}>{userChartConfig?.feeds?.label}</Badge>
                <Badge className={`bg-${userChartConfig?.courses?.color}-500`}>{userChartConfig?.courses?.label}</Badge>
                {/* <Badge className={`bg-${userChartConfig?.jobs?.color}-500`}>{userChartConfig?.jobs?.label}</Badge> */}
                <div className="hidden items-center space-x-2 md:flex">
                  <CalendarDateRangePicker date={graphDate} setDate={setGraphDate} disabledDates={disabledDates} open={openGraph} setOpen={setGraphOpen} />
                  { showResetButton &&  <Button disabled={loading} onClick={() => resetDate('graph')} className="flex items-center justify-center"><RotateCcw /></Button>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!chartUser.length ? (
                <div className="flex justify-center py-20">
                  <Image src="/no-data.svg" alt="No Data" width={320} height={320} priority className="size-[150px]"/>
                </div>
              ) : (
                <ChartContainer config={userChartConfig}>
                  <LineChart
                    accessibilityLayer
                    data={chartUser}
                    margin={{
                      top: 20,
                      left: 20,
                      right: 20,
                      bottom: 40, // Adjusted for X-axis label
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    // tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickCount={5}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                   
                    <Line
                      dataKey="users"
                      type="monotone"
                      stroke="var(--color-users)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-users)" }}
                      activeDot={{ r: 6 }}
                    >
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Line>
                    <Line
                      dataKey="feeds"
                      type="monotone"
                      stroke="var(--color-feeds)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-feeds)" }}
                      activeDot={{ r: 6 }}
                    >
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Line>

                    {/* <Line
                      dataKey="jobs"
                      type="monotone"
                      stroke="var(--color-jobs)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-jobs)" }}
                      activeDot={{ r: 6 }}
                    >
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Line> */}
                    <Line
                      dataKey="courses"
                      type="monotone"
                      stroke="var(--color-courses)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-courses)" }}
                      activeDot={{ r: 6 }}
                    >
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Line>
                  </LineChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

    </ContentLayout>
  );
}
