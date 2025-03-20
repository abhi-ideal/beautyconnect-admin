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
import { CartesianGrid, XAxis, LabelList, YAxis, Line, LineChart, Label } from "recharts"
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

const revenueChartConfig = {
  user: {
    label: "Revenue",
    color: "#00f2a1"
  },

} satisfies ChartConfig;


export default function DashboardPage() {
  const { toast } = useToast();
  const currentDate = moment();
  const firstOfMonth = currentDate.clone().startOf('month');
  const [date, setDate] = React.useState<any>();
  const [graphDate, setGraphDate] = React.useState<any>({
    from: firstOfMonth.toDate(),
    to: currentDate.toDate(),
  });

  const [revenueGraphDate, setRevenueGraphDate] = React.useState<any>({
    from: firstOfMonth.toDate(),
    to: currentDate.toDate(),
  });
  const [revGraphLoading, setRevGraphLoading]: any = useState(false);
  const [chartRevenue, setChartRevenue]: any = useState([]);

  function getNumberOfMonths(startDate: any, endDate: any) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    return yearDiff * 12 + monthDiff + 1;
  }

  const today = new Date();

  const disabledDates = {
    after: today
  };

  const { getDashboardCount, getGraphData, getRevenueGraphData }: any = dashboardApi();
  const [dashboardCount, setDashboardCount]: any = useState({});
  const [chartUser, setChartUser]: any = useState([]);
  const [loading, setLoading]: any = useState(false);
  const [openGraph, setGraphOpen] = React.useState(false);
  const [openReveGraph, setRevGraphOpen] = React.useState(false);

  const [openCount, setCountOpen] = React.useState(false);
  const router = useRouter();
    // Check if reset button should be shown
    const showResetButton =!(
      moment(graphDate?.from)?.isSame(firstOfMonth, 'day') &&
      moment(graphDate?.to)?.isSame(currentDate, 'day')
    );

    const showRevResetButton =!(
      moment(revenueGraphDate?.from)?.isSame(firstOfMonth, 'day') &&
      moment(revenueGraphDate?.to)?.isSame(currentDate, 'day')
    );

    // default called 
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



  useEffect(() => {
    getRevenueGraph();
    setRevGraphOpen(false);
  }, [revenueGraphDate?.to])

  const monthName: any = ["Jan", "Fab", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const getGraph = async () => {
    const body = {
      from: graphDate?.from ? graphDate?.from : '',
      to: graphDate?.to ? graphDate?.to : '',
    }
    if (graphDate?.from && graphDate?.to){
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
  }


  // Function for get revenue graph
  const getRevenueGraph = async () => {
    setRevGraphLoading(true)
    const body = {
      from: revenueGraphDate?.from ? revenueGraphDate?.from : "",
      to: revenueGraphDate?.to ? revenueGraphDate?.to : ""
    };

    if (revenueGraphDate?.from && revenueGraphDate?.to){
    await getRevenueGraphData(body).then((res: any) => {
      if (!res.error) {
        setRevGraphLoading (false);
        let filterData: any = [];
        res?.result?.map((item: any) => {
          filterData?.push({
            month: monthName[Number(item?.month) - 1] || "Day " + item.day,
            user:  Math.floor(item?.totalAmount),
          });
        });
        const hasDay = res?.result.every((item: any) =>
          item.hasOwnProperty("day")
        );
        const hasMonth = res?.result.every((item: any) =>
          item.hasOwnProperty("month")
        );

        if (hasDay && hasMonth) {
          // console.log("Both day and month exist in the data.");
        } else if (hasDay) {
          let allData: any = [];
          const numberOfDays =
            (body?.to - body?.from) / (1000 * 60 * 60 * 24) + 1;
          const date = new Date(body?.from);
          const dayOfMonth = date.getDate();

          for (let i = 1; i <= numberOfDays; i++) {
            allData.push({ totalAmount: 0, day: dayOfMonth - 1 + i });
          }

          allData = allData.map((item: any) => {
            const match: any = res?.result?.find(
              (update: any) => update.day === item.day
            );
            return match ? { ...item, totalAmount: match.totalAmount } : item;
          });

          // console.log(allData);
          filterData = [];

          allData?.map((item: any) => {
            const startDate = new Date(body?.from);
            const month = startDate.getMonth();
            const year = startDate.getFullYear();
            const day = item.day;
            const date = new Date(year, month, day);
            const options: Intl.DateTimeFormatOptions = {
              day: "numeric",
              month: "short"
            };
            const formattedDate = date.toLocaleDateString("en-GB", options);
            filterData?.push({
              month: formattedDate,
              user: Math.floor(item?.totalAmount),
            });
          });
        } else if (hasMonth) {
          let allData: any = [];
          // const numberOfMonths: any = getMonthsInRange(
          //   graphDate?.from,
          //   graphDate?.to
          // );
          const numberOfMonths = getNumberOfMonths(
            revenueGraphDate?.from,
            revenueGraphDate?.to
          );
          // const numberOfMonths:any = (body?.to - body?.from)

          // const yearDifference = body?.to.getFullYear() - body?.from.getFullYear();
          // const monthDifference = body?.to.getMonth() - body?.from.getMonth();
          // const numberOfMonths:any  =yearDifference * 12 + monthDifference;
          // console.log(numberOfMonths);
          const date = new Date(body?.from);
          const month = date.getMonth();

          for (let i = 1; i <= numberOfMonths; i++) {
            // console.log(month);
            allData.push({ counts: 0, month: month + i });
          }
          allData = allData.map((item: any) => {
            const match: any = res?.result?.find(
              (update: any) => update.month === item.month
            );
            return match ? { ...item, counts: match.counts } : item;
          });
          // console.log(allData);
          filterData = [];
          allData?.map((item: any) => {
            // console.log(item);
            const startDate = new Date(body?.from);
            startDate.setMonth(item.month - 1);
            const formattedMonth = `${startDate.toLocaleString("default", {
              month: "short"
            })} ${startDate.getFullYear()}`;

            filterData?.push({
              month: formattedMonth,
              user: Math.floor(item?.totalAmount),
            });
          });
        } else {
          // console.log("Neither day nor month exists in the data.");
        }
        // console.log(filterData);
        setChartRevenue(filterData);
      } else {
        setRevGraphLoading(false);
        setChartRevenue([]);
      }
    });
  }
  };



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
    } else if (type == "graph") {
      setGraphDate({
        from: firstOfMonth.toDate(),
        to: currentDate.toDate(),
      });
      // getGraph();
    } else {
      setRevenueGraphDate({
        from: firstOfMonth.toDate(),
        to: currentDate.toDate(),
      });
    }
  };

  return (
    <ContentLayout title="">

      <main className="flex flex-1 flex-col gap-4 pb-4 md:gap-4">

        <div className="flex items-center justify-between space-y-2">
        <h2 className="text-[26px] font-bold tracking-tight">Dashboard</h2>

          <div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker date={date} setDate={setDate} disabledDates={disabledDates} open={openCount} setOpen={setCountOpen} />
            {/* <Button disabled={loading || !date} onClick={getData} >Date Filter</Button> */}
            {date && ( <Button disabled={loading} onClick={() => resetDate('dashboard')} ><RotateCcw /></Button> )}
            {/* <Button disabled={loading} onClick={() => resetDate('dashboard')} ><RotateCcw /></Button> */}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
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
          <div className="grid gap-4 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
          <Link href="/users">
            <Card x-chunk="dashboard-01-chunk-1" className="cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between ">
                <div>
                <CardTitle className="text-sm font-medium pb-2">Total Users</CardTitle>
                <div className="text-2xl font-bold">{dashboardCount?.totalUsers || 0}</div>
                </div>
                <div className="p-4 bg-secondary rounded-full">
              <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              </CardHeader>
            </Card>
            </Link>


            <Link href="/posts">
            <Card x-chunk="dashboard-01-chunk-1" className="cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between ">
                  <div>
                  <CardTitle className="text-sm font-medium pb-2"> Total Courses</CardTitle>
                <div className="text-2xl font-bold">
                      {dashboardCount?.totalCourse
                        ? dashboardCount?.totalCourse
                        : 0}
                    </div>
                  </div>
                  <div className="p-4 bg-secondary rounded-full">
                <StickyNote className="h-4 w-4 text-muted-foreground" />
                </div>
                </CardHeader>
              </Card>
            </Link>

              

              <Link href="/courses">
                <Card x-chunk="dashboard-01-chunk-1" className="cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between ">
                    <div>
                    <CardTitle className="text-sm font-medium pb-2"> Total Courses</CardTitle>
                  <div className="text-2xl font-bold">
                        {dashboardCount?.totalCourse
                          ? dashboardCount?.totalCourse
                          : 0}
                      </div>
                    </div>
                    <div className="p-4 bg-secondary rounded-full">
                  <StickyNote className="h-4 w-4 text-muted-foreground" />
                  </div>
                  </CardHeader>
                </Card>
              </Link>

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
           <Card x-chunk="dashboard-01-chunk-1" className="cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between ">
                  <div>
                  <CardTitle className="text-sm font-medium pb-2">Total Course Revenue</CardTitle>
                 <div className="text-2xl font-bold">{dashboardCount?.totalRevenue ? "$ "+ dashboardCount?.totalRevenue : 0}</div>
                  </div>
                  <div className="p-4 bg-secondary rounded-full">
                <Gem className="h-4 w-4 text-muted-foreground" />
                </div>
                </CardHeader>
              </Card>

  
          </div>)}



      </main>

              {/* user graph code  */}
              <div className="flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-1/2 pt-5 ">
                <div className="grid w-full gap-4 md:gap-6 min-h-auto md:min-h-[517px]">
                  <Card className="w-full">
                   <CardHeader className="border-b border-b-border">
                      <div className="flex flex-wrap items-center justify-between space-y-2 xl:space-y-0">
                        <CardTitle className="font-bold tracking-tight">Chart</CardTitle>
                        <Badge className={`!mt-0 bg-${userChartConfig?.users?.color}-500`}>{userChartConfig?.users?.label}</Badge>
                        <Badge className={`!mt-0 bg-${userChartConfig?.feeds?.color}-500`}>{userChartConfig?.feeds?.label}</Badge>
                        <Badge className={`!mt-0 bg-${userChartConfig?.courses?.color}-500`}>{userChartConfig?.courses?.label}</Badge>
                        {/* <Badge className={`bg-${userChartConfig?.jobs?.color}-500`}>{userChartConfig?.jobs?.label}</Badge> */}
                        <div className="hidden items-center space-x-2 md:flex">
                          <CalendarDateRangePicker date={graphDate} setDate={setGraphDate} disabledDates={disabledDates} open={openGraph} setOpen={setGraphOpen} />
                          { showResetButton &&  <Button disabled={loading} onClick={() => resetDate('graph')} className="flex items-center justify-center"><RotateCcw /></Button>}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="!p-2">
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

              {/* revenvue graph code  */}

              <div className="w-full lg:w-1/2 pt-5">
              <Card className="lg:col-span-3 min-h-auto md:min-h-[517px]">
                <CardHeader className="border-b border-b-border">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="font-bold tracking-tight text-nowrap">
                    Revenue Chart
                    </CardTitle>
                    <div className="hidden items-center ms-auto space-x-2 md:flex">
                      <CalendarDateRangePicker
                         date={revenueGraphDate}
                         setDate={setRevenueGraphDate}
                         disabledDates={disabledDates}
                         open={openReveGraph} 
                         setOpen={setRevGraphOpen}
                      />

{ showRevResetButton &&  <Button disabled={loading} onClick={() => resetDate('revGraph')} className="flex items-center justify-center"><RotateCcw /></Button>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  {!chartRevenue.length ? (
                    <div className="flex justify-center py-20">
                      <Image
                        src="/no-data.svg"
                        alt="No Data"
                        width={320}
                        height={320}
                        priority
                        className="size-[150px]"
                      />
                    </div>
                  ) : (
                    <ChartContainer config={revenueChartConfig}>
                      <LineChart
                        accessibilityLayer
                        data={chartRevenue}
                        margin={{
                          left: 20,
                          top: 20,
                          right: 20,
                          bottom: 40
                        }}
                      >
                        <CartesianGrid vertical={false} />
                        <defs>
                          <linearGradient
                            id="colorUser"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#0575E6" />
                            <stop offset="100%" stopColor="#00F260" />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          // tickFormatter={(value) => value.slice(0, 3)}
                        >
                          <Label
                            value="Day/Month"
                            position="insideBottom"
                            offset={-30}
                            style={{
                              fontSize: "14px"
                            }}
                          />
                        </XAxis>
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickCount={3}
                        >
                          <Label
                            value="Revenue Count"
                            angle={-90}
                            position="insideLeft"
                            offset={-10}
                            style={{
                              fontSize: "14px"
                            }}
                          />
                        </YAxis>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="line" />}
                        />
                        <Line
                          dataKey="user"
                          type="monotone"
                          stroke="url(#colorUser)"
                          strokeWidth={2}
                          dot={{ fill: "var(--color-user)" }}
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
