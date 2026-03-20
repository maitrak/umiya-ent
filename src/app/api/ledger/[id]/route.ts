import connectToDatabase from "@/lib/mongodb";
import Ledger from "@/models/ledger";
import "@/models/ledger_entries";
import "@/models/ledger_entries_transaction";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

const buildCashCollectionRows = (cashCollection: any) => {
  const noteDenominations = ["500", "200", "100", "50", "20", "10", "5"];
  const coinDenominations = ["20", "10", "5", "2", "1", "0.50", "0.25"];

  const noteRows = noteDenominations.map((denomination) => {
    const quantity = Number(cashCollection?.notes?.[denomination] ?? 0);
    return {
      Category: "Notes",
      Denomination: denomination,
      Quantity: quantity,
      Total: quantity * Number(denomination),
    };
  });

  const coinRows = coinDenominations.map((denomination) => {
    const quantity = Number(cashCollection?.coins?.[denomination] ?? 0);
    return {
      Category: "Coins",
      Denomination: denomination,
      Quantity: quantity,
      Total: quantity * Number(denomination),
    };
  });

  return [...noteRows, ...coinRows];
};
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
        const transactions = entry?.Ledger_entries_transaction ?? [];
        const mode = transactions
          .map((transaction: any) =>
            transaction?.type
              ? transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1).toLowerCase()
              : ""
          )
          .filter(Boolean)
          .join(", ");
        const transactionCreatedAt = transactions
          .map((transaction: any) =>
            transaction?.createdAt ? moment(transaction.createdAt).format("YYYY-MM-DDTHH:mm:ss.SSSZ") : ""
          )
          .filter(Boolean)
          .join(", ");

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
          Company: entry.type,
          Mode: mode,
          "Transaction Created At": transactionCreatedAt,
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
      const cashCollectionRows = buildCashCollectionRows(ledgerWithEntries?.cashCollection);
      const cashCollectionSheet = XLSX.utils.json_to_sheet(cashCollectionRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Ledger");
      XLSX.utils.book_append_sheet(
        wb,
        cashCollectionSheet,
        "Cash Collection sheet"
      );
      const buffer = XLSX.write(wb, { type: "buffer", bookType: "xls" });

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Disposition": "attachment; filename=ledger-export.xls",
          "Content-Type": "application/vnd.ms-excel",
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
