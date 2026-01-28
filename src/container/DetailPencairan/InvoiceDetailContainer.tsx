"use client";

import PageTitle from "@/components/PageTitle/PageTitle";

import DetailInfoSection, { DetailField } from "./components/DetailInfoSection";

// Invoice View dummy data (from NotExported)
const INVOICE_DUMMY_DATA: Record<string, DetailField[]> = {
  "INV/2026/001": [
    { label: "Nama User", value: "Toko A", isLink: true, color: "blue" },
    { label: "Email", value: "tokoA@mail.com", isLink: true, color: "blue" },
    { label: "Bank", value: "BCA" },
    { label: "No. Rekening", value: "08812412414" },
    { label: "Nama Rekening", value: "John Doe" },
    {
      label: "Jenis Pencairan",
      value: "Pencairan Transporter",
      color: "green",
    },
    { label: "Total Pencairan", value: "Rp 1.000.000" },
    { label: "divider", value: "" },
    { label: "ID Pesanan", value: "MT25A001A" },
    { label: "Tanggal Dibuat", value: "10/01/2026 10.00" },
    { label: "Tanggal Settlement", value: "10/01/2026 15.00" },
    { label: "No. Invoice", value: "INV/2026/001" },
    { label: "Metode Pembayaran", value: "BCA VA" },
    { label: "Total", value: "Rp 1.000.000" },
    { label: "Pajak", value: "Rp 100.000" },
    { label: "Status", value: "Baru" },
  ],
};

interface InvoiceDetailContainerProps {
  id: string;
}

const InvoiceDetailContainer = ({ id }: InvoiceDetailContainerProps) => {
  const decodedId = decodeURIComponent(id);

  const fields =
    INVOICE_DUMMY_DATA[decodedId] || INVOICE_DUMMY_DATA["INV/2026/001"];

  return (
    <div className="flex flex-col items-start gap-[10px]">
      <PageTitle className="!mb-0 text-2xl text-primary-700">
        Detail Invoice
      </PageTitle>

      <DetailInfoSection fields={fields} />
    </div>
  );
};

export default InvoiceDetailContainer;
