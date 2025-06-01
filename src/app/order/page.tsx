"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "sonner";

interface PaymentMethodProps {
  label: string;
  emoji: string; // Assuming emoji is a string (e.g., "💳" or a path to an image)
  amount: string; // Assuming amount is a number
  multi: boolean; // Assuming multi is a boolean
  handleClick: (attr: string, label: string, amount: string, ispos: boolean) => void; // Assuming handleClick takes a string ID and returns void
  attr: string; // Optional: for other input attributes
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
  const [payload, setPayload] = useState(null);
  const handleAmount = (value: string) => {
    if (value > amount) {
      toast.error("Amount is greater than the amount in the ledger");
    } else {
      setAmount(value);
    }
  };

  useEffect(() => {
    if (data !== null) {
      setPayload(data.find((el: any) => el.type === label));
      if (!!data.find((el: any) => el.type === label)) {
        setAmount(data.find((el: any) => el.type === label).amount);
      }
    }
  }, [data]);

  const handleCheck = (e: any) => {
    if (e) {
      handleClick(attr, label, amountSettle, true);
    } else {
      handleClick(attr, label, amountSettle, false);
    }
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
          onClick={() => {
            setOpen(!open);
          }}
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
  [key: string]: boolean; // This is an index signature: allows any string key with a boolean value
}

export default function AccordionUI() {
  const [mainOpen, setMainOpen] = useState<AccordionState>({}); // <--- Apply the type here
  const [ledgers, setLedgers] = useState<any>({});

  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const res = await axios.get("/api/ledger");
        setLedgers(res.data.data[0]);
        let toggle = {};
        console.log(res.data.data);

        res.data.data.Ledger_entries.map((entry: any) => {
          toggle = { ...toggle, [entry?._id]: false };
        });
        setMainOpen(toggle);
      } catch (err) {
        console.error("Error fetching ledgers:", err);
      } finally {
      }
    };

    fetchLedgers();
  }, []);

  const handleOpen = async (id: string) => {
    setMainOpen({ ...mainOpen, [id]: !mainOpen[id] });
  };

  const handleClick = async (id: any, label: any, amount: any, ispos: boolean) => {
    setLedgers((prev: any) => ({
      ...prev,
      Ledger_entries: prev.Ledger_entries.map((entry: any) => {
        const total = parseInt(entry.amount);
        const found = parseInt(amount);
        return entry._id === id
          ? {
              ...entry,
              amount: ispos ? total + found : total - found,
              ...(ispos ? { transaction: { label, id, amount } } : { transaction: {} }),
            }
          : entry;
      }),
    }));
  };

  const handleCheck = (e: any, attr: any, label: any, amountSettle: any) => {
    if (e) {
      handleClick(attr, label, amountSettle, true);
    } else {
      handleClick(attr, label, amountSettle, false);
    }
  };

  const handleSave = async (id: any) => {
    const payload = ledgers.Ledger_entries.find((el: any) => el._id === id);
    await fetch("/api/transaction/" + id, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: payload.transaction.label, amount: payload.transaction.amount }),
    });
  };

  return (
    <div className="bg-white p-4 font-sans min-h-screen">
      <div className="max-w-md mx-auto rounded-xl shadow border border-gray-300 overflow-hidden">
        {/* Date Header */}
        <div className="bg-blue-600 text-white text-center py-2 font-semibold text-lg">
          {ledgers?.date ? moment(ledgers.date).format("DD-mm-yyyy") : ""}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-4 text-xs font-bold border-b text-center bg-white">
          <div className="py-1">Bill No.</div>
          <div className="py-1">Company</div>
          <div className="py-1">Party Name</div>
          <div className="py-1">Amt.</div>
        </div>

        {/* Bill Row */}
        {ledgers?.Ledger_entries &&
          ledgers?.Ledger_entries.map((entry: any) => (
            <div className="relative" key={entry?._id}>
              <div
                className="grid grid-cols-4 items-start text-sm bg-gray-200 p-2 cursor-pointer"
                onClick={() => handleOpen(entry?._id)}>
                <div>{entry.billNo}</div>
                <div>-</div>
                <div className="text-xs">{entry.party}</div>
                <div className="flex justify-between items-right">
                  <span className="font-semibold">₹{entry?.pending}</span>
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform ${mainOpen ? "rotate-90" : ""}`}
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

              {/* Main Accordion Content */}
              {mainOpen[entry?._id] && (
                <div className="px-3 py-2 bg-gray-100 space-y-2 text-sm">
                  {/* Status Row */}
                  <div className="flex justify-between text-xs">
                    <span className="text-red-600 font-semibold">Pending: ₹{entry?.pending}</span>
                    <span className="text-green-600 font-semibold">
                      Collected: ₹{entry?.amount}
                    </span>
                    <span
                      className={
                        "font-semibold " +
                        (entry?.amount >= entry?.pending ? "text-green-600" : "text-red-600")
                      }>
                      Status: {entry?.amount >= entry?.amount ? "Finalized" : "PENDING"}
                    </span>
                  </div>

                  {/* Payment Methods */}
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

                  {/* Credit & Cancelled */}
                  <div className="flex items-center px-2 py-2 bg-white border rounded shadow-sm space-x-2">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheck(e.target.checked, entry?._id, "credit", entry?.pending)
                      }
                    />
                    <span>✉️ CREDIT</span>
                  </div>
                  <div className="flex items-center px-2 py-2 bg-white border rounded shadow-sm space-x-2">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheck(e.target.checked, entry?._id, "cancel", entry?.pending)
                      }
                    />
                    <span>❌ CANCELLED</span>
                  </div>
                  <div className="flex items-center justify-end w-full">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleSave(entry?._id)}>
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
