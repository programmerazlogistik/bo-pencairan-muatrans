import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { cn } from "@muatmuat/lib/utils";
import { Button } from "@muatmuat/ui/Button";
import { DatePickerWeb } from "@muatmuat/ui/Calendar";
import { Input, NumberInput } from "@muatmuat/ui/Form";

import { MultiSelect } from "@/components/Select/MultiSelect";

interface FinishedFilterProps {
  showFilter: boolean;
  setShowFilter: Dispatch<SetStateAction<boolean>>;
  isDetailView: boolean;
}

const BANK_OPTIONS = [
  { label: "BCA", value: "bca" },
  { label: "BRI", value: "bri" },
  { label: "Mandiri", value: "mandiri" },
  { label: "SMBC", value: "smbc" },
];

const BANK_FILTERS = [
  { label: "BCA", count: 8 },
  { label: "BRI", count: 5 },
  { label: "Mandiri", count: 7 },
  { label: "SMBC", count: 5 },
];

const FinishedFilter = ({
  showFilter,
  setShowFilter,
  isDetailView,
}: FinishedFilterProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [selectedBankPengirim, setSelectedBankPengirim] = useState<string[]>(
    []
  );
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

  const handleStatusClick = (value: string) => {
    setSelectedStatus(value);
  };

  const handleBankClick = (label: string) => {
    setSelectedBanks((prev) =>
      prev.includes(label)
        ? prev.filter((bank) => bank !== label)
        : [...prev, label]
    );
  };

  // Detail View Filter
  if (isDetailView) {
    return (
      <div className="flex w-full flex-col items-start rounded-[10px] border border-[#A8A8A8] p-[10px]">
        {/* Row 1: Bank Filters */}
        <div className="flex w-full flex-row items-center justify-between gap-[10px]">
          <div className="flex flex-row flex-wrap items-center gap-[12px]">
            {BANK_FILTERS.map((bank) => (
              <Button
                key={bank.label}
                variant={
                  selectedBanks.includes(bank.label)
                    ? "muatparts-primary"
                    : "muattrans-outline-primary"
                }
                onClick={() => handleBankClick(bank.label)}
              >
                {bank.label} ({bank.count})
              </Button>
            ))}
          </div>

          <div className="flex flex-row items-center gap-[12px]">
            <Button
              className={cn(
                "flex h-[32px] items-center justify-center rounded-[20px] border border-[#176CF7] bg-white px-[24px] py-[9px] text-[14px] font-semibold leading-[17px] text-[#176CF7] hover:bg-blue-50",
                showFilter && "bg-neutral-100"
              )}
              onClick={() => setShowFilter(!showFilter)}
            >
              {showFilter ? "Sembunyikan" : "Filter"}
            </Button>
          </div>
        </div>

        {/* Advanced Filter Section */}
        <div
          className={cn(
            "grid w-full transition-all duration-300 ease-in-out",
            showFilter
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="mt-4 flex w-full flex-col gap-5">
              <span className="text-[14px] font-semibold">Filter</span>
              <div className="flex w-full flex-row items-start gap-5">
                {/* Left Column */}
                <div className="flex flex-1 flex-col gap-5">
                  <div className="flex flex-row items-center gap-3">
                    <span className="w-[100px] min-w-[100px] text-xs font-normal text-[#1B1B1B]">
                      TRX ID
                    </span>
                    <Input
                      placeholder=""
                      className="w-full flex-1"
                      appearance={{
                        containerClassName: "h-[35px] rounded-[6px]",
                      }}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-3">
                    <span className="w-[100px] min-w-[100px] text-xs font-normal text-[#1B1B1B]">
                      ID Export
                    </span>
                    <Input
                      placeholder=""
                      className="w-full flex-1"
                      appearance={{
                        containerClassName: "h-[35px] rounded-[6px]",
                      }}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-3">
                    <span className="w-[100px] min-w-[100px] text-xs font-normal text-[#1B1B1B]">
                      Rekening Penerima
                    </span>
                    <Input
                      placeholder=""
                      className="w-full flex-1"
                      appearance={{
                        containerClassName: "h-[35px] rounded-[6px]",
                      }}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-3">
                    <span className="w-[100px] min-w-[100px] text-xs font-normal text-[#1B1B1B]">
                      Nama Rekening
                    </span>
                    <Input
                      placeholder=""
                      className="w-full flex-1"
                      appearance={{
                        containerClassName: "h-[35px] rounded-[6px]",
                      }}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-3">
                    <span className="w-[100px] min-w-[100px] text-xs font-normal text-[#1B1B1B]">
                      Bank Pengirim
                    </span>
                    <div className="flex-1">
                      <MultiSelect.Root
                        options={BANK_OPTIONS}
                        value={selectedBankPengirim}
                        onValueChange={setSelectedBankPengirim}
                        placeholder="Pilih Bank"
                      >
                        <MultiSelect.Trigger />
                        <MultiSelect.Content>
                          <MultiSelect.Search />
                          <MultiSelect.List />
                        </MultiSelect.Content>
                      </MultiSelect.Root>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-3">
                    <span className="w-[100px] min-w-[100px] self-start text-xs font-normal text-[#1B1B1B]">
                      Nominal Pencairan
                    </span>
                    <div className="flex flex-1 flex-row items-start gap-3">
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
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-1 flex-col gap-5">
                  <div className="flex flex-row items-center gap-3">
                    <span className="w-[140px] min-w-[140px] text-xs font-normal text-[#1B1B1B]">
                      Tanggal Export
                    </span>
                    <div className="flex flex-1 flex-row items-center gap-3">
                      <DatePickerWeb
                        placeholder="Pilih Tanggal"
                        className="w-full flex-1"
                      />
                      <span className="text-xs text-[#1B1B1B]">s/d</span>
                      <DatePickerWeb
                        placeholder="Pilih Tanggal"
                        className="w-full flex-1"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-3">
                    <span className="w-[140px] min-w-[140px] text-xs font-normal text-[#1B1B1B]">
                      Tanggal Update
                    </span>
                    <div className="flex flex-1 flex-row items-center gap-3">
                      <DatePickerWeb
                        placeholder="Pilih Tanggal"
                        className="w-full flex-1"
                      />
                      <span className="text-xs text-[#1B1B1B]">s/d</span>
                      <DatePickerWeb
                        placeholder="Pilih Tanggal"
                        className="w-full flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showFilter && (
          <div className="flex w-full flex-row justify-end gap-3">
            <Button className="h-[32px] rounded-[20px] border border-[#F71717] bg-white px-6 text-sm font-semibold text-[#F71717] hover:bg-red-50">
              Reset
            </Button>
            <Button className="h-[32px] rounded-[20px] border border-[#176CF7] bg-[#176CF7] px-6 text-sm font-semibold text-white hover:bg-[#1560db]">
              Terapkan
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Batch View Filter (original filter)
  return (
    <div className="flex w-full flex-col items-start">
      {/* Row: Filter Button */}
      <div className="flex w-full flex-row items-center justify-end gap-[10px]">
        <div className="flex flex-row items-center gap-[12px]">
          <Button
            className={cn(
              "flex h-[32px] items-center justify-center rounded-[20px] border border-[#176CF7] bg-white px-[24px] py-[9px] text-[14px] font-semibold leading-[17px] text-[#176CF7] hover:bg-blue-50",
              showFilter && "bg-neutral-100"
            )}
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? "Sembunyikan" : "Filter"}
          </Button>
        </div>
      </div>
      {/* Advanced Filter Section */}
      <div
        className={cn(
          "grid w-full rounded-[10px] transition-all duration-300 ease-in-out",
          showFilter
            ? "mt-2.5 grid-rows-[1fr] border border-[#A8A8A8] p-2.5 opacity-100"
            : "grid-rows-[0fr] border-0 p-0 opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex w-full flex-col gap-5">
            <span className="text-[14px] font-semibold">Filter</span>
            <div className="flex w-full flex-row items-start gap-5">
              {/* Left Column */}
              <div className="flex flex-1 flex-col gap-5">
                <div className="flex flex-row items-center gap-3">
                  <span className="w-[100px] min-w-[100px] text-xs font-normal text-[#1B1B1B]">
                    ID Export
                  </span>
                  <Input
                    placeholder=""
                    className="w-full flex-1"
                    appearance={{
                      containerClassName: "h-[35px] rounded-[6px]",
                    }}
                  />
                </div>
                <div className="flex flex-row items-center gap-3">
                  <span className="w-[100px] min-w-[100px] text-xs font-normal text-[#1B1B1B]">
                    Bank Penerima
                  </span>
                  <div className="flex-1">
                    <MultiSelect.Root
                      options={BANK_OPTIONS}
                      value={selectedBanks}
                      onValueChange={setSelectedBanks}
                      placeholder="Pilih Bank"
                    >
                      <MultiSelect.Trigger />
                      <MultiSelect.Content>
                        <MultiSelect.Search />
                        <MultiSelect.List />
                      </MultiSelect.Content>
                    </MultiSelect.Root>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3">
                  <span className="w-[100px] min-w-[100px] text-xs font-normal text-[#1B1B1B]">
                    Bank Pengirim
                  </span>
                  <div className="flex-1">
                    <MultiSelect.Root
                      options={BANK_OPTIONS}
                      value={selectedBankPengirim}
                      onValueChange={setSelectedBankPengirim}
                      placeholder="Pilih Bank"
                    >
                      <MultiSelect.Trigger />
                      <MultiSelect.Content>
                        <MultiSelect.Search />
                        <MultiSelect.List />
                      </MultiSelect.Content>
                    </MultiSelect.Root>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3">
                  <span className="w-[100px] min-w-[100px] self-start text-xs font-normal text-[#1B1B1B]">
                    Nominal Pencairan
                  </span>
                  <div className="flex flex-1 flex-row items-start gap-3">
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
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-1 flex-col gap-5">
                <div className="flex flex-row items-center gap-3">
                  <span className="w-[140px] min-w-[140px] text-xs font-normal text-[#1B1B1B]">
                    Tanggal Export
                  </span>
                  <div className="flex flex-1 flex-row items-center gap-3">
                    <DatePickerWeb
                      placeholder="Pilih Tanggal"
                      className="w-full flex-1"
                    />
                    <span className="text-xs text-[#1B1B1B]">s/d</span>
                    <DatePickerWeb
                      placeholder="Pilih Tanggal"
                      className="w-full flex-1"
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3">
                  <span className="w-[140px] min-w-[140px] text-xs font-normal text-[#1B1B1B]">
                    Tanggal Success
                  </span>
                  <div className="flex flex-1 flex-row items-center gap-3">
                    <DatePickerWeb
                      placeholder="Pilih Tanggal"
                      className="w-full flex-1"
                    />
                    <span className="text-xs text-[#1B1B1B]">s/d</span>
                    <DatePickerWeb
                      placeholder="Pilih Tanggal"
                      className="w-full flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showFilter && (
          <div className="flex w-full flex-row justify-end gap-3">
            <Button className="h-[32px] rounded-[20px] border border-[#F71717] bg-white px-6 text-sm font-semibold text-[#F71717] hover:bg-red-50">
              Reset
            </Button>
            <Button className="h-[32px] rounded-[20px] border border-[#176CF7] bg-[#176CF7] px-6 text-sm font-semibold text-white hover:bg-[#1560db]">
              Terapkan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinishedFilter;
