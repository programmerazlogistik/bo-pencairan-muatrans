"use client";

import { useSearchParams } from "next/navigation";

import { cn } from "@muatmuat/lib/utils";
import { Button } from "@muatmuat/ui/Button";

import PageTitle from "@/components/PageTitle/PageTitle";

// Define field types for both views
interface DetailField {
  label: string;
  value: string;
}

// TRX View dummy data
const TRX_DUMMY_DATA: Record<string, DetailField[]> = {
  "TRX/2026/001": [
    { label: "TRX ID", value: "TRX/2026/001" },
    { label: "ID Export", value: "EXP/2026/001" },
    { label: "Tanggal Export", value: "10/01/2026 10.00" },
    { label: "Tanggal Update", value: "10/01/2026 15.00" },
    { label: "Rekening Pengirim", value: "1234567890" },
    { label: "Nominal Pencairan", value: "Rp 2.000.000" },
    { label: "Biaya Admin", value: "Rp 5.000" },
    { label: "Rekening Penerima", value: "0987654321" },
    { label: "Nama Rekening Penerima", value: "John Doe" },
  ],
};

// Batch View dummy data
const BATCH_DUMMY_DATA: Record<string, DetailField[]> = {
  "EXP/2026/001": [
    { label: "ID Export", value: "EXP/2026/001" },
    { label: "Tanggal Export", value: "10/01/2026 10.00" },
    { label: "Tanggal Success", value: "10/01/2026 15.00" },
    { label: "Nominal Pencairan", value: "Rp 10.000.000" },
    { label: "Biaya Admin", value: "Rp 25.000" },
    { label: "Status Selesai", value: "Sukses" },
    { label: "Bank Penerima", value: "BCA" },
    { label: "Jumlah Rekening", value: "15" },
    { label: "Bank Pengirim", value: "BCA" },
  ],
};

// Invoice View dummy data (from NotExported)
const INVOICE_DUMMY_DATA: Record<string, DetailField[]> = {
  "INV/2026/001": [
    { label: "No. Invoice", value: "INV/2026/001" },
    { label: "Tanggal Settlement", value: "10/01/2026 10.00" },
    { label: "Nominal", value: "Rp 1.000.000" },
    { label: "Rekening Tujuan", value: "BCA" },
    { label: "Nama Rekening", value: "John Doe" },
    { label: "Jenis", value: "Pencairan Transporter" },
    { label: "Status", value: "Baru" },
  ],
};

interface FinishedDetailContainerProps {
  id: string;
}

const FinishedDetailContainer = ({ id }: FinishedDetailContainerProps) => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "trx";

  const decodedId = decodeURIComponent(id);

  // Get data based on type
  let fields: DetailField[];
  let title: string;
  let badgeColor: string;
  let badgeText: string;

  switch (type) {
    case "batch":
      fields = BATCH_DUMMY_DATA[decodedId] || BATCH_DUMMY_DATA["EXP/2026/001"];
      title = `Detail Batch: ${decodedId}`;
      badgeColor = "bg-green-100 text-green-700";
      badgeText = "Batch View";
      break;
    case "invoice":
      fields =
        INVOICE_DUMMY_DATA[decodedId] || INVOICE_DUMMY_DATA["INV/2026/001"];
      title = `Detail Invoice: ${decodedId}`;
      badgeColor = "bg-orange-100 text-orange-700";
      badgeText = "Invoice View";
      break;
    default: // trx
      fields = TRX_DUMMY_DATA[decodedId] || TRX_DUMMY_DATA["TRX/2026/001"];
      title = `Detail TRX: ${decodedId}`;
      badgeColor = "bg-blue-100 text-blue-700";
      badgeText = "TRX View";
  }

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        className="text-2xl"
        appearance={{ iconClassName: "text-black" }}
      >
        {title}
      </PageTitle>

      {/* Type Badge */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            badgeColor
          )}
        >
          {badgeText}
        </span>
      </div>

      {/* Detail Card */}
      <div className="rounded-[10px] border border-[#A8A8A8] bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#1B1B1B]">
          Informasi Detail
        </h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {fields.map((field, index) => (
            <div key={index} className="flex flex-col gap-1">
              <span className="text-xs font-normal text-[#868686]">
                {field.label}
              </span>
              <span className="text-sm font-medium text-[#1B1B1B]">
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          variant="muatparts-primary-secondary"
          onClick={() => window.history.back()}
        >
          Kembali
        </Button>
      </div>
    </div>
  );
};

export default FinishedDetailContainer;
