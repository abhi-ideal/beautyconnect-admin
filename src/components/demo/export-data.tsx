"use client";
import React from 'react'
import { Button } from "@/components/ui/button";
import { ngxCsv } from "ngx-csv";

interface ExportType {
    columns: any,
    type: string,
    data:any
}

const ExportData = ({ columns, type, data }: ExportType) => {
   
    const downloadCSV = () => {
        const headers = columns
            .filter((col: any) => col?.header !== 'Action' && col?.header !== 'Image')
            .map((col: any) => col?.accessorKey || col?.header);
        const result = data?.results?.map((user: any) => {
            return columns
                .filter((col: any) => col?.header !== 'Action' && col?.header !== 'Image')
                .map((col: any) => {
                    return col?.accessorKey ? user[col?.accessorKey] : '';
                });
        });
        const options = {
            fieldSeparator: ",", quoteStrings: '"', decimalseparator: ".",
            showLabels: true, useBom: true, noDownload: false, headers: headers
        };
        new ngxCsv(result, type, options);
    };
    
    return (
        <>
            <Button className="ml-auto" onClick={() => downloadCSV()}>
                Export CSV
            </Button>
        </>
    );
}



export default ExportData;