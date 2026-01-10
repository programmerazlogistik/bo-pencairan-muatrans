import { Button } from "@muatmuat/ui/Button";
import { NumberInput, Select } from "@muatmuat/ui/Form";

interface PencairanExportSidebarProps {
  onExport: () => void;
}

const PencairanExportSidebar = ({ onExport }: PencairanExportSidebarProps) => {
  return (
    <div className="flex h-fit w-[222px] flex-none flex-col items-center gap-[10px] rounded-[10px] border border-[#A8A8A8] p-[10px]">
      {/* Bank Pengirim */}
      <div className="flex w-full flex-col gap-[12px] py-[10px]">
        <span className="text-[12px] font-medium leading-[14px] text-[#1B1B1B]">
          Bank Pengirim
        </span>
        <Select
          placeholder="Pilih bank pengirim"
          className="h-[31px] w-full rounded-[6px] border-[#A8A8A8] text-[10px] font-medium text-[#868686]"
          options={[]}
        />
      </div>

      {/* Biaya Admin BCA */}
      <div className="flex w-full flex-col gap-[12px] py-[10px]">
        <span className="text-[12px] font-medium leading-[14px] text-[#1B1B1B]">
          Biaya Admin BCA
        </span>
        <NumberInput
          text={{ left: "Rp" }}
          placeholder="0"
          hideStepper={true}
          thousandSeparator="."
          decimalSeparator=","
          className="h-[32px] rounded-[6px] border-[#A8A8A8] bg-white px-2"
          appearance={{
            inputClassName: "font-medium text-[12px]",
          }}
        />
      </div>

      {/* Biaya Admin BNI */}
      <div className="flex w-full flex-col gap-[12px] py-[10px]">
        <span className="text-[12px] font-medium leading-[14px] text-[#1B1B1B]">
          Biaya Admin BNI
        </span>
        <NumberInput
          text={{ left: "Rp" }}
          placeholder="0"
          hideStepper={true}
          thousandSeparator="."
          decimalSeparator=","
          className="h-[32px] rounded-[6px] border-[#A8A8A8] bg-white px-2"
          appearance={{
            inputClassName: "font-medium text-[12px]",
          }}
        />
      </div>

      {/* Biaya Admin BRI */}
      <div className="flex w-full flex-col gap-[12px] py-[10px]">
        <span className="text-[12px] font-medium leading-[14px] text-[#1B1B1B]">
          Biaya Admin BRI
        </span>
        <NumberInput
          text={{ left: "Rp" }}
          placeholder="0"
          hideStepper={true}
          thousandSeparator="."
          decimalSeparator=","
          className="h-[32px] rounded-[6px] border-[#A8A8A8] bg-white px-2"
          appearance={{
            inputClassName: "font-medium text-[12px]",
          }}
        />
      </div>

      <Button
        onClick={onExport}
        className="mt-auto h-[32px] w-[92px] rounded-[20px] bg-[#D7D7D7] text-[14px] font-semibold text-white hover:bg-[#c0c0c0]"
      >
        Export
      </Button>
    </div>
  );
};

export default PencairanExportSidebar;
