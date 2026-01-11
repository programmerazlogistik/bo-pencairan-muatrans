import { Button } from "@muatmuat/ui/Button";
import { NumberInput, Select } from "@muatmuat/ui/Form";

interface PencairanExportSidebarProps {
  onExport: () => void;
}

const PencairanExportSidebar = ({ onExport }: PencairanExportSidebarProps) => {
  return (
    <div className="ms-5 flex h-fit w-[222px] flex-none flex-col items-center gap-[10px] rounded-[10px] border border-[#A8A8A8] p-[10px]">
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

      {/* Biaya Admin BRI */}
      <div className="flex w-full flex-col gap-[12px] py-[10px]">
        <span className="text-[12px] font-medium leading-[14px] text-[#1B1B1B] ">
          Biaya Admin BRI
        </span>
        <NumberInput
          text={{ left: "Rp" }}
          placeholder=""
          hideStepper={true}
          defaultValue={null}
          thousandSeparator="."
          decimalSeparator=","
          className="h-[32px] rounded-[6px] border-[#A8A8A8] bg-white"
          appearance={{
            inputClassName: "font-medium text-[12px]",
          }}
        />
      </div>

      <Button
        onClick={onExport}
        variant="muatparts-primary"
        disabled={false}
      >
        Export
      </Button>
    </div>
  );
};

export default PencairanExportSidebar;
