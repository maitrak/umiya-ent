"use client";
import { SessionProvider } from "next-auth/react";
import { Paper, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { toast } from "sonner";
type ExcelRow = Record<string, string | number | null>;
const Upload = () => {
  const [data, setData] = useState<any>({});

  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name;
    const extension = fileName.split(".").pop().toLowerCase();

    if (extension === "xls" || extension === "xlsx") {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      setData(json);
    } else if (extension === "csv") {
      Papa.parse(file, {
        complete: (result) => {
          console.log("CSV Data", result.data);
          setData(result.data);
        },
        header: true,
        dynamicTyping: true,
        skipEmptyLines: false,
      });
    } else {
      alert("Unsupported file type. Please upload .csv, .xls, or .xlsx");
    }
  };
  const normalizeExcelData = (excelData: ExcelRow[]): ExcelRow[] => {
    if (!Array.isArray(excelData) || excelData.length < 2) return [];
    console.log("excelData", excelData);
    const headerRow = excelData[0];
    console.log("headerRow", headerRow);

    const headers = Object.values(headerRow);
    console.log("headers", headers);
    console.log(excelData.slice(1));

    return excelData.slice(1).map((row) => {
      const rowValues = Object.values(row);
      // console.log("rowValues", rowValues);
      const entry: Record<string, any> = {};

      headers.forEach((header, index) => {
        entry[String(header)] = rowValues[index];
      });

      return entry;
    });
  };
  const handleUpload = async () => {
    const normalizeData = normalizeExcelData(data);
    console.log({ normalizeData });

    if (normalizeData.length === 0) {
      toast.error("Please upload a valid file ot Not data in it");
    }
    const res = await fetch("/api/ledger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizeData),
    });

    if (res.ok) {
      // Check if the request was successful (status 200-299)
      const responseJson = await res.json();
      toast.success(responseJson.message);
    } else {
      console.error("Error fetching data:", res.status, res.statusText);
      // Optionally, you can try to parse error response if it's JSON
      try {
        const errorData = await res.json();
        console.error("Error details:", errorData);
      } catch (e: any) {
        console.error("Could not parse error response as JSON.", e);
      }
    }
  };

  return (
    <div className="items-center justify-center flex h-screen">
      <SessionProvider>
        <Paper elevation={3} sx={{ p: 3, maxWidth: 400, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            {new Date().getDate()}-{new Date().getMonth() + 1}-{new Date().getFullYear()}
          </Typography>

          <input type="file" accept=".csv, .xls, .xlsx" onChange={handleFile} />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, textTransform: "uppercase" }}
            onClick={handleUpload}>
            Up!
          </Button>
        </Paper>
      </SessionProvider>
    </div>
  );
};

export default Upload;
