"use client";
import { SessionProvider, useSession } from "next-auth/react";
import UserButton from "@/components/user-button";
import {
  Paper,
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Button,
  Box,
  Divider,
  Accordion,
  AccordionSummary,
} from "@mui/material";
import { Description as DocumentIcon, CalendarToday as CalendarIcon } from "@mui/icons-material";
import React, { useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Papa from "papaparse";

const Upload = () => {
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  const [data, setData] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  return (
    <div>
      <SessionProvider>
        <UserButton getData={setUser} />

        <Paper elevation={3} sx={{ p: 3, maxWidth: 400, borderRadius: 2 }}>
          {/* Header */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            08-M2025
          </Typography>

          <input
            type="file"
            accept=".csv, .xls"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                Papa.parse(file, {
                  complete: (result) => {
                    console.log("result", result);
                    setData(result.data);
                  },
                  header: true, // If your CSV has headers
                  dynamicTyping: true,
                  skipEmptyLines: true,
                });
              }
            }}
          />

          {/* Bill Details */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                Bill No.
              </Grid>
              <Grid item xs={3}>
                Company
              </Grid>
              <Grid item xs={4}>
                Party Name
              </Grid>
              <Grid item xs={2}>
                Amt.
              </Grid>
            </Grid>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header">
                <Grid item xs={12} container>
                  <Grid item xs={3}>
                    504272
                  </Grid>
                  <Grid item xs={3}>
                    Colgate
                  </Grid>
                  <Grid item xs={4}>
                    Balaji Super Market
                  </Grid>
                  <Grid item xs={2}>
                    £209.00
                  </Grid>
                </Grid>
              </AccordionSummary>

              {/* Status Section */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography>Pending: £0.00</Typography>
                <Typography>Collected: £0.00</Typography>
                <Typography color="orange">Status: PENDING</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Payment Methods */}
              <ToggleButtonGroup
                exclusive
                value={paymentMethod}
                onChange={(e, newMethod) => setPaymentMethod(newMethod)}
                orientation="vertical"
                fullWidth>
                <ToggleButton value="cash" sx={{ justifyContent: "flex-start" }}>
                  <CalendarIcon fontSize="small" />
                  <DocumentIcon fontSize="small" sx={{ mx: 1 }} />
                  Cash
                  <TextField
                    variant="standard"
                    placeholder="Amount"
                    sx={{ mx: 2, width: 100 }}
                    InputProps={{ disableUnderline: true }}
                  />
                </ToggleButton>

                <ToggleButton value="cheque" sx={{ justifyContent: "flex-start" }}>
                  <CalendarIcon fontSize="small" />
                  <Box sx={{ mx: 1 }}>🌐</Box>
                  Cheque
                </ToggleButton>

                <ToggleButton value="credit" sx={{ justifyContent: "flex-start" }}>
                  <CalendarIcon fontSize="small" />
                  <Box sx={{ mx: 1 }}>🌑</Box>
                  CREDIT
                </ToggleButton>

                <ToggleButton value="cancelled" sx={{ justifyContent: "flex-start" }}>
                  <CalendarIcon fontSize="small" />
                  <Box sx={{ mx: 1 }}>🌑</Box>
                  CANCELLED
                </ToggleButton>
              </ToggleButtonGroup>
            </Accordion>
          </Grid>

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
