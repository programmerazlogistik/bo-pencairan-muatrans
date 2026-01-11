import { useMemo } from "react";

import { Button } from "@muatmuat/ui/Button";
import { DataTableBO } from "@muatmuat/ui/Table";
import { ColumnDef } from "@tanstack/react-table";

import { ActionDropdown } from "@/components/Dropdown/ActionDropdown";
import Toggle from "@/components/Toggle/Toggle";
import { useRouter } from "next/navigation";

// Detail view data structure (transaction level)
interface DetailData {
  id: string;
  trx_id: string;
  id_export: string;
  tanggal_export: string;
  tanggal_update: string;
  rekening_pengirim: string;
  nominal_pencairan: string;
  biaya_admin: string;
  rekening_penerima: string;
  nama_rekening_penerima: string;
}

// Batch view data structure (export level)
interface BatchData {
  id: string;
  id_export: string;
  tanggal_export: string;
  tanggal_success: string;
  nominal_pencairan: string;
  biaya_admin: string;
  status_selesai: string;
  bank: string;
  jumlah_rekening: number;
  bank_pengirim: string;
}

const DUMMY_DETAIL_DATA: DetailData[] = [
  {
    id: "1",
    trx_id: "TRX/2026/001",
    id_export: "EXP/2026/001",
    tanggal_export: "10/01/2026 10.00",
    tanggal_update: "10/01/2026 15.00",
    rekening_pengirim: "1234567890",
    nominal_pencairan: "Rp 2.000.000",
    biaya_admin: "Rp 5.000",
    rekening_penerima: "0987654321",
    nama_rekening_penerima: "John Doe",
  },
  {
    id: "2",
    trx_id: "TRX/2026/002",
    id_export: "EXP/2026/001",
    tanggal_export: "10/01/2026 10.00",
    tanggal_update: "10/01/2026 15.00",
    rekening_pengirim: "1234567890",
    nominal_pencairan: "Rp 3.000.000",
    biaya_admin: "Rp 5.000",
    rekening_penerima: "1122334455",
    nama_rekening_penerima: "Jane Smith",
  },
  {
    id: "3",
    trx_id: "TRX/2026/003",
    id_export: "EXP/2026/002",
    tanggal_export: "09/01/2026 11.00",
    tanggal_update: "09/01/2026 16.30",
    rekening_pengirim: "9876543210",
    nominal_pencairan: "Rp 5.000.000",
    biaya_admin: "Rp 5.000",
    rekening_penerima: "5566778899",
    nama_rekening_penerima: "Bob Wilson",
  },
  {
    id: "4",
    trx_id: "TRX/2026/004",
    id_export: "EXP/2026/002",
    tanggal_export: "09/01/2026 11.00",
    tanggal_update: "09/01/2026 16.30",
    rekening_pengirim: "9876543210",
    nominal_pencairan: "Rp 2.500.000",
    biaya_admin: "Rp 5.000",
    rekening_penerima: "6677889900",
    nama_rekening_penerima: "Alice Brown",
  },
];

const DUMMY_BATCH_DATA: BatchData[] = [
  {
    id: "1",
    id_export: "EXP/2026/001",
    tanggal_export: "10/01/2026 10.00",
    tanggal_success: "10/01/2026 15.00",
    nominal_pencairan: "Rp 10.000.000",
    biaya_admin: "Rp 25.000",
    status_selesai: "Sukses",
    bank: "BCA",
    jumlah_rekening: 15,
    bank_pengirim: "BCA",
  },
  {
    id: "2",
    id_export: "EXP/2026/002",
    tanggal_export: "09/01/2026 11.00",
    tanggal_success: "09/01/2026 16.30",
    nominal_pencairan: "Rp 25.500.000",
    biaya_admin: "Rp 50.000",
    status_selesai: "Sukses",
    bank: "Mandiri",
    jumlah_rekening: 23,
    bank_pengirim: "Mandiri",
  },
  {
    id: "3",
    id_export: "EXP/2026/003",
    tanggal_export: "08/01/2026 09.00",
    tanggal_success: "08/01/2026 14.15",
    nominal_pencairan: "Rp 5.000.000",
    biaya_admin: "Rp 15.000",
    status_selesai: "Sukses",
    bank: "BRI",
    jumlah_rekening: 8,
    bank_pengirim: "BRI",
  },
  {
    id: "4",
    id_export: "EXP/2026/004",
    tanggal_export: "07/01/2026 12.00",
    tanggal_success: "07/01/2026 17.45",
    nominal_pencairan: "Rp 15.750.000",
    biaya_admin: "Rp 35.000",
    status_selesai: "Sukses",
    bank: "SMBC",
    jumlah_rekening: 12,
    bank_pengirim: "SMBC",
  },
];

interface FinishedTableProps {
  isDetailView: boolean;
  setIsDetailView: (value: boolean) => void;
}

const FinishedTable = ({
  isDetailView,
  setIsDetailView,
}: FinishedTableProps) => {
  const router = useRouter();

  // Detail view columns (toggleValue = true)
  const detailColumns: ColumnDef<DetailData>[] = useMemo(
    () => [
      {
        accessorKey: "actions",
        enableSorting: false,
        size: 100,
        header: "Action",
        cell: ({ row }) => {
          const handleDetailClick = () => {
            const encodedId = encodeURIComponent(row.original.trx_id);
            router.push(`/pencairan/${encodedId}?type=trx`);
          };
          return (
            <Button
              className="h-[28px] bg-[#3ECD00] px-3 text-xs font-semibold text-white hover:bg-[#36b300]"
              onClick={handleDetailClick}
            >
              Detail
            </Button>
          );
        },
      },
      {
        accessorKey: "trx_id",
        header: "TRX ID",
      },
      {
        accessorKey: "id_export",
        header: "ID Export",
      },
      {
        accessorKey: "tanggal_export",
        header: "Tanggal Export",
      },
      {
        accessorKey: "tanggal_update",
        header: "Tanggal Update",
      },
      {
        accessorKey: "rekening_pengirim",
        header: "Rekening Pengirim",
      },
      {
        accessorKey: "nominal_pencairan",
        header: "Nominal Pencairan",
      },
      {
        accessorKey: "biaya_admin",
        header: "Biaya Admin",
      },
      {
        accessorKey: "rekening_penerima",
        header: "Rekening Penerima",
      },
      {
        accessorKey: "nama_rekening_penerima",
        header: "Nama Rekening Penerima",
      },
    ],
    []
  );

  // Batch view columns (toggleValue = false)
  const batchColumns: ColumnDef<BatchData>[] = useMemo(
    () => [
      {
        accessorKey: "actions",
        enableSorting: false,
        size: 100,
        header: "Action",
        cell: ({ row }) => {
          const handleDetailClick = () => {
            const encodedId = encodeURIComponent(row.original.id_export);
            router.push(`/pencairan/${encodedId}?type=batch`);
          };
          return (
            <ActionDropdown.Root>
              <ActionDropdown.Trigger />
              <ActionDropdown.Content>
                <ActionDropdown.Item onClick={handleDetailClick}>
                  Detail
                </ActionDropdown.Item>
                <ActionDropdown.Item
                  onClick={() =>
                    console.log("Export Ulang clicked", row.original.id)
                  }
                >
                  Export Ulang
                </ActionDropdown.Item>
              </ActionDropdown.Content>
            </ActionDropdown.Root>
          );
        },
      },
      {
        accessorKey: "id_export",
        header: "ID Export",
      },
      {
        accessorKey: "tanggal_export",
        header: "Tanggal Export",
      },
      {
        accessorKey: "tanggal_success",
        header: "Tanggal Success",
      },
      {
        accessorKey: "nominal_pencairan",
        header: "Nominal Pencairan",
      },
      {
        accessorKey: "biaya_admin",
        header: "Biaya Admin",
      },
      {
        accessorKey: "status_selesai",
        header: "Status Selesai",
      },
      {
        accessorKey: "bank",
        header: "Bank",
      },
      {
        accessorKey: "jumlah_rekening",
        header: "Jumlah Rekening",
      },
      {
        accessorKey: "bank_pengirim",
        header: "Bank Pengirim",
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs font-medium">Tampilan Batch</span>
        <Toggle value={isDetailView} onClick={setIsDetailView} />
        <span className="text-xs font-medium">Tampilan Detail</span>
      </div>
      {isDetailView ? (
        <DataTableBO.Root data={DUMMY_DETAIL_DATA} columns={detailColumns}>
          <DataTableBO.Content />
          <DataTableBO.Pagination />
        </DataTableBO.Root>
      ) : (
        <DataTableBO.Root data={DUMMY_BATCH_DATA} columns={batchColumns}>
          <DataTableBO.Content />
          <DataTableBO.Pagination />
        </DataTableBO.Root>
      )}
    </div>
  );
};

export default FinishedTable;
