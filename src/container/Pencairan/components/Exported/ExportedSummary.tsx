import { cn } from "@muatmuat/lib/utils";

interface ExportedSummaryProps {
  bulkAction: string | null;
  selectedCount: number;
}

const ExportedSummary = ({
  bulkAction,
  selectedCount,
}: ExportedSummaryProps) => {
  const showBulkInfo = !!bulkAction;

  return (
    <div className="flex w-[962px] flex-col">
      {/* Row 1 Col 1: Total Export */}
      <div
        className={cn(
          "grid w-fit grid-flow-col leading-[29px] text-black font-semibold",
          showBulkInfo ? "text-[16px] " : "text-[24px] "
        )}
      >
        <span className={cn(showBulkInfo ? "w-[100px]" : "w-fit")}>Total</span>
        <span>: Rp 15</span>
      </div>

      {/* Row 2: Terpilih (Animated) */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          showBulkInfo
            ? "grid-rows-[1fr] opacity-100 pt-2"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="grid w-full grid-flow-col justify-start text-[16px] font-semibold leading-[19px] text-[#000000]">
            <span className="w-[100px]">Terpilih</span>
            <span>: {selectedCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportedSummary;
