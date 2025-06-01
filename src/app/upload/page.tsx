"use client";
import { SessionProvider, useSession } from "next-auth/react";
import UserButton from "@/components/user-button";
import { Paper, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const Upload = () => {
  const [data, setData] = useState<unknown[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    console.log("user", session);
  }, [data]);

  return (
    <div>
      <SessionProvider>
        <UserButton />

        <Paper elevation={3} sx={{ p: 3, maxWidth: 400, borderRadius: 2 }}>
          {/* Header */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            08-M2025
          </Typography>

          <input
            type="file"
            accept=".csv, .xls"
            onChange={(e) => {
              const files = e.target.files;
              if (!files || files.length === 0) return;

              const file = files[0];
              Papa.parse(file, {
                complete: (result) => {
                  console.log("result", result);
                  setData(result?.data);
                },
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
              });
            }}
          />

          {/* Bill Details */}

          {/* Action Button */}
          <Button variant="contained" fullWidth sx={{ mt: 2, textTransform: "uppercase" }}>
            Up!
          </Button>
        </Paper>
      </SessionProvider>
    </div>
  );
};

export default Upload;
