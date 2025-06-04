"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "sonner";

interface PaymentMethodProps {
  label: string;
  emoji: string;
  amount: string;
  multi: boolean;
  handleClick: (
    attr: string,
    label: string,
    amount: string,
    ispos: boolean,
    transaction?: any
  ) => void;
  attr: string;
  data?: any;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  label,
  emoji,
  amount,
  multi,
  handleClick,
  attr,
  data,
}) => {
  const [open, setOpen] = useState(false);
  const [amountSettle, setAmount] = useState(amount);
  const [payload, setPayload] = useState<Record<string, any> | null>(null);
  const [cheque, setCheque] = useState("");

  const handleAmount = (value: string) => {
    if (Number(value) > Number(amount)) {
      toast.error("Amount is greater than the amount in the ledger");
    } else {
      setAmount(value);
    }
  };

  useEffect(() => {
    if (data !== null) {
      const match = data.find((el: any) => el.type === label);
      setPayload(match);
      if (match) setAmount(match.amount);
    }
  }, [data]);

  const handleCheck = (e: any) => {
    handleClick(attr, label, amountSettle, e, cheque || null);
  };

  return (
    <div className="border rounded bg-white shadow-sm">
      <button className="w-full flex justify-between items-center px-2 py-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            onChange={(e) => handleCheck(e.target.checked)}
            disabled={!!payload}
          />
          <span>
            {emoji} {label}
          </span>
        </div>
        <svg
          onClick={() => setOpen(!open)}
          className={`w-4 h-4 transition-transform transform ${open ? "rotate-90" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {open && (
        <div className="px-3 py-2 space-y-2 bg-gray-50">
          {multi && (
            <input
              type="text"
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Transaction No."
              value={payload?.transactionNo}
              disabled={!!payload?.transactionNo}
              onChange={(e) => setCheque(e.target.value)}
            />
          )}
          <input
            type="text"
            className="w-full border rounded px-2 py-1 text-sm"
            placeholder="Amount"
            value={amountSettle}
            disabled={!!payload}
            onChange={(e) => handleAmount(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

interface AccordionState {
  [key: string]: boolean;
}

export default function AccordionUI() {
  const [mainOpen, setMainOpen] = useState<AccordionState>({});
  const [ledgers, setLedgers] = useState<any>({});

  useEffect(() => {
    fetchLedgers();
  }, []);

  const fetchLedgers = async () => {
    try {
      const res = await axios.get("/api/ledger");
      setLedgers(res.data.data[0]);
      const toggle: AccordionState = {};
      res.data.data[0].Ledger_entries.forEach((entry: any) => {
        toggle[entry._id] = false;
      });
      setMainOpen(toggle);
    } catch (err) {
      console.error("Error fetching ledgers:", err);
    }
  };

  const handleOpen = (id: string) => {
    setMainOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClick = (id: any, label: any, amount: any, ispos: boolean, cheque: string) => {
    setLedgers((prev: any) => ({
      ...prev,
      Ledger_entries: prev.Ledger_entries.map((entry: any) => {
        const total = parseInt(entry.amount);
        const found = parseInt(amount);
        return entry._id === id
          ? {
              ...entry,
              amount: ispos ? total + found : total - found,
              ...handlemayBeSaved(entry, label, id, amount, ispos, cheque),
            }
          : entry;
      }),
    }));
  };

  const handlemayBeSaved = (
    entry: any,
    label: any,
    id: any,
    amount: any,
    ispos: any,
    cheque: string
  ) => {
    const found = entry?.transaction ?? [];
    const out = found.filter((el: any) => el.label !== label);
    return ispos ? { transaction: [...out, { label, id, amount, cheque }] } : { transaction: out };
  };

  const handleCheck = (e: any, attr: any, label: any, amountSettle: any, cheque: any) => {
    handleClick(attr, label, amountSettle, e, cheque);
  };

  const handleSave = async (id: any) => {
    const payload = ledgers.Ledger_entries.find((el: any) => el._id === id);
    await fetch("/api/transaction/" + id, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.transaction),
    });
    await fetchLedgers();
  };

  return (
    <div className="bg-white p-2 sm:p-4 font-sans min-h-screen">
      <div className="w-full sm:max-w-md mx-auto rounded-xl shadow border border-gray-300 overflow-hidden">
        <div className="bg-blue-600 text-white text-center py-2 font-semibold text-lg">
          {ledgers?.date ? moment(ledgers.date).format("DD-MM-YYYY") : ""}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 text-[10px] sm:text-xs font-bold border-b text-center bg-white">
          <div className="py-1">Bill No.</div>
          <div className="py-1">Company</div>
          <div className="py-1">Party Name</div>
          <div className="py-1">Amt.</div>
        </div>

        {ledgers?.Ledger_entries &&
          ledgers.Ledger_entries.map((entry: any) => (
            <div className="relative" key={entry?._id}>
              <div
                className="grid grid-cols-2 sm:grid-cols-4 items-start text-sm bg-gray-200 p-2 cursor-pointer"
                onClick={() => handleOpen(entry._id)}>
                <div>{entry.billNo}</div>
                <div>-</div>
                <div className="text-xs">{entry.party}</div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">₹{entry?.pending}</span>
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform ${
                      mainOpen[entry._id] ? "rotate-90" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {mainOpen[entry._id] && (
                <div className="px-3 py-2 bg-gray-100 space-y-2 text-sm">
                  <div className="flex flex-col sm:flex-row justify-between text-xs gap-1">
                    <span className="text-red-600 font-semibold">Pending: ₹{entry?.pending}</span>
                    <span className="text-green-600 font-semibold">
                      Collected: ₹{entry?.amount}
                    </span>
                    <span
                      className={`font-semibold ${
                        entry?.amount >= entry?.pending ? "text-green-600" : "text-red-600"
                      }`}>
                      Status: {entry?.amount >= entry?.pending ? "Finalized" : "PENDING"}
                    </span>
                  </div>

                  <PaymentMethod
                    label="Cash"
                    emoji="💵"
                    amount={entry?.pending}
                    multi={false}
                    handleClick={handleClick}
                    attr={entry?._id}
                    data={entry?.Ledger_entries_transaction}
                  />
                  <PaymentMethod
                    label="UPI"
                    emoji="📱"
                    amount={entry?.pending}
                    multi={false}
                    handleClick={handleClick}
                    attr={entry?._id}
                    data={entry?.Ledger_entries_transaction}
                  />
                  <PaymentMethod
                    label="Cheque"
                    emoji="🏦"
                    amount={entry?.pending}
                    multi={true}
                    handleClick={handleClick}
                    attr={entry?._id}
                    data={entry?.Ledger_entries_transaction}
                  />

                  <div className="flex items-center px-2 py-2 bg-white border rounded shadow-sm space-x-2">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheck(e.target.checked, entry._id, "credit", entry?.pending, null)
                      }
                    />
                    <span>✉️ CREDIT</span>
                  </div>

                  <div className="flex items-center px-2 py-2 bg-white border rounded shadow-sm space-x-2">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheck(e.target.checked, entry._id, "cancel", entry?.pending, null)
                      }
                    />
                    <span>❌ CANCELLED</span>
                  </div>

                  <div className="flex items-center justify-end w-full">
                    <button
                      className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleSave(entry._id)}>
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
