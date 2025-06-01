import { Schema, model, models } from "mongoose";

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
  models.Ledger_entries_transaction ||
  model("Ledger_entries_transaction", LedgerEntriesTransactionSchema);

export default LedgerEntriesTransaction;
