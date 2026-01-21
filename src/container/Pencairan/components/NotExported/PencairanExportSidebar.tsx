import { useState } from "react";

import { Button } from "@muatmuat/ui/Button";
import { NumberInput, Select } from "@muatmuat/ui/Form";

import { useBankPengirimList } from "@/services/Pencairan/useBankPengirim";
import {
  NotExportedListItem,
  exportDisbursement,
} from "@/services/Pencairan/useNotExported";

import { useNotExportedStore } from "@/store/Pencairan/useNotExportedStore";

interface PencairanExportSidebarProps {
  onExportRequest?: (callback: () => Promise<void>) => void;
  onExportSuccess?: (exportId: string) => void;
  onExportError?: (error: Error) => void;
  dataList?: NotExportedListItem[];
}

const PencairanExportSidebar = ({
  onExportRequest,
  onExportSuccess,
  onExportError,
  dataList = [],
}: PencairanExportSidebarProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { adminFees, setAdminFee, selectedIds, bankPengirim, setBankPengirim } =
    useNotExportedStore();
  const { data: bankList, isLoading: isBankListLoading } =
    useBankPengirimList();

  const selectedItems = dataList.filter((item) =>
    selectedIds.includes(item.id)
  );

  const currentBankPengirim = bankList?.find((b) => b.id === bankPengirim);

  const selectedBanks = Array.from(
    new Set(selectedItems.map((item) => item.rekening_tujuan))
  )
    .filter((bank) => bank !== currentBankPengirim?.bank_name)
    .sort();

  const isExportDisabled =
    !bankPengirim ||
    selectedBanks.length === 0 ||
    selectedBanks.some((bank) => {
      const fee = adminFees[bank];
      return fee === undefined || fee === null;
    });

  const bankOptions =
    bankList?.map((bank) => ({
      label: `${bank.bank_name} - ${bank.account_number} - ${bank.account_name}`,
      value: bank.id,
    })) || [];

  const doExport = async () => {
    if (!bankPengirim) return;

    setIsExporting(true);
    try {
      const adminFeesArray = selectedBanks.map((bank) => ({
        bank,
        fee: adminFees[bank] || 0,
      }));

      const response = await exportDisbursement({
        bank_pengirim_id: bankPengirim,
        selected_ids: selectedIds,
        admin_fees: adminFeesArray,
      });

      if (response.Message.Code === 200) {
        onExportSuccess?.(response.Data.export_id);
      } else {
        throw new Error(response.Message.Text);
      }
    } catch (error) {
      onExportError?.(error as Error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    if (onExportRequest) {
      onExportRequest(doExport);
    } else {
      doExport();
    }
  };

  return (
    <div className="ms-5 flex h-fit w-[222px] flex-none flex-col items-center gap-[10px] rounded-[10px] border border-[#A8A8A8] p-[10px]">
      {/* Bank Pengirim */}
      <div className="flex w-full flex-col gap-[12px] py-[10px]">
        <span className="text-[12px] font-medium leading-[14px] text-[#1B1B1B]">
          Bank Pengirim
        </span>
        <Select
          value={bankPengirim || undefined}
          onChange={(val) => setBankPengirim(val)}
          placeholder={isBankListLoading ? "Loading..." : "Pilih bank pengirim"}
          className="h-[31px] w-full rounded-[6px] border-[#A8A8A8] text-[10px] font-medium text-[#868686]"
          options={bankOptions}
          disabled={isBankListLoading}
        />
      </div>

      {/* Biaya Admin - Dynamic based on selected banks */}
      {selectedBanks.map((bank) => (
        <div key={bank} className="flex w-full flex-col gap-[12px] py-[10px]">
          <span className="text-[12px] font-medium leading-[14px] text-[#1B1B1B]">
            Biaya Admin {bank}
          </span>
          <NumberInput
            text={{ left: "Rp" }}
            placeholder=""
            hideStepper={true}
            value={adminFees[bank]}
            onValueChange={(val) => setAdminFee(bank, val)}
            thousandSeparator="."
            decimalSeparator=","
            className="h-[32px] rounded-[6px] border-[#A8A8A8] bg-white"
            appearance={{
              inputClassName: "font-medium text-[12px]",
            }}
          />
        </div>
      ))}

      <Button
        onClick={handleExport}
        variant="muatparts-primary"
        disabled={isExportDisabled || isExporting}
      >
        {isExporting ? "Exporting..." : "Export"}
      </Button>
    </div>
  );
};

export default PencairanExportSidebar;
