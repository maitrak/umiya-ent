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

LedgerEntriesSchema.virtual("Ledger_entries_transaction", {
  ref: "Ledger_entries_transaction", // model name of child
  localField: "_id", // primary key on Ledger
  foreignField: "ledger_entries_id", // foreign key on LedgerEntries
});

LedgerEntriesSchema.set("toObject", { virtuals: true });
LedgerEntriesSchema.set("toJSON", { virtuals: true });
const LedgerEntries = models.Ledger_entries || model("Ledger_entries", LedgerEntriesSchema);

export default LedgerEntries;
