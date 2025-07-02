import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

export default function Summary() {
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
          <span className="text-[#B03939] text-xl font-bold">₹0.00</span>
        </div>
        <div className="flex flex-col items-start self-stretch mb-[58px] mx-[21px] gap-3">
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
          <div className="flex items-start self-stretch gap-3">
            <div className="flex flex-1 flex-col my-0.5 gap-[9px]">
              <div className="flex items-center self-stretch gap-[19px]">
                <span className="text-black text-sm font-bold w-[71px]">₹500 X</span>
                <input type="number" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="flex items-center self-stretch gap-[19px]">
                <span className="text-black text-sm font-bold w-[71px]">₹200 X</span>
                <input type="number" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="flex items-center self-stretch gap-[19px]">
                <span className="text-black text-sm font-bold w-[71px]">₹100 X</span>
                <input type="number" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="flex items-center self-stretch gap-[19px]">
                <span className="text-black text-sm font-bold w-[71px]">₹50 X</span>
                <input type="number" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="flex items-center self-stretch gap-[19px]">
                <span className="text-black text-sm font-bold w-[71px]">₹20 X</span>
                <input type="number" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="flex items-center self-stretch gap-[19px]">
                <span className="text-black text-sm font-bold w-[71px]">₹10 X</span>
                <input type="number" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="flex items-center self-stretch gap-[19px]">
                <span className="text-black text-sm font-bold w-[71px]">₹5 X</span>
                <input type="number" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-[9px]">
              <div className="flex items-center self-stretch gap-[19px]">
                <span className="text-black text-sm font-bold w-[71px]">₹20 X</span>
                <input type="number" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="flex items-center self-stretch gap-[19px]">
                <span className="text-black text-sm font-bold w-[71px]">₹10 X</span>
                <input type="number" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="flex items-center self-stretch gap-[19px]">
                <span className="text-black text-sm font-bold w-[71px]">₹5 X</span>
                <input type="number" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="flex items-center self-stretch gap-[19px]">
                <span className="text-black text-sm font-bold w-[71px]">₹2 X</span>
                <input type="number" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="flex items-center self-stretch gap-[19px]">
                <span className="text-black text-sm font-bold w-[71px]">₹1 X</span>
                <input type="number" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="flex items-center self-stretch gap-[19px]">
                <span className="text-black text-sm font-bold w-[71px]">₹.50 X</span>
                <input type="number" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="flex items-center self-stretch gap-[19px]">
                <span className="text-black text-sm font-bold w-[71px]">₹.25 X</span>
                <input type="number" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-start ml-[21px] gap-[18px]">
          <span className="text-black text-[32px] font-bold">Collected:</span>
          <span className="text-black text-[32px] font-bold">₹0.00</span>
        </div>
      </div>
    </div>
  );
}
