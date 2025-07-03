import connectToDatabase from "@/lib/mongodb";
import Ledger from "@/models/ledger";
import "@/models/ledger_entries";
import "@/models/ledger_entries_transaction";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";
// GET /api/transaction/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    console.log("params.id", params.id);
    const ledgerWithEntries = await Ledger.findById(params.id).populate({
      path: "Ledger_entries",
      populate: {
        path: "Ledger_entries_transaction",
      },
    });
    console.log("==============================================", ledgerWithEntries);

    return NextResponse.json({
      success: true,
      data: ledgerWithEntries,
      message: "Ledger entries fetched successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
  res: NextResponse
) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const updated = await Ledger.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true } // return updated document
    );
    if (body?.Approved) {
      const ledgerData = [
        {
          date: "2025-07-03",
          billNo: "30-JR25263678",
          party: "COUNTER SALES (KAUSHAL BHAI)",
          amount: 2495,
          cash: 2495,
          upi: 0,
          cheque: 0,
          credit: 0,
          cancelled: 0,
          salesMan: "JAIMIN PATEL",
        },
        {
          date: "2025-07-03",
          billNo: "500013-AB25",
          party: "AARAV PHARMACY & DRUGGIST.",
          amount: 2348,
          cash: 0,
          upi: 2348,
          cheque: 0,
          credit: 0,
          cancelled: 0,
          salesMan: "HETANSHI PATEL",
        },
      ];
      if (!Array.isArray(ledgerData)) {
        return NextResponse.json(
          { success: false, error: "Invalid JSON format. Must be an array." },
          { status: 500 }
        );
      }

      // Create worksheet and workbook
      const ws = XLSX.utils.json_to_sheet(ledgerData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Ledger");
      const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Disposition": "attachment; filename=ledger-export.xlsx",
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });
    }
    return NextResponse.json({
      success: true,
      data: updated,
      message: "Ledger updated successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}
