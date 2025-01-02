import moment from 'moment';
import React, { useState } from 'react'
import { Button } from 'react-day-picker'

const datePreset = ({ date, setDate }: any) => {
    // const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
    const [dateLabel, setDateLabel] = useState<string>("");

    const dateOptionsObject: { [key: string]: string } = {
        today: "Today",
        yesterday: "Yesterday",
        weekToDate: "Week to Date",
        lastWeek: "Last Week",
        monthToDate: "Month to Date",
        lastMonth: "Last Month",
        quarterToDate: "Quarter to Date",
        yearToDate: "Year to Date",
        lastYear: "Last Year"
    };

    const selectdate = (type: string) => {
        switch (type) {
            case "today": {
                const date = moment().format("MMM DD, YYYY");
                setDateLabel("Today (" + date + ")");
                setDate({
                    from: moment().startOf("day").toDate(),
                    to: moment().endOf("day").toDate(),
                });
                break;
            }
            case "yesterday": {
                const yesterdayDate = moment().subtract(1, "days").format("MMM DD, YYYY");
                setDateLabel("Yesterday (" + yesterdayDate + ")");
                setDate({
                    from: moment().subtract(1, "days").startOf("day").toDate(),
                    to: moment().subtract(1, "days").endOf("day").toDate(),
                });
                break;
            }
            case "weekToDate": {
                const weekStartDay = moment().startOf("week").format("MMM DD");
                const currentDay = moment().format("MMM DD, YYYY");
                setDateLabel("Week to Date (" + weekStartDay + " - " + currentDay + ")");
                setDate({
                    from: moment().startOf("week").toDate(),
                    to: moment().endOf("day").toDate(),
                });
                break;
            }
            case "lastWeek": {
                const lastWeekStartDate = moment().subtract(1, "week").startOf("week").format("MMM DD");
                const lastWeekEndDate = moment().subtract(1, "week").endOf("week").format("MMM DD, YYYY");
                setDateLabel("Last Week (" + lastWeekStartDate + " - " + lastWeekEndDate + ")");
                setDate({
                    from: moment().subtract(1, "week").startOf("week").toDate(),
                    to: moment().subtract(1, "week").endOf("week").toDate(),
                });
                break;
            }
            case "monthToDate": {
                const monthStartDate = moment().startOf("month").format("MMM DD");
                const currentDate = moment().format("MMM DD, YYYY");
                setDateLabel("Month to Date (" + monthStartDate + " - " + currentDate + ")");
                setDate({
                    from: moment().startOf("month").toDate(),
                    to: moment().endOf("day").toDate(),
                });
                break;
            }
            case "lastMonth": {
                const lastMonthStartDate = moment().subtract(1, "month").startOf("month").format("MMM DD");
                const lastMonthEndDate = moment().subtract(1, "month").endOf("month").format("MMM DD, YYYY");
                setDateLabel("Last Month (" + lastMonthStartDate + " - " + lastMonthEndDate + ")");
                setDate({
                    from: moment().subtract(1, "month").startOf("month").toDate(),
                    to: moment().subtract(1, "month").endOf("month").toDate(),
                });
                break;
            }
            case "quarterToDate": {
                const quarterStartDate = moment().startOf("quarter").format("MMM DD");
                const currentDate = moment().format("MMM DD, YYYY");
                setDateLabel("Quarter to Date (" + quarterStartDate + " - " + currentDate + ")");
                setDate({
                    from: moment().startOf("quarter").toDate(),
                    to: moment().endOf("day").toDate(),
                });
                break;
            }
            case "yearToDate": {
                const yearStartDate = moment().startOf("year").format("MMM DD");
                const currentDate = moment().format("MMM DD, YYYY");
                setDateLabel("Year to Date (" + yearStartDate + " - " + currentDate + ")");
                setDate({
                    from: moment().startOf("year").toDate(),
                    to: moment().endOf("day").toDate(),
                });
                break;
            }
            case "lastYear": {
                const lastYearStartDate = moment().subtract(1, "year").startOf("year").format("MMM DD");
                const lastYearEndDate = moment().subtract(1, "year").endOf("year").format("MMM DD, YYYY");
                setDateLabel("Last Year (" + lastYearStartDate + " - " + lastYearEndDate + ")");
                setDate({
                    from: moment().subtract(1, "year").startOf("year").toDate(),
                    to: moment().subtract(1, "year").endOf("year").toDate(),
                });
                break;
            }
            default:
                break;
        }
    };

    return (
        <div>
            <div>
                <strong>Selected Date Range:</strong>
                <div>{dateLabel}</div>
                <div>{date ? `From: ${date.from.toString()} To: ${date.to.toString()}` : "No date range selected"}</div>
            </div>
            <ul>
                {Object.keys(dateOptionsObject).map((key) => (
                    <li onClick={() => selectdate(key)} key={key}>
                        {dateOptionsObject[key]}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default datePreset

