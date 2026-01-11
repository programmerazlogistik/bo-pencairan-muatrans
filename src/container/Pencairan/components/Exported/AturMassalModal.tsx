import { useState } from "react";

import { Button } from "@muatmuat/ui/Button";
import { Select } from "@muatmuat/ui/Form";
import { IconComponent } from "@muatmuat/ui/IconComponent";
import { Modal, ModalContent, ModalTitle } from "@muatmuat/ui/Modal";

interface AturMassalModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave?: (value: string) => void;
}

const AturMassalModal = ({
  isOpen,
  setIsOpen,
  onSave,
}: AturMassalModalProps) => {
  const [action, setAction] = useState<string>("");

  const handleSave = () => {
    if (onSave && action) {
      onSave(action);
      setIsOpen(false);
      setAction("");
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      withCloseButton={false}
      closeOnOutsideClick={true}
    >
      <ModalContent className="w-[424px] rounded-[12px] bg-white p-0">
        <div className="relative flex flex-col gap-6 px-6 py-9">
          {/* Header */}
          <div className="flex w-full items-center justify-between">
            <div className="w-4"></div> {/* Spacer to center title */}
            <ModalTitle className="text-[14px] font-bold leading-[17px] text-[#1B1B1B]">
              Pilih Aksi
            </ModalTitle>
            <div className="cursor-pointer" onClick={() => setIsOpen(false)}>
              <IconComponent
                src="/icons/silang8.svg"
                width={10}
                height={10}
                className="text-[#176CF7]"
              />
            </div>
          </div>

          {/* Select Section */}
          <Select
            placeholder="Pilih aksi"
            className="h-[32px] w-full rounded-[6px] border-[#A8A8A8] text-[12px] font-medium text-[#868686]"
            options={[
              { label: "Selesaikan", value: "selesaikan" },
              { label: "Gagalkan", value: "gagalkan" },
              { label: "Batalkan", value: "batalkan" },
              { label: "Ubah Biaya Admin", value: "ubah_biaya_admin" },
            ]}
            value={action}
            onChange={(value: string) => setAction(value)}
          />

          {/* Buttons */}
          <div className="flex w-full justify-center gap-[8px]">
            <Button
              className="h-[32px] w-[112px] rounded-[20px] border border-[#F71717] bg-white text-[14px] font-semibold text-[#F71717] hover:bg-red-50"
              onClick={() => setIsOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="h-[32px] w-[112px] rounded-[20px] bg-[#176CF7] text-[14px] font-semibold text-white hover:bg-[#1560db]"
              onClick={handleSave}
            >
              Simpan
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default AturMassalModal;
