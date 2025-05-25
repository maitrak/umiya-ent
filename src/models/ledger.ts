import mongoose, { Document, Model, Schema } from "mongoose";

const LedgerSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    pending: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("Ledger", LedgerSchema);

export default User;
