import { useEffect, useState } from "react";

import { cn } from "@muatmuat/lib/utils";
import { Button } from "@muatmuat/ui/Button";
// Changed from DatePickerWeb
import { Input, NumberInput } from "@muatmuat/ui/Form";

// NumberInput is still used for nominal

import {
  NotExportedListFilter,
  useNotExportedList,
} from "@/services/Pencairan/useNotExported";

import { useNotExportedStore } from "@/store/Pencairan/useNotExportedStore";
import { DatePickerWeb } from "@muatmuat/ui/Calendar";

interface NotExportedFilterProps {
  showFilter: boolean;
  setShowFilter: (show: boolean) => void; // Updated type
  showExport: boolean;
  setShowExport: (show: boolean) => void; // Updated type
}

const NotExportedFilter = ({
  showFilter,
  setShowFilter,
  showExport,
  setShowExport,
}: NotExportedFilterProps) => {
  const { filters, setFilters } = useNotExportedStore();

  // Local state for draft filters
  const [localParams, setLocalParams] =
    useState<NotExportedListFilter>(filters);

  // Sync local params with store params when store params change (e.g. reset)
  useEffect(() => {
    setLocalParams(filters);
  }, [filters]);

  const { data } = useNotExportedList({});

  const statusFilters = [
    { label: "All", value: "all", count: data?.Summary?.all || 0 },
    { label: "Baru", value: "baru", count: data?.Summary?.new || 0 },
    {
      label: "Retransfer",
      value: "retransfer",
      count: data?.Summary?.retransfer || 0,
    },
  ];

  const bankFilters = data?.Summary?.banks || [];

  const selectedStatus = localParams.status || "all";
  const selectedBanks = localParams.banks || [];

  const nominalMaxError =
    localParams.nominalMin !== undefined &&
    localParams.nominalMax !== undefined &&
    localParams.nominalMax < localParams.nominalMin
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
    const newStatus = value === "all" ? undefined : value; // Convert "all" to undefined for the store
    const newParams = { ...localParams, status: newStatus };
    setLocalParams(newParams);
    setFilters(newParams); // Apply status immediately
  };

  const handleBankClick = (bankLabel: string) => {
    let newBanks = [...(localParams.banks || [])]; // Use localParams.banks
    if (newBanks.includes(bankLabel)) {
      newBanks = newBanks.filter((b) => b !== bankLabel);
    } else {
      newBanks.push(bankLabel);
    }
    const newParams = { ...localParams, banks: newBanks };
    setLocalParams(newParams);
    setFilters(newParams); // Apply banks immediately
  };

  const handleApply = () => {
    setFilters(localParams);
  };

  const handleReset = () => {
    setFilters({}); // Reset store
    // localParams will be updated via the useEffect when filters change
  };

  // Helper to update local keys
  const updateLocal = (key: keyof NotExportedListFilter, value: any) => {
    setLocalParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex w-full flex-col items-start gap-[10px] rounded-[10px] border border-[#A8A8A8] p-[10px]">
      {/* Row 1: Status Filters */}
      <div className="flex flex-row gap-[15px]">
        {statusFilters.map((status) => (
          <Button
            key={status.value}
            variant={
              selectedStatus === status.value
                ? "muatparts-primary"
                : "muattrans-outline-primary"
            }
            onClick={() => handleStatusClick(status.value)}
          >
            {status.label} ({status.count})
          </Button>
        ))}
      </div>

      {/* Row 2: Bank Filters and Actions */}
      <div className="flex w-full flex-row items-center justify-between gap-[10px]">
        <div className="flex flex-row flex-wrap items-center gap-[12px]">
          {bankFilters.map((bank) => (
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
          <Button
            variant={
              showExport ? "muatparts-error-secondary" : "muatparts-primary"
            }
            onClick={() => setShowExport(!showExport)}
          >
            {showExport ? "Batal" : "Export"}
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
                    No. Invoice
                  </span>
                  <Input
                    placeholder="No. Invoice"
                    className="w-full flex-1"
                    appearance={{
                      containerClassName: "h-[35px] rounded-[6px]",
                    }}
                    value={localParams.search || ""}
                    onChange={(e) => updateLocal("search", e.target.value)}
                  />
                </div>
                <div className="flex flex-row items-center gap-3">
                  <span className="w-[100px] min-w-[100px] text-xs font-normal text-[#1B1B1B]">
                    Rekening Tujuan
                  </span>
                  <Input
                    placeholder="Pilih Sub Kategori"
                    className="w-full flex-1"
                    appearance={{
                      containerClassName: "h-[35px] rounded-[6px]",
                    }}
                    value={localParams.rekeningTujuan || ""}
                    onChange={(e) =>
                      updateLocal("rekeningTujuan", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-row items-center gap-3">
                  <span className="w-[100px] min-w-[100px] text-xs font-normal text-[#1B1B1B]">
                    Nama Rekening
                  </span>
                  <Input
                    placeholder="Masukkan Nama Penjual"
                    className="w-full flex-1"
                    appearance={{
                      containerClassName: "h-[35px] rounded-[6px]",
                    }}
                    value={localParams.namaRekening || ""}
                    onChange={(e) =>
                      updateLocal("namaRekening", e.target.value)
                    }
                  />
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
                      value={localParams.nominalMin ?? null}
                      onValueChange={(val) =>
                        updateLocal("nominalMin", val ?? undefined)
                      }
                    />
                    <span className="pt-2 text-xs text-[#1B1B1B]">s/d</span>
                    <NumberInput
                      placeholder="Maksimal"
                      className="flex-1"
                      hideStepper
                      text={{ left: "Rp" }}
                      defaultValue={null}
                      value={localParams.nominalMax ?? null}
                      onValueChange={(val) =>
                        setLocalParams({
                          ...localParams,
                          nominalMax: val ?? undefined,
                        })
                      }
                      errorMessage={debouncedError}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-1 flex-col gap-5">
                <div className="flex flex-row items-center gap-3">
                  <span className="w-[140px] min-w-[140px] text-xs font-normal text-[#1B1B1B]">
                    Tanggal Settlement
                  </span>
                  <div className="flex flex-1 flex-row items-center gap-3">
                    <DatePickerWeb
                      placeholder="Pilih Tanggal"
                      className="w-full flex-1"
                      value={
                        localParams.startDate
                          ? new Date(localParams.startDate)
                          : undefined
                      }
                      onChange={(date) =>
                        setLocalParams({
                          ...localParams,
                          startDate: date ? date.toISOString() : undefined,
                        })
                      }
                    />
                    <span className="text-xs text-[#1B1B1B]">s/d</span>
                    <DatePickerWeb
                      placeholder="Pilih Tanggal"
                      className="w-full flex-1"
                      value={
                        localParams.endDate
                          ? new Date(localParams.endDate)
                          : undefined
                      }
                      onChange={(date) =>
                        setLocalParams({
                          ...localParams,
                          endDate: date ? date.toISOString() : undefined,
                        })
                      }
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
          <Button
            className="h-[32px] rounded-[20px] border border-[#F71717] bg-white px-6 text-sm font-semibold text-[#F71717] hover:bg-red-50"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            className="h-[32px] rounded-[20px] border border-[#176CF7] bg-[#176CF7] px-6 text-sm font-semibold text-white hover:bg-[#1560db]"
            onClick={handleApply}
          >
            Terapkan
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotExportedFilter;
