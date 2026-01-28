"use client";

import { useMemo } from "react";

import { Button } from "@muatmuat/ui/Button";
import { DataTableBO } from "@muatmuat/ui/Table";
import { ColumnDef } from "@tanstack/react-table";

import PageTitle from "@/components/PageTitle/PageTitle";

import DetailInfoSection, { DetailField } from "./components/DetailInfoSection";

// TRX table data structure (for detail view from Finished)
interface TrxTableData {
  id: string;
  tanggal_settlement: string;
  no_invoice: string;
  nominal_pencairan: string;
}

// Dummy data for TRX table
const TRX_TABLE_DATA: TrxTableData[] = [
  {
    id: "1",
    tanggal_settlement: "10/01/2026 15.00",
    no_invoice: "INV/2026/001",
    nominal_pencairan: "Rp 2.000.000",
  },
  {
    id: "2",
    tanggal_settlement: "09/01/2026 14.30",
    no_invoice: "INV/2026/002",
    nominal_pencairan: "Rp 3.000.000",
  },
  {
    id: "3",
    tanggal_settlement: "08/01/2026 13.20",
    no_invoice: "INV/2026/003",
    nominal_pencairan: "Rp 5.000.000",
  },
  {
    id: "4",
    tanggal_settlement: "07/01/2026 11.45",
    no_invoice: "INV/2026/004",
    nominal_pencairan: "Rp 2.500.000",
  },
];

// TRX View dummy data
const TRX_DUMMY_DATA: Record<string, DetailField[]> = {
  "TRX/2026/001": [
    { label: "Nama User", value: "Toko A", isLink: true, color: "blue" },
    { label: "Email", value: "tokoA@mail.com", isLink: true, color: "blue" },
    { label: "Bank", value: "BCA" },
    { label: "No. Rekening", value: "08812412414" },
    { label: "Nama Rekening", value: "Sugeng Iswahyudi" },
    {
      label: "Jenis Pencairan",
      value: "Pencairan Transporter",
      color: "green",
    },
    { label: "Total Pencairan", value: "Rp1.490.000" },
    { label: "divider", value: "" },
    { label: "ID <Transaksi>", value: "MT25A001A" },
    { label: "Tanggal Dibuat", value: "28/01/2024 10.00" },
    { label: "Tanggal Settlement", value: "28/01/2024 10.00" },
    { label: "<Informasi Menyesuaikan>", value: "bla" },
    { label: "<Jika terdapat file/ image>", value: "BCA VA" },
    { label: "Total", value: "Rp1.496.000" },
    { label: "Pajak", value: "Rp100.000" },
    { label: "Status", value: "Selesai", color: "green" },
  ],
};

interface TrxDetailContainerProps {
  id: string;
}

const TrxDetailContainer = ({ id }: TrxDetailContainerProps) => {
  const decodedId = decodeURIComponent(id);

  const fields = TRX_DUMMY_DATA[decodedId] || TRX_DUMMY_DATA["TRX/2026/001"];

  // TRX table columns
  const trxTableColumns: ColumnDef<TrxTableData>[] = useMemo(
    () => [
      {
        accessorKey: "actions",
        enableSorting: false,
        size: 100,
        header: "Action",
        cell: ({ row }) => (
          <Button
            className="h-[28px] bg-[#3ECD00] px-3 text-xs font-semibold text-white hover:bg-[#36b300]"
            onClick={() => console.log("Detail clicked", row.original.id)}
          >
            Detail
          </Button>
        ),
      },
      {
        accessorKey: "tanggal_settlement",
        header: "Tanggal Settlement",
      },
      {
        accessorKey: "no_invoice",
        header: "No Invoice",
      },
      {
        accessorKey: "nominal_pencairan",
        header: "Nominal Pencairan",
      },
    ],
    []
  );

  return (
    <div className="flex flex-col items-start gap-[10px]">
      <PageTitle className="!mb-0 text-2xl text-primary-700">
        Detail Pencairan
      </PageTitle>

      <DetailInfoSection fields={fields} />

      <div className="mt-[20px] w-full">
        <DataTableBO.Root data={TRX_TABLE_DATA} columns={trxTableColumns}>
          <DataTableBO.Content />
          <DataTableBO.Pagination />
        </DataTableBO.Root>
      </div>
    </div>
  );
};

export default TrxDetailContainer;
