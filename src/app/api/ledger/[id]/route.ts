import connectToDatabase from "@/lib/mongodb";
import Ledger from "@/models/ledger";
import "@/models/ledger_entries";
import "@/models/ledger_entries_transaction";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
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

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const updated = await Ledger.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true } // return updated document
    );
    if (body?.Approved) {
      const ledgerWithEntries = await Ledger.findById(params.id).populate({
        path: "Ledger_entries",
        populate: {
          path: "Ledger_entries_transaction",
        },
      });
      const ledgerData: any[] = [];
      ledgerWithEntries?.Ledger_entries?.map((entry: any, index: number) => {
        ledgerData.push({
          "SR.": index + 1,
          "Bill Date": moment(entry.date).format("DD-MM-YYYY"),
          "Bill No.": entry.billNo,
          Party: entry.party,
          "Bill Amount": entry.amount,
          "Previous Received": 0,
          Salesman: entry.sales_man,
          "Pending Amount": entry.pending,
          "Full Payment": "P-PART",
          Cash: "0",
          Discount: "0",
          "Cheque Amount": 0,
          "Cheque No.": 0,
          "Cheque Date": "",
          Bank: " ",
          Branch: " ",
          "Payment Remark": "",
          "TCS On Bill With TCS": "0",
          Mode: entry?.Ledger_entries_transaction?.[0]?.type,
        });
      });
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
