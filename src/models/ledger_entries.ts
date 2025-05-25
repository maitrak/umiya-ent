import mongoose, { Document, Model, Schema } from "mongoose";

const LedgerSchema = new mongoose.Schema(
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
    transactionNo: {
      type: String,
      required: false,
    },
    transactionAmount: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("Ledger_entries", LedgerSchema);

export default User;
