import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Checkbox } from "@muatmuat/ui/Form";
import { DataTableBO } from "@muatmuat/ui/Table";

import {
  ExportedListFilter,
  useExportedList,
} from "@/services/Pencairan/useExported";

import { ActionDropdown } from "@/components/Dropdown/ActionDropdown";

import UbahBiayaAdminModal from "./UbahBiayaAdminModal";

interface ExportedTableProps {
  bulkAction?: string | null;
  onSelectionChange?: (count: number) => void;
  filters?: ExportedListFilter;
}

const ExportedTable = ({
  bulkAction,
  onSelectionChange,
  filters = {},
}: ExportedTableProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Fetch data using service hook
  const { data, isLoading } = useExportedList({
    ...filters,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const items = data?.Data || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(items.map((item) => item.id));
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
  const columns = useMemo(
    () => [
      {
        accessorKey: "actions",
        enableSorting: false,
        size: bulkAction ? 50 : 100,
        header: () =>
          bulkAction ? (
            <Checkbox
              checked={selectedRows.size === items.length && items.length > 0}
              onCheckedChange={(checked) => handleSelectAll(checked === true)}
              className="h-4 w-4 cursor-pointer"
            />
          ) : (
            "Action"
          ),
        cell: ({ row }: any) => {
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
                  onClick={() =>
                    router.push(
                      `/pencairan/detail/${encodeURIComponent(row.original.id_export)}?type=batch`
                    )
                  }
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
              cell: ({ row }: any) => {
                const status = row.original.status_selesai;
                return <span>{status}</span>;
              },
            },
          ]),
      {
        accessorKey: "nominal_pencairan",
        header: "Nominal Pencairan",
        cell: ({ row }: any) =>
          `Rp ${row.original.nominal_pencairan.toLocaleString("id-ID")}`,
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
              cell: ({ row }: any) => <span>{row.original.status_sukses}</span>,
            },
          ]
        : []),
    ],
    [bulkAction, selectedRows, items]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <DataTableBO.Root
        data={items}
        columns={columns}
        pagination={pagination}
        onPaginationChange={setPagination}
        paginationData={{
          currentPage: data?.Pagination?.currentPage || 1,
          itemsPerPage: data?.Pagination?.itemsPerPage || 10,
          totalItems: data?.Pagination?.totalItems || 0,
          totalPages: data?.Pagination?.totalPages || 1,
        }}
      >
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
