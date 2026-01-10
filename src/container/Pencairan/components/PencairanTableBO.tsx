import { useMemo, useState } from "react";

import { Button } from "@muatmuat/ui/Button";
import { Modal, ModalContent, ModalTitle } from "@muatmuat/ui/Modal";
import { DataTableBO } from "@muatmuat/ui/Table";
import { ColumnDef } from "@tanstack/react-table";

interface PencairanData {
  id: string;
  tanggal_settlement: string;
  no_invoice: string;
  nominal: string;
  rekening_tujuan: string;
  nama_rekening: string;
  jenis: string;
  status: string;
}

interface HistoryData {
  tanggal: string;
  trxId: string;
  nominal: string;
  rekening: string;
  namaRekening: string;
  status: string;
}

interface PencairanTableBOProps {
  showExport: boolean;
}

const DUMMY_DATA: PencairanData[] = [
  {
    id: "1",
    tanggal_settlement: "10/01/2026 10.00",
    no_invoice: "INV/2026/001",
    nominal: "Rp 1.000.000",
    rekening_tujuan: "BCA",
    nama_rekening: "John Doe",
    jenis: "Transfer",
    status: "Berhasil",
  },
  {
    id: "2",
    tanggal_settlement: "11/01/2026 14.30",
    no_invoice: "INV/2026/002",
    nominal: "Rp 2.500.000",
    rekening_tujuan: "Mandiri",
    nama_rekening: "Jane Smith",
    jenis: "Transfer",
    status: "Pending",
  },
  {
    id: "3",
    tanggal_settlement: "12/01/2026 09.15",
    no_invoice: "INV/2026/003",
    nominal: "Rp 500.000",
    rekening_tujuan: "BRI",
    nama_rekening: "Bob Johnson",
    jenis: "Transfer",
    status: "Retransfer",
  },
];

const DUMMY_HISTORY: HistoryData[] = [
  {
    tanggal: "28/01/2024 10.00",
    trxId: "TRX/02/25/25",
    nominal: "Rp1.500.000",
    rekening: "BCA - 00012412421",
    namaRekening: "Mulyo",
    status: "Retransfer",
  },
  {
    tanggal: "28/01/2024 10.00",
    trxId: "TRX/02/25/25",
    nominal: "Rp1.500.000",
    rekening: "Mandiri - 244567189912",
    namaRekening: "Mulyo",
    status: "Retransfer",
  },
  {
    tanggal: "28/01/2024 10.00",
    trxId: "TRX/02/25/25",
    nominal: "Rp1.500.000",
    rekening: "BRI - 000124129424",
    namaRekening: "Mulyo",
    status: "Retransfer",
  },
  {
    tanggal: "28/01/2024 10.00",
    trxId: "TRX/02/25/25",
    nominal: "Rp1.500.000",
    rekening: "BNI - 123418481294",
    namaRekening: "Mulyo",
    status: "Retransfer",
  },
  {
    tanggal: "-",
    trxId: "-",
    nominal: "Rp1.500.000",
    rekening: "BCA - 1249921401204",
    namaRekening: "Mulyo",
    status: "Baru",
  },
];

const PencairanTableBO = ({ showExport }: PencairanTableBOProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showRetransferModal, setShowRetransferModal] = useState(false);
  const [retransferId, setRetransferId] = useState<string | null>(null);

  const allIds = DUMMY_DATA.map((item) => item.id);
  const isAllSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRetransferClick = (id: string) => {
    setRetransferId(id);
    setShowRetransferModal(true);
  };

  const columns: ColumnDef<PencairanData>[] = useMemo(
    () => [
      {
        accessorKey: "actions",
        enableSorting: false,
        size: showExport ? 50 : 100,
        header: () =>
          showExport ? (
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="h-4 w-4 cursor-pointer"
            />
          ) : (
            "Action"
          ),
        cell: ({ row }) =>
          showExport ? (
            <input
              type="checkbox"
              checked={selectedIds.includes(row.original.id)}
              onChange={() => handleSelectRow(row.original.id)}
              className="h-4 w-4 cursor-pointer"
            />
          ) : (
            <Button className="h-[28px] bg-[#3ECD00] px-3 text-xs font-semibold text-white hover:bg-[#36b300]">
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
        header: "No. Invoice",
      },
      {
        accessorKey: "nominal",
        header: "Nominal",
      },
      {
        accessorKey: "rekening_tujuan",
        header: "Rekening Tujuan",
      },
      {
        accessorKey: "nama_rekening",
        header: "Nama Rekening",
      },
      {
        accessorKey: "jenis",
        header: "Jenis",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          if (status === "Retransfer") {
            return (
              <span
                onClick={() => handleRetransferClick(row.original.id)}
                className="cursor-pointer font-semibold text-[#F22C25] hover:underline"
              >
                {status}
              </span>
            );
          }
          return (
            <span
              className={
                status === "Berhasil"
                  ? "text-[#3ECD00]"
                  : status === "Pending"
                    ? "text-[#FFB800]"
                    : "text-[#1B1B1B]"
              }
            >
              {status}
            </span>
          );
        },
      },
    ],
    [showExport, selectedIds, isAllSelected]
  );

  const historyColumns: ColumnDef<HistoryData>[] = useMemo(
    () => [
      {
        accessorKey: "tanggal",
        header: "Tanggal Pencairan",
        size: 135,
      },
      {
        accessorKey: "trxId",
        header: "TRX ID",
        size: 135,
      },
      {
        accessorKey: "nominal",
        header: "Nominal Pencairan",
        size: 125,
      },
      {
        accessorKey: "rekening",
        header: "Rekening Penerima",
        size: 176,
      },
      {
        accessorKey: "namaRekening",
        header: "Nama Rekening",
        size: 125,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 125,
        cell: ({ row }) => (
          <span
            className={`text-[12px] leading-[14px] ${
              row.original.status === "Retransfer"
                ? "font-semibold text-[#F22C25]"
                : "font-normal text-[#1B1B1B]"
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <>
      <DataTableBO.Root data={DUMMY_DATA} columns={columns}>
        <DataTableBO.Content />
        <DataTableBO.Pagination />
      </DataTableBO.Root>

      <Modal
        open={showRetransferModal}
        onOpenChange={setShowRetransferModal}
        withCloseButton={false}
      >
        <ModalContent className="w-[885px] max-w-none rounded-[12px] bg-white p-[24px]">
          <ModalTitle withClose className="mb-[24px]">
            History Pencairan
          </ModalTitle>
          <div className="mb-[10px] text-[14px] font-semibold leading-[17px] text-[#1B1B1B]">
            INV/0101/02/2025
          </div>
          <div className="h-fit w-full">
            <DataTableBO.Root data={DUMMY_HISTORY} columns={historyColumns}>
              <DataTableBO.Content />
            </DataTableBO.Root>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PencairanTableBO;
