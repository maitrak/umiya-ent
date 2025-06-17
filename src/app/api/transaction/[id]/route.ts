import connectToDatabase from "@/lib/mongodb";
import LedgerEntries from "@/models/ledger_entries";
import LedgerEntriesTransaction from "@/models/ledger_entries_transaction";
import { NextRequest, NextResponse } from "next/server";

// GET /api/transaction/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const ledger = await LedgerEntries.findById(params.id).populate("Ledger_entries_transaction");
    if (!ledger) {
      return NextResponse.json({ error: "Ledger not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: ledger,
      message: "Ledger entries fetched successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Server Error", details: err.message }, { status: 500 });
  }
}

// POST /api/transaction/[id]
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const body = await req.json();
    let amount = 0;
    for (const data of body) {
      await LedgerEntriesTransaction.create({
        ledger_entries_id: params.id,
        type: data.label,
        amount: +data.amount,
        transactionNo: data.cheque,
      });
      amount += +data.amount;
    }
    const old = await LedgerEntries.findById(params.id);
    const newAmount = old?.amount + amount;

    await LedgerEntries.updateOne({ _id: params.id }, { $set: { amount: newAmount } });
    return NextResponse.json({
      success: true,
      data: body,
      message: "Ledger entry transaction created successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
  }
}
