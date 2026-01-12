"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { cn } from "@muatmuat/lib/utils";
import { Button } from "@muatmuat/ui/Button";
import { Checkbox, Input } from "@muatmuat/ui/Form";
import { ConfirmationModal } from "@muatmuat/ui/Modal";
import { DataTableBO } from "@muatmuat/ui/Table";
import { ColumnDef } from "@tanstack/react-table";

import { ActionDropdown } from "@/components/Dropdown/ActionDropdown";
import PageTitle from "@/components/PageTitle/PageTitle";

import AturMassalModal from "@/container/Pencairan/components/Exported/AturMassalModal";
import UbahBiayaAdminModal from "@/container/Pencairan/components/Exported/UbahBiayaAdminModal";

// Define field types for both views
interface DetailField {
  label: string;
  value: string;
  isLink?: boolean;
  color?: "blue" | "green" | "black";
}

// Batch table data structure
interface BatchTableData {
  id: string;
  trx_id: string;
  rekening_penerima: string;
  nama_penerima: string;
  nominal_pencairan: string;
  biaya_admin: string;
  status_settlement: string;
}

// Dummy data for batch table
const BATCH_TABLE_DATA: BatchTableData[] = [
  {
    id: "1",
    trx_id: "TRX/2026/001",
    rekening_penerima: "1234567890",
    nama_penerima: "John Doe",
    nominal_pencairan: "Rp 2.000.000",
    biaya_admin: "Rp 5.000",
    status_settlement: "Not Settled",
  },
  {
    id: "2",
    trx_id: "TRX/2026/002",
    rekening_penerima: "0987654321",
    nama_penerima: "Jane Smith",
    nominal_pencairan: "Rp 3.000.000",
    biaya_admin: "Rp 5.000",
    status_settlement: "Sukses",
  },
  {
    id: "3",
    trx_id: "TRX/2026/003",
    rekening_penerima: "1122334455",
    nama_penerima: "Bob Wilson",
    nominal_pencairan: "Rp 5.000.000",
    biaya_admin: "Rp 5.000",
    status_settlement: "Gagal",
  },
  {
    id: "4",
    trx_id: "TRX/2026/004",
    rekening_penerima: "5566778899",
    nama_penerima: "Alice Brown",
    nominal_pencairan: "Rp 2.500.000",
    biaya_admin: "Rp 5.000",
    status_settlement: "Not Settled",
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
    { label: "divider", value: "" }, // This will be a divider
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

// Batch View dummy data
const BATCH_DUMMY_DATA: Record<string, DetailField[]> = {
  "EXP/2026/001": [
    { label: "ID Export", value: "EXP/2026/001" },
    { label: "Tanggal Export", value: "10/01/2026 10.00" },
    { label: "Bank Pengirim", value: "BCA" },
    { label: "Nominal Pencairan", value: "Rp 10.000.000" },
  ],
};

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

interface DetailContainerProps {
  id: string;
}

const DetailContainer = ({ id }: DetailContainerProps) => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "trx";

  const decodedId = decodeURIComponent(id);

  // Bulk action state
  const [bulkAction, setBulkAction] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showAturMassalModal, setShowAturMassalModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showUbahBiayaModal, setShowUbahBiayaModal] = useState(false);

  // Get data based on type
  let fields: DetailField[];

  switch (type) {
    case "batch":
      fields = BATCH_DUMMY_DATA[decodedId] || BATCH_DUMMY_DATA["EXP/2026/001"];
      break;
    case "invoice":
      fields =
        INVOICE_DUMMY_DATA[decodedId] || INVOICE_DUMMY_DATA["INV/2026/001"];
      break;
    default: // trx
      fields = TRX_DUMMY_DATA[decodedId] || TRX_DUMMY_DATA["TRX/2026/001"];
  }

  // Handle bulk action selection from modal
  const handleBulkActionSelect = (action: string | null) => {
    setBulkAction(action);
    setSelectedRows(new Set());
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(BATCH_TABLE_DATA.map((item) => item.id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  // Handle individual row selection
  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  // Handle bulk action button click
  const handleBulkActionClick = () => {
    if (bulkAction === "ubah_biaya_admin") {
      setShowUbahBiayaModal(true);
    } else if (bulkAction) {
      setShowConfirmation(true);
    }
  };

  // Handle save bulk biaya admin
  const handleSaveBulkBiaya = (amount: number) => {
    console.log(
      `Updating bulk admin fee to: ${amount} for ${selectedRows.size} items`
    );
    setShowUbahBiayaModal(false);
    setBulkAction(null);
    setSelectedRows(new Set());
  };

  // Handle confirm action
  const handleConfirmAction = () => {
    console.log(
      `Executing bulk action: ${bulkAction} for ${selectedRows.size} items`
    );
    setShowConfirmation(false);
    setBulkAction(null);
    setSelectedRows(new Set());
  };

  // Get confirmation message
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

  // Batch table columns
  const batchTableColumns: ColumnDef<BatchTableData>[] = useMemo(
    () => [
      {
        accessorKey: "actions",
        enableSorting: false,
        size: bulkAction ? 50 : 100,
        header: () =>
          bulkAction ? (
            <Checkbox
              checked={
                selectedRows.size === BATCH_TABLE_DATA.length &&
                BATCH_TABLE_DATA.length > 0
              }
              onCheckedChange={(checked) => handleSelectAll(checked === true)}
              className="h-4 w-4 cursor-pointer"
            />
          ) : (
            "Actions"
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
          const isNotSettled = row.original.status_settlement === "Not Settled";
          return (
            <ActionDropdown.Root>
              <ActionDropdown.Trigger />
              <ActionDropdown.Content>
                <ActionDropdown.Item
                  onClick={() =>
                    console.log("Detail clicked", row.original.trx_id)
                  }
                >
                  Detail
                </ActionDropdown.Item>
                {isNotSettled && (
                  <>
                    <ActionDropdown.Item
                      onClick={() =>
                        console.log(
                          "Ubah Biaya Admin clicked",
                          row.original.trx_id
                        )
                      }
                    >
                      Ubah Biaya Admin
                    </ActionDropdown.Item>
                    <ActionDropdown.Item
                      onClick={() =>
                        console.log("Selesaikan clicked", row.original.trx_id)
                      }
                    >
                      Selesaikan
                    </ActionDropdown.Item>
                    <ActionDropdown.Item
                      onClick={() =>
                        console.log("Gagalkan clicked", row.original.trx_id)
                      }
                    >
                      Gagalkan
                    </ActionDropdown.Item>
                  </>
                )}
              </ActionDropdown.Content>
            </ActionDropdown.Root>
          );
        },
      },
      {
        accessorKey: "trx_id",
        header: "TRX ID",
      },
      {
        accessorKey: "rekening_penerima",
        header: "Rekening Penerima",
      },
      {
        accessorKey: "nama_penerima",
        header: "Nama Penerima",
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
        accessorKey: "status_settlement",
        header: "Status Settlement",
        cell: ({ row }) => {
          const status = row.original.status_settlement;
          const isSuccess = status === "Sukses";
          return (
            <span
              className={cn(
                "font-semibold",
                isSuccess ? "text-[#3ECD00]" : "text-[#FF0000]"
              )}
            >
              {status}
            </span>
          );
        },
      },
    ],
    [bulkAction, selectedRows]
  );

  const getTextColorClass = (field: DetailField) => {
    if (field.isLink) return "text-[#176CF7] underline";
    if (field.color === "green") return "text-[#3ECD00] font-bold";
    if (field.color === "blue") return "text-[#176CF7]";
    return "text-[#1B1B1B]";
  };

  return (
    <div className="flex flex-col items-start gap-[10px]">
      <PageTitle className="!mb-0 text-2xl text-primary-700">
        {type === "batch"
          ? "Detail Batch"
          : type === "trx"
            ? "Detail Pencairan"
            : "Detail Invoice"}
      </PageTitle>

      {/* Fields */}
      <div className="flex w-full flex-col gap-[10px]">
        {fields.map((field, index) => {
          // Handle divider
          if (field.label === "divider") {
            return (
              <div
                key={index}
                className="my-[10px] h-[1px] w-full border-t border-[#C6CBD4]"
              />
            );
          }

          return (
            <div
              key={index}
              className="flex flex-row items-center gap-[21px] px-[10px] py-0 pl-[32px]"
            >
              <span className="w-[230px] min-w-[230px] text-[14px] font-semibold leading-[140%] text-[#868686]">
                {field.label}
              </span>
              <Input
                disabled
                value={field.value}
                className={cn("h-[32px] flex-1", getTextColorClass(field))}
                appearance={{
                  containerClassName:
                    "h-[32px] rounded-[6px] bg-[#D7D7D7] border-[#A8A8A8]",
                  inputClassName: cn(
                    "text-xs font-medium",
                    getTextColorClass(field)
                  ),
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Batch Summary Section */}
      {type === "batch" && (
        <>
          <div className="flex w-full flex-col items-start justify-center gap-[8px] py-[15px] pl-[30px]">
            <span className="text-[16px] font-semibold leading-[19px] text-[#000000]">
              Total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Rp59.150.000
            </span>
            <span className="text-[16px] font-semibold leading-[19px] text-[#000000]">
              Finished : 25/32 &nbsp;|&nbsp; Rp.40.500.000
            </span>
            <div className="relative flex w-full flex-row items-center gap-[10px]">
              <span className="text-[16px] font-semibold leading-[19px] text-[#000000]">
                Gagal&nbsp;&nbsp;&nbsp;&nbsp;: 7/32 &nbsp;&nbsp;|&nbsp;
                Rp.10.500.000
              </span>
              <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-row items-center gap-[15px]">
                {bulkAction && (
                  <Button
                    onClick={() => {
                      setBulkAction(null);
                      setSelectedRows(new Set());
                    }}
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
                    bulkAction
                      ? handleBulkActionClick()
                      : setShowAturMassalModal(true)
                  }
                  disabled={bulkAction !== null && selectedRows.size === 0}
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
                  onClick={() => console.log("Filter clicked")}
                >
                  Filter
                </Button>
              </div>
            </div>
          </div>

          {/* Batch Data Table */}
          <div className="w-full">
            <DataTableBO.Root
              data={BATCH_TABLE_DATA}
              columns={batchTableColumns}
            >
              <DataTableBO.Content />
              <DataTableBO.Pagination />
            </DataTableBO.Root>
          </div>
        </>
      )}

      {/* Atur Massal Modal */}
      <AturMassalModal
        isOpen={showAturMassalModal}
        setIsOpen={setShowAturMassalModal}
        onSave={handleBulkActionSelect}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        setIsOpen={setShowConfirmation}
        variant="bo"
        title={{ text: "Pemberitahuan" }}
        description={{ text: getConfirmationMessage() }}
        confirm={{ text: "Ya", onClick: handleConfirmAction }}
        cancel={{ text: "Tidak" }}
      />

      {/* Ubah Biaya Admin Modal */}
      <UbahBiayaAdminModal
        isOpen={showUbahBiayaModal}
        setIsOpen={setShowUbahBiayaModal}
        onSave={handleSaveBulkBiaya}
        title="Ubah Massal Biaya Admin"
      />
    </div>
  );
};

export default DetailContainer;
