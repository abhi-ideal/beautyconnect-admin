import { Label } from "@radix-ui/react-label";
import { Table, flexRender } from "@tanstack/react-table";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { Button } from "../ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { RotateCcw } from 'lucide-react';
import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
interface TanStackBasicTableFilterComponentProps<TData> {
  table: Table<TData>;
  statusFilter: string[];
  setColumnFilters: any;
}

export default function TanStackBasicTableFilterComponent<TData>({
  table,
  statusFilter,
  setColumnFilters
}: TanStackBasicTableFilterComponentProps<TData>) {
  const [filterValue, setFilterValue]: any = useState([]);
 
  const pathname = usePathname();


  const [date, setDate] = React.useState<any>();
  const disabledDates = {
    after: new Date()
  };

  const setDateValue=()=>{
    setColumnFilters((prev: any) => {
      const updatedArr = [...prev];
      const filterMap = new Map(updatedArr.map(item => [item.id, item]));
      filterMap.set('from', { id: 'from', value: date?.from });
      filterMap.set('to', { id: 'to', value: date?.to });
      return Array.from(filterMap.values());
    });
  }
  const reset=()=>{
    setColumnFilters([]);
    setDate(null);
    setFilterValue([]);
  }
  const showDateFilter: any = ["/users", "/debates", "/skills", "/feedback-collection"];

  return (
    <>
    <div className="flex items-center mb-4 gap-3">
      { showDateFilter.includes(pathname) && 
      <>
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger>
          <CalendarDateRangePicker date={date} setDate={setDate} disabledDates={disabledDates} />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Pick a date</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={100}>
          <TooltipTrigger>
          <Button disabled={!date} onClick={()=>setDateValue()} >Date Filter</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Date filter</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={100}>
          <TooltipTrigger>
          <Button onClick={()=>reset()}><RotateCcw /></Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Reset</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      </>
      }
      <div className="ml-[auto]">
        <Sheet key="right">
          <SheetTrigger asChild>
            <Button variant="outline"
            
            >
              {" "}
              <Filter className="h-4 w-4" />{" "}
              <div className="text-left">
                {" "}
                <span className="pl-2">Filter and Search Records</span>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Filter and search records.</SheetDescription>
            </SheetHeader>
            <div className="pt-6">
              <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
                {table.getHeaderGroups()[0].headers.map(
                  (header) =>
                    !header.isPlaceholder &&
                    header.column.getCanFilter() && (
                      <div key={header.id} className="">
                        <Label className="block font-semibold text-lg">
                          {`${flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}`}
                          :
                        </Label>

                        {header.column.columnDef.header === "Status" ||
                        header.column.columnDef.header === "AnswerType" ||
                        header.column.columnDef.header === "Type" ? (
                          <Select
                            onValueChange={(e) => {
                              setFilterValue((prev: any) => {
                                let arr = [...prev];
                                const index = arr.findIndex(
                                  (el: any) => el?.id == header?.id
                                );

                                if (index == -1) {
                                  arr.push({ id: header?.id, value: e });
                                } else {
                                  arr[index].value = e;
                                }
                                return arr;
                              });
                            }}
                            defaultValue={
                              (header.column.getFilterValue() as string) || ""
                            }
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={`Select ${
                                  header.column.columnDef.header === "Status"
                                    ? "Status"
                                    : header.column.columnDef.header === "Type"
                                    ? "Type"
                                    : "AnswerType"
                                }`}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value=" ">Select</SelectItem>
                              {
                                statusFilter.map((status:any, i:number)=>{
                                  return (
                                      <SelectItem
                                        value={status}
                                        key={i}
                                      >
                                        {status}
                                      </SelectItem>
                                  )
                                })
                              }
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            className="w-full"
                            placeholder={`Filter ${flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )} ...`}
                            defaultValue={
                              (header.column.getFilterValue() as string) || ""
                            }
                            onChange={(e) => {
                              setFilterValue((prev: any) => {
                                let arr = [...prev];
                                const index = arr.findIndex(
                                  (el: any) => el?.id == header?.id
                                );

                                if (index == -1) {
                                  arr.push({
                                    id: header?.id,
                                    value: e.target.value
                                  });
                                } else {
                                  arr[index].value = e.target.value;
                                }
                                return arr;
                              });
                              // header.column?.setFilterValue(e.target.value);
                            }}
                          />
                        )}
                      </div>
                    )
                )}

              </div>
            </div>

            <SheetFooter className="pt-4">
              <SheetClose asChild>
                <Button onClick={() => reset()}>Reset</Button>
              </SheetClose>

              <SheetClose asChild>
                <Button
                  type="submit"
                  onClick={() => setColumnFilters(filterValue)}
                >
                 Search
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
    </>
  );
}
