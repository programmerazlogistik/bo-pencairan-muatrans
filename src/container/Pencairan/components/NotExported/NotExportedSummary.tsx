import { cn, idrFormat } from "@muatmuat/lib/utils";
import { Checkbox } from "@muatmuat/ui/Form";

import {
  NotExportedListItem,
  NotExportedSummary as NotExportedSummaryType,
} from "@/services/Pencairan/useNotExported";

import { useNotExportedStore } from "@/store/Pencairan/useNotExportedStore";

interface NotExportedSummaryProps {
  showExport: boolean;
  totalCount: number;
  totalNominal: number;
  summaryData?: NotExportedSummaryType;
  dataList?: NotExportedListItem[];
}

const NotExportedSummary = ({
  showExport,
  totalCount,
  totalNominal,
  summaryData,
  dataList = [],
}: NotExportedSummaryProps) => {
  const { selectedIds, adminFees } = useNotExportedStore();

  const selectedCount = selectedIds.length;

  const selectedItems = dataList.filter((item) =>
    selectedIds.includes(item.id)
  );

  const selectedNominal = selectedItems.reduce(
    (acc, item) =>
      acc +
      Number(
        // Clean currency string to number
        item.nominal.replace(/[^0-9,-]+/g, "").replace(",", ".")
      ),
    0
  );

  // Get unique banks from selected items
  const selectedBanks = Array.from(
    new Set(selectedItems.map((item) => item.rekening_tujuan))
  );

  // Calculate total admin fee based on selected banks and their input fees
  const totalAdminFee = selectedBanks.reduce((acc, bank) => {
    return acc + (adminFees[bank] || 0);
  }, 0);

  return (
    <div className="flex w-[962px] flex-col">
      {/* Top Row: Total & Biaya Admin */}
      <div className="flex flex-row items-center">
        {/* Total */}
        <div
          className={cn(
            "grid w-fit grid-flow-col font-semibold leading-[29px] text-black",
            showExport ? "text-[16px]" : "text-[24px]"
          )}
        >
          <span className={cn(showExport ? "w-[100px]" : "w-fit")}>Total</span>
          <span>
            : {idrFormat(selectedNominal)}/{idrFormat(totalNominal)}
          </span>
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
          <span className="w-[100px]">Biaya Admin</span>
          <span>: {idrFormat(totalAdminFee)}</span>
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
            <span>
              : {selectedCount}/{totalCount}
            </span>
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
            <span>
              :{" "}
              {summaryData?.banks
                ?.map((b) => `${b.label} ${b.count}`)
                .join(", ") || "-"}
            </span>
          </div>

          {/* Status Info */}
          <div className="grid w-full grid-flow-col justify-start text-[16px] font-semibold leading-[19px] text-[#000000]">
            <span className="w-[100px]">Status</span>
            <span>
              : Baru {summaryData?.new || 0}, Retransfer{" "}
              {summaryData?.retransfer || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotExportedSummary;
