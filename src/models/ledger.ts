// models/Ledger.ts

import { Schema, model, models } from "mongoose";

// Define schema
const LedgerSchema = new Schema(
  {
    date: {
      type: String,
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
  },
  { timestamps: true }
);

// ✅ Add virtual field for population
LedgerSchema.virtual("Ledger_entries", {
  ref: "Ledger_entries", // model name of child
  localField: "_id", // primary key on Ledger
  foreignField: "ledger_id", // foreign key on LedgerEntries
});

// ✅ Allow virtuals to be included in JSON & objects
LedgerSchema.set("toObject", { virtuals: true });
LedgerSchema.set("toJSON", { virtuals: true });

// Create model
const Ledger = models.Ledger || model("Ledger", LedgerSchema);

export default Ledger;
