import { cn } from "@muatmuat/lib/utils";
import { Checkbox } from "@muatmuat/ui/Form";

interface NotExportedSummaryProps {
  showExport: boolean;
}

const NotExportedSummary = ({ showExport }: NotExportedSummaryProps) => {
  return (
    <div className="flex w-[962px] flex-col ">
      {/* Top Row: Total & Biaya Admin */}
      <div className="flex flex-row items-center">
        {/* Total */}
        <div
          className={cn(
            "grid w-fit grid-flow-col leading-[29px] text-black font-semibold",
            showExport ? "text-[16px] " : "text-[24px] "
          )}
        >
          <span className={cn(showExport ? "w-[100px]" : "w-fit")}>Total</span>
          <span>: Rp16.600.000/Rp30.000.000</span>
        </div>

        {/* Biaya Admin - Animated */}
        <div
          className={cn(
            "grid grid-flow-col overflow-hidden whitespace-nowrap text-[16px] font-semibold leading-[19px] text-black transition-all duration-300 ease-in-out",
            showExport
              ? "ml-[15px] max-w-[500px] opacity-100"
              : "max-w-0 opacity-0"
          )}
        >
          {/* Removed ms-5 since we use ml-[15px] on the parent for separation */}
          <span className="w-[100px]">Biaya Admin</span>
          <span>: Rp0</span>
        </div>
      </div>

      {/* Collapsible Bottom Section: Terpilih, Bank, Status */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          showExport
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="flex flex-col gap-y-[8px] overflow-hidden">
          {/* Terpilih */}
          <div className="grid w-fit grid-flow-col text-[16px] font-semibold leading-[19px] text-[#000000]">
            <span className="w-[100px]">Terpilih</span>
            <span>: 3/10</span>
            <Checkbox
              label="Tampilkan Terpilih Saja"
              className="ms-2 h-[16px] w-[16px] rounded-[4px] border border-[#868686] bg-white"
              appearance={{
                labelClassName:
                  "text-[12px] font-medium leading-[14px] text-[#1B1B1B]",
              }}
            />
          </div>

          {/* Bank Info */}
          <div className="grid w-full grid-flow-col justify-start text-[16px] font-semibold leading-[19px] text-[#000000]">
            <span className="w-[100px]">Bank</span>
            <span>: BCA 1/3, BNI 1/3, BRI 1/4</span>
          </div>

          {/* Status Info */}
          <div className="grid w-full grid-flow-col justify-start text-[16px] font-semibold leading-[19px] text-[#000000]">
            <span className="w-[100px]">Status</span>
            <span>: Baru 1/4, Retransfer 2/6</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotExportedSummary;
