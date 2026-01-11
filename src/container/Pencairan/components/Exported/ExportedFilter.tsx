import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { cn } from "@muatmuat/lib/utils";
import { Button } from "@muatmuat/ui/Button";
import { DatePickerWeb } from "@muatmuat/ui/Calendar";
import { Input, NumberInput } from "@muatmuat/ui/Form";
import { ConfirmationModal } from "@muatmuat/ui/Modal";

import { MultiSelect } from "@/components/Select/MultiSelect";

import AturMassalModal from "./AturMassalModal";
import UbahBiayaAdminModal from "./UbahBiayaAdminModal";

interface ExportedFilterProps {
  showFilter: boolean;
  setShowFilter: Dispatch<SetStateAction<boolean>>;
  bulkAction?: string | null;
  onBulkAction: (action: string | null) => void;
  selectedCount?: number;
}

const ExportedFilter = ({
  showFilter,
  setShowFilter,
  bulkAction,
  onBulkAction,
  selectedCount = 0,
}: ExportedFilterProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showUbahBiayaModal, setShowUbahBiayaModal] = useState(false);

  const [bankPenerima, setBankPenerima] = useState<string[]>([]);
  const [bankPengirim, setBankPengirim] = useState<string[]>([]);
  const [nominalMin, setNominalMin] = useState<number | undefined>(undefined);
  const [nominalMax, setNominalMax] = useState<number | undefined>(undefined);

  const nominalMaxError =
    nominalMin !== undefined &&
    nominalMax !== undefined &&
    nominalMax < nominalMin
      ? "Harus lebih besar dari nominal awal"
      : undefined;

  const [debouncedError, setDebouncedError] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (nominalMaxError) {
      const timer = setTimeout(() => {
        setDebouncedError(nominalMaxError);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setDebouncedError(undefined);
    }
  }, [nominalMaxError]);

  const bankOptions = [
    { label: "BCA", value: "bca" },
    { label: "Mandiri", value: "mandiri" },
    { label: "BRI", value: "bri" },
    { label: "BNI", value: "bni" },
    { label: "Bank Mega (5)", value: "bank_mega" },
  ];

  const handleBulkActionClick = () => {
    if (bulkAction === "ubah_biaya_admin") {
      setShowUbahBiayaModal(true);
    } else if (bulkAction) {
      setShowConfirmation(true);
    }
  };

  const handleSaveBulkBiaya = (amount: number) => {
    console.log(`Updating bulk admin fee to: ${amount}`);
    setShowUbahBiayaModal(false);
    onBulkAction(null);
  };

  const handleConfirmAction = () => {
    console.log(`Executing bulk action: ${bulkAction}`);
    setShowConfirmation(false);
    onBulkAction(null);
  };

  const getConfirmationMessage = () => {
    switch (bulkAction) {
      case "selesaikan":
        return "Apakah anda yakin akan menyelesaikan pencairan?";
      case "gagalkan":
        return "Apakah anda yakin akan menggagalkan pencairan?";
      case "batalkan":
        return "Apakah anda yakin akan membatalkan pencairan?";
      default:
        return "Apakah anda yakin akan melanjutkan aksi ini?";
    }
  };

  return (
    <div className="flex w-full flex-col rounded-[10px]">
      {/* Action Buttons */}
      <div className="flex w-full justify-end gap-[10px]">
        {bulkAction && (
          <Button
            onClick={() => onBulkAction(null)}
            variant="muatparts-error-secondary"
          >
            Batal
          </Button>
        )}

        <Button
          variant={
            bulkAction === "batalkan" || bulkAction === "gagalkan"
              ? "muattrans-error"
              : bulkAction
                ? "muatparts-primary"
                : "muatparts-primary-secondary"
          }
          onClick={() =>
            bulkAction ? handleBulkActionClick() : setShowModal(true)
          }
          disabled={bulkAction !== null && selectedCount === 0}
        >
          {bulkAction === "selesaikan"
            ? "Selesaikan"
            : bulkAction === "gagalkan"
              ? "Gagalkan"
              : bulkAction === "batalkan"
                ? "Batalkan"
                : bulkAction === "ubah_biaya_admin"
                  ? "Ubah Biaya Admin"
                  : "Atur Massal"}
        </Button>

        <Button
          variant="muatparts-primary-secondary"
          onClick={() => setShowFilter(!showFilter)}
        >
          {showFilter ? "Sembunyikan" : "Filter"}
        </Button>
      </div>

      {/* Advanced Filter */}
      <div
        className={cn(
          "grid transition-all duration-300",
          showFilter
            ? "mt-2.5 grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div
          className={cn(
            "overflow-hidden rounded-[10px] border border-[#A8A8A8]"
          )}
        >
          <div className="mt-4 flex flex-col gap-5 p-2.5">
            <span className="text-[14px] font-semibold">Filter</span>

            <div className="flex gap-5">
              {/* Left */}
              <div className="flex flex-1 flex-col gap-5">
                <FilterRow label="ID Export">
                  <Input placeholder="ID Export" />
                </FilterRow>

                <FilterRow label="Bank Penerima">
                  <MultiSelect.Root
                    enableSelectAll={false}
                    options={bankOptions}
                    value={bankPenerima}
                    onValueChange={setBankPenerima}
                    placeholder="Pilih Bank"
                  >
                    <MultiSelect.Trigger />
                    <MultiSelect.Content>
                      <MultiSelect.List />
                    </MultiSelect.Content>
                  </MultiSelect.Root>
                </FilterRow>

                <FilterRow label="Bank Pengirim">
                  <MultiSelect.Root
                    enableSelectAll={false}
                    options={bankOptions}
                    value={bankPengirim}
                    onValueChange={setBankPengirim}
                    placeholder="Pilih Bank"
                  >
                    <MultiSelect.Trigger />
                    <MultiSelect.Content>
                      <MultiSelect.List />
                    </MultiSelect.Content>
                  </MultiSelect.Root>
                </FilterRow>

                <FilterRow label="Nominal Pencairan" alignTop>
                  <div className="flex flex-row items-start gap-3">
                    <NumberInput
                      placeholder="Minimal"
                      className="flex-1"
                      hideStepper
                      text={{ left: "Rp" }}
                      defaultValue={null}
                      value={nominalMin ?? null}
                      onValueChange={setNominalMin}
                    />
                    <span className="pt-2 text-xs text-[#1B1B1B]">s/d</span>
                    <NumberInput
                      placeholder="Maksimal"
                      className="flex-1"
                      hideStepper
                      text={{ left: "Rp" }}
                      defaultValue={null}
                      value={nominalMax ?? null}
                      onValueChange={setNominalMax}
                      errorMessage={debouncedError}
                    />
                  </div>
                </FilterRow>

                <FilterRow label="Nama User">
                  <Input placeholder="Nama User" />
                </FilterRow>
              </div>

              {/* Right */}
              <div className="flex flex-1 flex-col gap-5">
                <FilterRow label="Tanggal Export">
                  <div className="flex gap-3">
                    <DatePickerWeb placeholder="Tanggal" />
                    <span className="pt-2 text-xs">s/d</span>
                    <DatePickerWeb placeholder="Tanggal" />
                  </div>
                </FilterRow>
              </div>
            </div>

            {/* Filter Actions */}
            {showFilter && (
              <div className="flex justify-end gap-3">
                <Button variant="muatparts-error-secondary">Reset</Button>
                <Button variant="muatparts-primary"> Terapkan </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AturMassalModal
        isOpen={showModal}
        setIsOpen={setShowModal}
        onSave={onBulkAction}
      />

      <ConfirmationModal
        isOpen={showConfirmation}
        setIsOpen={setShowConfirmation}
        variant="bo"
        title={{ text: "Pemberitahuan" }}
        description={{ text: getConfirmationMessage() }}
        confirm={{ text: "Ya", onClick: handleConfirmAction }}
        cancel={{ text: "Tidak" }}
      />

      <UbahBiayaAdminModal
        isOpen={showUbahBiayaModal}
        setIsOpen={setShowUbahBiayaModal}
        onSave={handleSaveBulkBiaya}
        title="Ubah Massal Biaya Admin"
      />
    </div>
  );
};

/* Helper */
const FilterRow = ({
  label,
  children,
  alignTop = false,
}: {
  label: string;
  children: React.ReactNode;
  alignTop?: boolean;
}) => (
  <div className="flex items-center gap-3">
    <span
      className={`w-[100px] min-w-[100px] text-xs text-[#1B1B1B] ${alignTop ? "self-start" : ""}`}
    >
      {label}
    </span>
    <div className="flex-1">{children}</div>
  </div>
);

export default ExportedFilter;
