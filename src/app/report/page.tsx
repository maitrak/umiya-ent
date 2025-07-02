export default function Report() {
  return (
    <div className="bg-white p-4 font-sans min-h-screen">
      <div className="max-w-md mx-auto rounded-xl shadow border border-gray-300 overflow-hidden">
        {/* Date Header */}
        <div className="bg-[#137AA8] text-white text-center py-2 font-semibold text-lg">
          Summary
        </div>

        {/* Table Header */}
        <div
          className="flex flex-col items-start self-stretch mb-[43px]"
          style={{
            boxShadow: "0px 4px 4px #00000040",
          }}>
          <div className="self-stretch bg-black h-[1px] mb-5"></div>
          <div className="flex items-center mb-3 ml-5 gap-[15px]">
            <span className="text-black text-xl font-bold w-[198px]">
              {"Total Parties Cleared:"}
            </span>
            <input
              type="number"
              className="w-full border-2 border-solid border-black rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex items-center mb-[13px] ml-[21px] gap-[9px]">
            <span className="text-black text-xl font-bold w-52">{"Total Cash Collected:"}</span>
            <input
              type="number"
              className="w-full border-2 border-solid border-black rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex items-center mb-[13px] ml-5 gap-[13px]">
            <span className="text-black text-xl font-bold w-52">{"Total UPI Transactions:"}</span>
            <input
              type="number"
              className="w-full border-2 border-solid border-black rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex items-center mb-[23px] ml-[21px] gap-[17px]">
            <span className="text-black text-xl font-bold w-[138px]">{"Cancelled Bills:"}</span>
            <input
              type="number"
              className="w-full border-2 border-solid border-black rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex items-center mb-7 ml-5 gap-[13px]">
            <span className="text-black text-xl font-bold w-[129px]">{"Credited Bills:"}</span>
            <input
              type="number"
              className="w-full border-2 border-solid border-black rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex items-center ml-5 gap-[13px]">
            <span className="text-black text-xl font-bold">{"Cheques Collected:"}</span>
            <input
              type="number"
              className="w-full border-2 border-solid border-black rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-between items-start self-stretch mb-[50px] mx-[21px]">
          <span className="flex-1 text-black text-[32px] font-bold mr-1">{"TOTAL AMOUNT:"}</span>
          <span className="flex-1 text-[#B03939] text-[32px] font-bold text-right">{"₹0.00"}</span>
        </div>
        <div className="flex flex-col items-center self-stretch bg-[#D9D9D9] py-[41px] px-[21px] mx-[1px] gap-[38px] rounded-lg">
          <div className="flex items-start self-stretch">
            <span className="flex-1 text-black text-xl font-bold mr-[35px]">
              {"Admin\nPassword:"}
            </span>
            <div
              className="w-[49px] h-[46px] my-1 mr-[15px] rounded-lg border-2 border-solid border-[#6E6E6E]"
              style={{
                boxShadow: "0px 4px 8px #00000040",
              }}></div>
            <div
              className="w-[49px] h-[46px] mt-1 mr-[15px] rounded-lg border-2 border-solid border-[#6E6E6E]"
              style={{
                boxShadow: "0px 4px 8px #00000040",
              }}></div>
            <div
              className="w-[49px] h-[46px] mt-1 mr-3.5 rounded-lg border-2 border-solid border-[#6E6E6E]"
              style={{
                boxShadow: "0px 4px 8px #00000040",
              }}></div>
            <div
              className="w-[49px] h-[46px] mt-1 rounded-lg border-2 border-solid border-[#6E6E6E]"
              style={{
                boxShadow: "0px 4px 8px #00000040",
              }}></div>
          </div>
          <button className="flex flex-col items-start bg-[#137AA8] text-left py-[19px] px-2 rounded-[10px] border-0">
            <span className="text-white text-xl font-bold text-center w-[207px]">
              {"Check and Upload"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
