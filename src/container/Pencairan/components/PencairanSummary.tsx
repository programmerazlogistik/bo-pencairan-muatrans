import { Checkbox } from "@muatmuat/ui/Form";

const PencairanSummary = () => {
  return (
    <div className="grid w-[962px] grid-cols-[max-content_1fr] gap-x-[15px] gap-y-[8px] py-[15px]">
      {/* Row 1 Col 1: Total */}
      <div className="grid w-fit grid-flow-col text-[16px] font-semibold leading-[19px] text-black">
        <span className="w-[100px]">Total</span>
        <span>: Rp16.600.000/Rp30.000.000</span>
      </div>

      {/* Row 1 Col 2: Biaya Admin */}
      <div className="grid w-fit grid-flow-col text-[16px] font-semibold leading-[19px] text-black">
        <span className="w-[100px] ms-5">Biaya Admin</span>
        <span>: Rp0</span>
      </div>

      {/* Row 2 Col 1: Terpilih */}
      <div className="grid w-fit grid-flow-col text-[16px] font-semibold leading-[19px] text-[#000000]">
        <span className="w-[100px]">Terpilih</span>
        <span>: 3/10</span>
        <Checkbox
          label="Tampilkan Terpilih Saja"
          className="h-[16px] w-[16px] ms-2 rounded-[4px] border border-[#868686] bg-white"
          appearance={{
            labelClassName:
              "text-[12px] font-medium leading-[14px] text-[#1B1B1B]",
          }}
        />
      </div>

      {/* Row 2 Col 2: Checkbox */}
      <div className="flex w-full items-center gap-[8px]"></div>

      {/* Row 3: Bank Info (Full Width) */}
      <div className="col-span-2 grid w-full grid-flow-col justify-start text-[16px] font-semibold leading-[19px] text-[#000000]">
        <span className="w-[100px]">Bank</span>
        <span>: BCA 1/3, BNI 1/3, BRI 1/4</span>
      </div>

      {/* Row 4: Status Info (Full Width) */}
      <div className="col-span-2 grid w-full grid-flow-col justify-start text-[16px] font-semibold leading-[19px] text-[#000000]">
        <span className="w-[100px]">Status</span>
        <span>: Baru 1/4, Retransfer 2/6</span>
      </div>
    </div>
  );
};

export default PencairanSummary;
