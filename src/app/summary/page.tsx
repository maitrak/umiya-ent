"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useFormikContext } from "formik";
import { ArrowLeft } from "lucide-react";

const SubmitOnChange = () => {
  const { values, submitForm } = useFormikContext();

  useEffect(() => {
    submitForm(); // triggers onSubmit
  }, [values]);

  return null;
};
export default function Summary() {
  const searchParams = useSearchParams();
  const ledgerId = searchParams.get("id");
  const orderHref = "/order";

  const [ledgers, setLedgers] = useState<any>(null);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [cashCollection, setCashCollection] = useState<any>(null);

  const [total, setTotal] = useState<number>(0);
  const noteDenominations: any = ["500", "200", "100", "50", "20", "10", "5"];
  const coinDenominations: any = ["20", "10", "5", "2", "1", "0.50", "0.25"];

  const initialValues = {
    notes: Object.fromEntries(noteDenominations.map((d: any) => [d, 0])),
    coins: Object.fromEntries(coinDenominations.map((d: any) => [d, 0])),
  };
  const schema = Yup.object().shape({
    notes: Yup.object(
      Object.fromEntries(
        noteDenominations.map((d: any) => [
          d,
          Yup.number()
            .min(0, "Cannot be negative")
            .typeError("Must be a number")
            .required("Required"),
        ])
      )
    ),
    coins: Yup.object(
      Object.fromEntries(
        coinDenominations.map((d: any) => [
          d,
          Yup.number()
            .min(0, "Cannot be negative")
            .typeError("Must be a number")
            .required("Required"),
        ])
      )
    ),
  });
  useEffect(() => {
    const userId = searchParams.get("id");
    if (userId && !ledgers) {
      fetchLedgers(userId);
    }
  }, [searchParams]);
  const router = useRouter();

  const fetchLedgers = async (id: string) => {
    try {
      const res = await axios.get(`/api/ledger/${id}`);
      if (!res) {
        return;
      }

      setLedgers(res.data.data);
      setTotal(res.data.data.amount);
      const sum = res.data.data.Ledger_entries.reduce((total: number, entry: any) => {
        const entryTotal = (entry.Ledger_entries_transaction ?? []).reduce(
          (transactionTotal: number, transaction: any) =>
            transactionTotal + Number(transaction.amount ?? 0),
          0
        );
        return total + entryTotal;
      }, 0);
      setSubTotal(sum);
    } catch (err) {
      console.error("Error fetching ledgers:", err);
    }
  };

  const handleSave = async () => {
    const id = searchParams.get("id");
    if (id) {
      await axios.post(`/api/ledger/${id}`, {
        isGenerated: true,
        cashCollection,
      });
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
            href={orderHref}
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
        <div className="flex items-center mb-6 ml-[19px] gap-2">
          <span className="text-black text-xl font-bold">Total:</span>
          <span
            className={` text-xl font-bold ${
              subTotal < total ? "text-red-600" : "text-green-600"
            } `}>
            ₹{subTotal}
          </span>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={async (values) => {
            const notesTotal = noteDenominations.reduce((sum: any, denom: any) => {
              const qty = Number(values.notes[denom]) || 0;
              return sum + qty * parseFloat(denom);
            }, 0);

            let coinsTotal = 0;
            coinDenominations.map((denom: number) => {
              const numbers = Number(denom).toFixed(2);
              const simpleNumber = +numbers * 100;

              const qty =
                Number(denom) >= 1 ? values.coins[denom] : values.coins[0]?.[simpleNumber] ?? 0;
              const newtotal = qty * Number(denom);
              coinsTotal += newtotal;
            });
            const grandTotal = notesTotal + coinsTotal;
            setGrandTotal(grandTotal);
            setCashCollection(values);
          }}>
          {({}) => (
            <Form className="flex flex-col items-start self-stretch mb-[58px] mx-[21px] gap-3">
              {/* Header */}
              <SubmitOnChange /> {/* 🔁 Add this line here */}
              <div className="flex items-center ml-[1px]">
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/rVQPeSHqF4/aaqrg1zf_expires_30_days.png"
                  className="w-[41px] h-5 mr-[11px] object-fill"
                />
                <span className="text-black text-base w-[43px] mr-[115px]">Notes</span>
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/rVQPeSHqF4/fmnwaxvb_expires_30_days.png"
                  className="w-[39px] h-[23px] mr-[13px] object-fill"
                />
                <span className="text-black text-base w-10">Coins</span>
              </div>
              {/* Inputs */}
              <div className="flex items-start self-stretch gap-3">
                {/* Notes */}
                <div className="flex flex-1 flex-col my-0.5 gap-[9px]">
                  {noteDenominations.map((denomination: any) => (
                    <div key={`note-${denomination}`} className="flex flex-col gap-1 w-full">
                      <div className="flex items-center self-stretch gap-[19px]">
                        <span className="text-black text-sm font-bold w-[71px]">
                          ₹{denomination} X
                        </span>
                        <Field
                          type="number"
                          name={`notes.${denomination}`}
                          className="w-full border rounded px-2 py-1 text-sm"
                          min={0}
                        />
                      </div>
                      <ErrorMessage
                        name={`notes.${denomination}`}
                        component="div"
                        className="text-red-500 text-xs ml-[90px]"
                      />
                    </div>
                  ))}
                </div>

                {/* Coins */}
                <div className="flex flex-1 flex-col gap-[9px]">
                  {coinDenominations.map((denomination: any) => (
                    <div key={`coin-${denomination}`} className="flex flex-col gap-1 w-full">
                      <div className="flex items-center self-stretch gap-[19px]">
                        <span className="text-black text-sm font-bold w-[71px]">
                          ₹{denomination} X
                        </span>
                        <Field
                          type="number"
                          name={`coins.${denomination}`}
                          className="w-full border rounded px-2 py-1 text-sm"
                          min={0}
                          values={0}
                        />
                      </div>
                      <ErrorMessage
                        name={`coins.${denomination}`}
                        component="div"
                        className="text-red-500 text-xs ml-[90px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Submit */}
              <button type="submit" disabled className="hidden"></button>
            </Form>
          )}
        </Formik>
        <div className="flex items-start ml-[21px] gap-[18px]">
          <span className="text-black text-[32px] font-bold">Collected:</span>
          <span className="text-black text-[32px] font-bold">₹{grandTotal}</span>
        </div>
        <div className="flex flex-col items-center self-stretch py-[41px] px-[21px] mx-[1px] gap-[38px] rounded-lg">
          <button
            onClick={() => handleSave()}
            className="flex flex-col items-start bg-[#137AA8] text-left py-[19px] px-2 rounded-[10px] border-0">
            <span className="text-white text-xl font-bold text-center w-[207px]">
              {"Generate Report"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
