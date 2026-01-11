import { useMemo, useState } from "react";

import { Checkbox } from "@muatmuat/ui/Form";
import { DataTableBO } from "@muatmuat/ui/Table";
import { ColumnDef } from "@tanstack/react-table";

import { ActionDropdown } from "@/components/Dropdown/ActionDropdown";

import UbahBiayaAdminModal from "./UbahBiayaAdminModal";

interface ExportedData {
  id: string;
  id_export: string;
  tanggal_export: string;
  status_selesai: string;
  nominal_pencairan: string;
  bank: string;
  jumlah_rekening: number;
  bank_pengirim: string;
  nama_user_export: string;
}

const DUMMY_DATA: ExportedData[] = [
  {
    id: "1",
    id_export: "EXP/2026/001",
    tanggal_export: "10/01/2026 10.00",
    status_selesai: "Selesai",
    nominal_pencairan: "Rp 10.000.000",
    bank: "BCA",
    jumlah_rekening: 15,
    bank_pengirim: "BCA",
    nama_user_export: "Admin User",
  },
  {
    id: "2",
    id_export: "EXP/2026/002",
    tanggal_export: "09/01/2026 14.30",
    status_selesai: "Proses",
    nominal_pencairan: "Rp 25.500.000",
    bank: "Mandiri",
    jumlah_rekening: 23,
    bank_pengirim: "Mandiri",
    nama_user_export: "John Doe",
  },
  {
    id: "3",
    id_export: "EXP/2026/003",
    tanggal_export: "08/01/2026 09.15",
    status_selesai: "Selesai",
    nominal_pencairan: "Rp 5.000.000",
    bank: "BRI",
    jumlah_rekening: 8,
    bank_pengirim: "BRI",
    nama_user_export: "Jane Smith",
  },
  {
    id: "4",
    id_export: "EXP/2026/004",
    tanggal_export: "07/01/2026 11.45",
    status_selesai: "Selesai",
    nominal_pencairan: "Rp 15.750.000",
    bank: "SMBC",
    jumlah_rekening: 12,
    bank_pengirim: "SMBC",
    nama_user_export: "Admin User",
  },
];

interface ExportedTableProps {
  bulkAction?: string | null;
  onSelectionChange?: (count: number) => void;
}

const ExportedTable = ({
  bulkAction,
  onSelectionChange,
}: ExportedTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(DUMMY_DATA.map((item) => item.id));
      setSelectedRows(allIds);
      onSelectionChange?.(allIds.size);
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.(0);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
    onSelectionChange?.(newSelected.size);
  };
  const columns: ColumnDef<ExportedData>[] = useMemo(
    () => [
      {
        accessorKey: "actions",
        enableSorting: false,
        size: bulkAction ? 50 : 100,
        header: () =>
          bulkAction ? (
            <Checkbox
              checked={
                selectedRows.size === DUMMY_DATA.length && DUMMY_DATA.length > 0
              }
              onCheckedChange={(checked) => handleSelectAll(checked === true)}
              className="h-4 w-4 cursor-pointer"
            />
          ) : (
            "Action"
          ),
        cell: ({ row }) => {
          if (bulkAction) {
            return (
              <Checkbox
                checked={selectedRows.has(row.original.id)}
                onCheckedChange={(checked) =>
                  handleSelectRow(row.original.id, checked === true)
                }
                className="h-4 w-4 cursor-pointer"
              />
            );
          }
          return (
            <ActionDropdown.Root>
              <ActionDropdown.Trigger />
              <ActionDropdown.Content>
                <ActionDropdown.Item
                  onClick={() => console.log("Detail clicked", row.original.id)}
                >
                  Detail
                </ActionDropdown.Item>
                <ActionDropdown.Item
                  onClick={() =>
                    console.log("Export Ulang clicked", row.original.id)
                  }
                >
                  Export Ulang
                </ActionDropdown.Item>
                <ActionDropdown.Item
                  onClick={() => {
                    setSelectedId(row.original.id);
                    setIsModalOpen(true);
                  }}
                >
                  Ubah Biaya Admin
                </ActionDropdown.Item>
                <ActionDropdown.Item
                  onClick={() =>
                    console.log("Selesaikan clicked", row.original.id)
                  }
                >
                  Selesaikan
                </ActionDropdown.Item>
                <ActionDropdown.Item
                  onClick={() =>
                    console.log("Gagalkan clicked", row.original.id)
                  }
                >
                  Gagalkan
                </ActionDropdown.Item>
                <ActionDropdown.Item
                  onClick={() =>
                    console.log("Batalkan clicked", row.original.id)
                  }
                >
                  Batalkan
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
      ...(bulkAction
        ? []
        : [
            {
              accessorKey: "status_selesai",
              header: "Status Selesai",
              cell: ({ row }) => {
                const status = row.original.status_selesai;
                return <span>{status}</span>;
              },
            },
          ]),
      {
        accessorKey: "nominal_pencairan",
        header: "Nominal Pencairan",
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
      {
        accessorKey: "nama_user_export",
        header: "Nama User Export",
      },
      ...(bulkAction
        ? [
            {
              accessorKey: "status_sukses",
              header: "Status Sukses",
              cell: ({ row }) => <span>{row.original.status_sukses}</span>,
            },
          ]
        : []),
    ],
    [bulkAction, selectedRows]
  );

  return (
    <>
      <DataTableBO.Root data={DUMMY_DATA} columns={columns}>
        <DataTableBO.Content />
        <DataTableBO.Pagination />
      </DataTableBO.Root>
      <UbahBiayaAdminModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSave={(val) => {
          console.log("Saved new admin fee for", selectedId, ":", val);
          // Implement save logic here
        }}
      />
    </>
  );
};

export default ExportedTable;
