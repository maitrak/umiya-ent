// models/Ledger.ts

import { Schema, model, models } from "mongoose";

const LedgerEntriesSchema = new Schema(
  {
    user: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    pending: {
      type: Number,
      required: true,
    },
    billNo: {
      type: String,
      required: true,
    },
    party: {
      type: String,
      required: true,
    },
    discount: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
    },
    sales_man: {
      type: String,
      required: false,
    },
    ledger_id: {
      type: Schema.Types.ObjectId,
      ref: "Ledger",
      required: true,
    },
  },
  { timestamps: true }
);

const LedgerEntries = models.LedgerEntries || model("Ledger_entries", LedgerEntriesSchema);

export default LedgerEntries;
