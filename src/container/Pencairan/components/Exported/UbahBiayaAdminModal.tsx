import { useState } from "react";

import { Button } from "@muatmuat/ui/Button";
import { NumberInput } from "@muatmuat/ui/Form";
import { IconComponent } from "@muatmuat/ui/IconComponent";
import { Modal, ModalContent } from "@muatmuat/ui/Modal";

interface UbahBiayaAdminModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (val: number) => void;
  initialValue?: number;
  title?: string;
}

const UbahBiayaAdminModal = ({
  isOpen,
  setIsOpen,
  onSave,
  initialValue,
  title = "Ubah Biaya Admin",
}: UbahBiayaAdminModalProps) => {
  const [value, setValue] = useState<number | undefined>(initialValue);

  const handleSave = () => {
    if (value !== undefined) {
      onSave(value);
      setIsOpen(false);
      setValue(undefined);
    }
  };

  const isButtonDisabled = !value;

  return (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      withCloseButton={false}
      closeOnOutsideClick={true}
    >
      <ModalContent className="w-[411px] rounded-[12px] bg-white p-0">
        <div className="relative flex flex-col items-center gap-6 px-6 py-9">
          {/* Header */}
          <div className="flex w-full flex-col items-center gap-2">
            <div className="flex w-full items-center justify-between">
              {/* Spacer to center the title roughly or just use absolute positioning for the close icon */}
              <div className="w-4"></div>
              <h1 className="text-[16px] font-bold leading-[19px] text-[#1B1B1B]">
                {title}
              </h1>
              <div className="cursor-pointer" onClick={() => setIsOpen(false)}>
                <IconComponent
                  src="/icons/silang8.svg"
                  width={10}
                  height={10}
                  className="text-[#176CF7]"
                />
              </div>
            </div>
          </div>

          <p className="text-center text-[14px] font-medium leading-[17px] text-[#1B1B1B]">
            Masukkan biaya admin yang akan diubah
          </p>

          {/* Input Section */}
          <NumberInput
            text={{ left: "Rp" }}
            placeholder="0"
            hideStepper={true}
            thousandSeparator="."
            decimalSeparator=","
            value={value}
            onValueChange={(val) => setValue(val)}
            className="h-[32px] w-[250px] rounded-[6px] border-[#A8A8A8] bg-white px-2"
            appearance={{
              inputClassName: "font-medium text-[12px] text-[#1B1B1B]",
            }}
          />

          {/* Button */}
          <Button
            className="h-[32px] w-[112px] rounded-[20px] bg-[#176CF7] text-[14px] font-semibold text-white hover:bg-[#1560db] disabled:bg-[#D7D7D7] disabled:text-white"
            onClick={handleSave}
            disabled={isButtonDisabled}
          >
            Simpan
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default UbahBiayaAdminModal;
