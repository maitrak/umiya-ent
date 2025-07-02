"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { set } from "mongoose";

export default function Summary() {
  const searchParams = useSearchParams();

  const [ledgers, setLedgers] = useState<any>(null);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

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

  const fetchLedgers = async (id: string) => {
    try {
      const res = await axios.get("/api/ledger");
      setLedgers(res.data.data[0]);
      setTotal(res.data.data[0].amount);
      const sum = res.data.data[0].Ledger_entries.map((el: any) => {
        return el.Ledger_entries_transaction[0].amount;
      }).reduce((total: number, num: number) => total + num, 0);
      setSubTotal(sum);
      console.log(sum, res.data.data[0].amount);
    } catch (err) {
      console.error("Error fetching ledgers:", err);
    }
  };
  return (
    <div className="bg-white p-4 font-sans min-h-screen">
      <div className="max-w-md mx-auto rounded-xl shadow border border-gray-300 overflow-hidden">
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
          onSubmit={(values) => {
            const notesTotal = noteDenominations.reduce((sum: any, denom: any) => {
              const qty = Number(values.notes[denom]) || 0;
              return sum + qty * parseFloat(denom);
            }, 0);

            let coinsTotal = 0;
            coinDenominations.map((denom: number) => {
              const numbers = Number(denom).toFixed(2);
              const simpleNumber = +numbers * 100;
              const qty =
                Number(Number(denom) > 1 ? values.coins[denom] : values.coins[0][simpleNumber]) ||
                0;
              const newtotal = qty * Number(denom);
              coinsTotal += newtotal;
            });
            const grandTotal = notesTotal + coinsTotal;
            setGrandTotal(grandTotal);
          }}>
          {({ errors, touched }) => (
            <Form className="flex flex-col items-start self-stretch mb-[58px] mx-[21px] gap-3">
              {/* Header */}
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
              <button
                type="submit"
                className="mt-4 px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded">
                Submit
              </button>
            </Form>
          )}
        </Formik>
        <div className="flex items-start ml-[21px] gap-[18px]">
          <span className="text-black text-[32px] font-bold">Collected:</span>
          <span className="text-black text-[32px] font-bold">₹0.00</span>
        </div>
      </div>
    </div>
  );
}
