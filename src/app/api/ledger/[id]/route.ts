import connectToDatabase from "@/lib/mongodb";
import Ledger from "@/models/ledger";
import LedgerEntries from "@/models/ledger_entries";
import LedgerEntriesTransaction from "@/models/ledger_entries_transaction";
import { NextRequest, NextResponse } from "next/server";

// GET /api/transaction/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const ledgerWithEntries = await Ledger.find({ date: params.id }).populate({
      path: "Ledger_entries",
      populate: {
        path: "Ledger_entries_transaction",
      },
    });

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
