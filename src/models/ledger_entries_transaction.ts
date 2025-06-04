import mongoose from "mongoose";
import { Schema } from "mongoose";

const LedgerEntriesTransactionSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionNo: {
      type: String,
      required: false,
    },
    transactionAmount: {
      type: String,
      required: false,
    },
    ledger_entries_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

// This prevents model overwrite errors during hot-reloading

const LedgerEntriesTransaction =
  mongoose.models.Ledger_entries_transaction ||
  mongoose.model("Ledger_entries_transaction", LedgerEntriesTransactionSchema);
// const LedgerEntriesTransaction =
//   models.Ledger_entries_transaction ||
//   mongoose.model("Ledger_entries_transaction", LedgerEntriesTransactionSchema);

export default LedgerEntriesTransaction;
