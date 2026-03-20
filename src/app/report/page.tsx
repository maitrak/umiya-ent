"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import OTPInput from "react-otp-input";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function Report() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ledgerId = searchParams.get("id");
  const backHref = ledgerId
    ? `http://localhost:3001/summary?id=${ledgerId}`
    : "http://localhost:3001/summary";

  const [ledgers, setLedgers] = useState<any>(null);
  const [parties, setParties] = useState<number>(0);
  const [cash, setCash] = useState<number>(0);
  const [upi, setUPI] = useState<number>(0);
  const [cancelled, setCancelled] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);
  const [cheque, setCheque] = useState<number>(0);
  const [password, setPassword] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [approve, setApprove] = useState<boolean>(false);

  const admin = 1234;
  useEffect(() => {
    const userId = searchParams.get("id");
    if (userId && !ledgers) {
      fetchLedgers(userId);
    }
  }, [searchParams]);
  useEffect(() => {
    console.log({ cash, upi, cancelled, credit, cheque });

    setTotal(cash + upi + cancelled + credit + cheque);
  }, [cash, upi, cancelled, credit, cheque]);
  const fetchLedgers = async (id: string) => {
    try {
      const res = await axios.get(`/api/ledger/${id}`);
      if (!res) {
        return;
      }
      setLedgers(res.data.data);
      console.log(res.data.data?.Approved);
      setApprove(res.data.data?.Approved);
      console.log(res.data.data?.Ledger_entries);
      const noteDenominations: any = ["500", "200", "100", "50", "20", "10", "5"];
      const coinDenominations: any = ["20", "10", "5", "2", "1", "0.50", "0.25"];
      setParties(res.data.data?.Ledger_entries?.length || 0);
      const notesTotal = noteDenominations.reduce((sum: any, denom: any) => {
        const qty = Number(res.data.data.cashCollection?.notes[denom]) || 0;
        return sum + qty * parseFloat(denom);
      }, 0);

      let coinsTotal = 0;
      coinDenominations.map((denom: number) => {
        const numbers = Number(denom).toFixed(2);
        const simpleNumber = +numbers * 100;

        const qty =
          Number(denom) >= 1
            ? res.data.data.cashCollection?.coins[denom]
            : res.data.data.cashCollection?.coins[0]?.[simpleNumber] ?? 0;
        const newtotal = qty * Number(denom);
        coinsTotal += newtotal;
      });
      const grandTotal = notesTotal + coinsTotal;
      setCash(grandTotal);
      const valueForUPI = res.data.data?.Ledger_entries.flatMap((entry: any) =>
        entry.Ledger_entries_transaction.filter((txn: any) => txn.type === "UPI")
      );
      const valueForCheque = res.data.data?.Ledger_entries.flatMap((entry: any) =>
        entry.Ledger_entries_transaction.filter((txn: any) => txn.type === "CHEQUE")
      );

      const valueForCredit = res.data.data?.Ledger_entries.flatMap((entry: any) =>
        entry.Ledger_entries_transaction.filter((txn: any) => txn.type === "credit")
      );

      const valueForCancel = res.data.data?.Ledger_entries.flatMap((entry: any) =>
        entry.Ledger_entries_transaction.filter((txn: any) => txn.type === "cancel")
      );

      setUPI(
        (valueForUPI ?? []).reduce((total: number, transaction: any) => total + transaction.amount, 0)
      );
      setCancelled(
        (valueForCancel ?? []).reduce(
          (total: number, transaction: any) => total + transaction.amount,
          0
        )
      );
      setCredit(
        (valueForCredit ?? []).reduce(
          (total: number, transaction: any) => total + transaction.amount,
          0
        )
      );
      setCheque(
        (valueForCheque ?? []).reduce(
          (total: number, transaction: any) => total + transaction.amount,
          0
        )
      );
    } catch (err) {
      console.error("Error fetching ledgers:", err);
    }
  };

  const handleApprove = async () => {
    if (admin !== +password) {
      toast.error("invalid password");
      return;
    }
    const id = searchParams.get("id");
    if (id) {
      const res = await axios.post(
        `/api/ledger/${id}`,
        { Approved: true },
        { responseType: "blob" } // 👈 this is key
      );

      // Then convert blob to download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ledger-export.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      fetchLedgers(id);
      const state = { id: id };
      const params = new URLSearchParams(state).toString();
      router.push(`/report?${params}`);
    }
  };
  return (
    <div className="bg-white font-sans min-h-screen">
      <div className="max-w-md mx-auto rounded-xl shadow border border-gray-300 overflow-hidden">
        <div className="px-4 pt-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        </div>
        {/* Date Header */}
        <div className="bg-[#137AA8] text-white text-center py-2 font-semibold text-lg">
          Summary
        </div>

        {/* Table Header */}
        <div
          className="flex flex-col items-start self-stretch mb-[43px] pb-4"
          style={{
            boxShadow: "0px 4px 4px #00000040",
          }}>
          <div className="self-stretch bg-black h-[1px] mb-5"></div>
          <div className="flex items-center mb-3 ml-5 gap-[15px]">
            <span className="text-black text-xl font-bold w-[198px]">
              {"Total Parties Cleared:"}
            </span>
            <div className="bg-white w-[88px] h-[27px] border-2 border-solid border-black text-right pr-3">
              {parties}
            </div>
          </div>
          <div className="flex items-center mb-[13px] ml-[21px]  gap-[15px]">
            <span className="text-black text-xl font-bold w-[198px]">
              {"Total Cash Collected:"}
            </span>
            <div className="bg-white w-[88px] h-[27px] border-2 border-solid border-black text-right pr-3">
              {cash}
            </div>
          </div>
          <div className="flex items-center mb-[13px] ml-5 gap-[15px]">
            <span className="text-black text-xl font-bold w-[198px]">
              {"Total UPI Transactions:"}
            </span>
            <div className="bg-white w-[88px] h-[27px] border-2 border-solid border-black text-right pr-3">
              {upi}
            </div>
          </div>
          <div className="flex items-center mb-[23px] ml-[21px]  gap-[15px]">
            <span className="text-black text-xl font-bold w-[198px]">{"Cancelled Bills:"}</span>
            <div className="bg-white w-[88px] h-[27px] border-2 border-solid border-black text-right pr-3">
              {cancelled}
            </div>
          </div>
          <div className="flex items-center mb-7 ml-5 gap-[15px]">
            <span className="text-black text-xl font-bold w-[198px]">{"Credited Bills:"}</span>
            <div className="bg-white w-[88px] h-[27px] border-2 border-solid border-black text-right pr-3">
              {credit}
            </div>
          </div>
          <div className="flex items-center ml-5 gap-[15px]">
            <span className="text-black text-xl font-bold w-[198px]">{"Cheques Collected:"}</span>
            <div className="bg-white w-[88px] h-[27px] border-2 border-solid border-black text-right pr-3">
              {cheque}
            </div>
          </div>
        </div>
        <div className=" justify-between items-start self-stretch mb-[50px] mx-[21px]">
          <span className="flex-1 text-black text-[32px] font-bold mr-1">{"TOTAL AMOUNT:"}</span>
          <span className="flex-1 text-[#B03939] text-[32px] font-bold text-right">₹{total}</span>
        </div>
        {!approve && (
          <div className="flex flex-col items-center self-stretch bg-[#D9D9D9] py-[41px] px-[21px] mx-[1px] gap-[38px] rounded-lg">
            <div className="flex items-start self-stretch">
              <span className="flex-1 text-black text-xl font-bold">{"Admin\nPassword:"}</span>
              <OTPInput
                inputStyle={{
                  width: "3rem",
                  height: "3rem",
                  margin: "0 1rem",
                  fontSize: "2rem",
                  borderRadius: 4,
                  border: "1px solid rgba(0,0,0,0.3)",
                }}
                value={password}
                numInputs={4}
                inputType="password"
                onChange={setPassword}
                renderInput={(props: any) => <input {...props} />}
              />
            </div>
            <button
              onClick={() => handleApprove()}
              className="flex flex-col items-start bg-[#137AA8] text-left py-[19px] px-2 rounded-[10px] border-0">
              <span className="text-white text-xl font-bold text-center w-[207px]">
                {"Check and Upload"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
