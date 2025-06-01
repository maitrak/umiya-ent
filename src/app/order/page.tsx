"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const PaymentMethod = ({ label, emoji, id, amount, multi, handleClick, handleChange, attr }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded bg-white shadow-sm">
      <button className="w-full flex justify-between items-center px-2 py-2">
        <div className="flex items-center space-x-2">
          <input type="checkbox" onChange={() => handleClick(attr, label)} />
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
            value={amount}
            onChange={(e) => handleChange(attr, e.target.value)}
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
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const res = await axios.get("/api/ledger");
        setLedgers(res.data.data[0]);
        let toggle = {};
        res.data.data[0].Ledger_entries.map((entry: any, index: number) => {
          toggle = { ...toggle, [entry?._id]: false };
        });
        setMainOpen(toggle);
      } catch (err) {
        console.error("Error fetching ledgers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLedgers();
  }, []);

  const handleOpen = async (id: string) => {
    console.log("ledgers", ledgers.Ledger_entries);

    setMainOpen({ ...mainOpen, [id]: !mainOpen[id] });
  };

  const handleClick = async (id: any, label: any) => {
    console.log("id", id);
    console.log("label", label);
  };

  const handleChange = async (id: any, amount: any) => {
    console.log("id", id);
    console.log("amount", amount);
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
          ledgers?.Ledger_entries.map((entry: any, index: number) => (
            <div className="relative">
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
                    <span className="text-green-600 font-semibold">Collected: ₹0.00</span>
                    <span className="text-red-600 font-semibold">Status: PENDING</span>
                  </div>

                  {/* Payment Methods */}
                  <PaymentMethod
                    label="Cash"
                    emoji="💵"
                    id="cash"
                    amount={entry?.pending}
                    multi={false}
                    handleClick={handleClick}
                    handleChange={handleChange}
                    attr={entry?._id}
                  />
                  <PaymentMethod
                    label="UPI"
                    emoji="📱"
                    id="upi"
                    amount={entry?.pending}
                    multi={false}
                    handleClick={handleClick}
                    handleChange={handleChange}
                    attr={entry?._id}
                  />
                  <PaymentMethod
                    label="Cheque"
                    emoji="🏦"
                    id="cheque"
                    amount={entry?.pending}
                    multi={true}
                    handleClick={handleClick}
                    handleChange={handleChange}
                    attr={entry?._id}
                  />

                  {/* Credit & Cancelled */}
                  <div className="flex items-center px-2 py-2 bg-white border rounded shadow-sm space-x-2">
                    <input type="checkbox" />
                    <span>✉️ CREDIT</span>
                  </div>
                  <div className="flex items-center px-2 py-2 bg-white border rounded shadow-sm space-x-2">
                    <input type="checkbox" />
                    <span>❌ CANCELLED</span>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
