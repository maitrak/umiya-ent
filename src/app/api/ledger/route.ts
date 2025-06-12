import connectToDatabase from "@/lib/mongodb";
import Ledger from "@/models/ledger";
import LedgerEntries from "@/models/ledger_entries";
import { NextRequest, NextResponse } from "next/server";
import "@/models/ledger_entries_transaction";
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    let totalAmount = 0;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    const formatted = `${yyyy}-${mm}-${dd}`;
    for (const data of body) {
      totalAmount += data?.["Bill Amount"] ? data["Bill Amount"] : 0;
    }

    const found = await Ledger.findOne({ date: formatted });
    if (found) {
      return NextResponse.json({ success: true, data: [], message: "found data" });
    }

    const entries = await Ledger.create({ date: formatted, amount: totalAmount, pending: 0 });

    for (const entry of body) {
      LedgerEntries.create({
        amount: entry?.["Bill Amount"] ? entry["Bill Amount"] : 0,
        pending: entry?.["Pending Amount"] ? entry["Pending Amount"] : 0,
        billNo: entry?.["Bill No."] ? entry["Bill No."] : "",
        party: entry?.["Party"] ? entry["Party"] : "",
        discount: entry?.["Discount"] ? entry["Discount"] : 0,
        type: entry?.["Company"] ? entry["Company"] : "",
        sales_man: entry?.["Salesman"] ? entry["Salesman"] : "",
        ledger_id: entries?.id,
        user: entry?.["User ID"] ? entry["User ID"] : 0,
      });
    }
    return NextResponse.json({
      success: true,
      data: entries,
      message: "Ledger entries created successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const now = new Date();

    const todayIST = new Date(now);
    todayIST.setHours(0, 0, 0, 0);

    const tomorrowIST = new Date(todayIST);
    tomorrowIST.setDate(todayIST.getDate() + 1);

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formatted = `${yyyy}-${mm}-${dd}`;

    const ledgerWithEntries = await Ledger.find({ date: formatted }).populate({
      path: "Ledger_entries",
      populate: {
        path: "Ledger_entries_transaction",
      },
    });
    console.log("ledgerWithEntries", ledgerWithEntries);

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
