import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@muatmuat/ui/Button";
import { Checkbox } from "@muatmuat/ui/Form";
import { Modal, ModalContent, ModalTitle } from "@muatmuat/ui/Modal";
import { DataTableBO } from "@muatmuat/ui/Table";

import {
  NotExportedListItem,
  useNotExportedHistory,
} from "@/services/Pencairan/useNotExported";

import { useNotExportedStore } from "@/store/Pencairan/useNotExportedStore";

interface NotExportedTableProps {
  showExport: boolean;
  data: NotExportedListItem[];
  loading?: boolean;
  paginationData?: any;
}

const NotExportedTable = ({
  showExport,
  data,
  loading,
  paginationData,
}: NotExportedTableProps) => {
  const router = useRouter();
  const [showRetransferModal, setShowRetransferModal] = useState(false);
  const [retransferId, setRetransferId] = useState<string | null>(null);

  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
    selectedIds,
    setSelectedIds,
  } = useNotExportedStore();

  const { data: historyData } = useNotExportedHistory(
    showRetransferModal ? retransferId : null
  );

  const allIds = data.map((item) => item.id) || [];
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
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id]
    );
  };

  const handleRetransferClick = (id: string) => {
    setRetransferId(id);
    setShowRetransferModal(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "actions",
        enableSorting: false,
        size: showExport ? 50 : 100,
        header: () =>
          showExport ? (
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              className="h-4 w-4 cursor-pointer"
            />
          ) : (
            "Action"
          ),
        cell: ({ row }: any) =>
          showExport ? (
            <Checkbox
              checked={selectedIds.includes(row.original.id)}
              onCheckedChange={() => handleSelectRow(row.original.id)}
              className="h-4 w-4 cursor-pointer"
            />
          ) : (
            <Button
              className="h-[28px] bg-[#3ECD00] px-3 text-xs font-semibold text-white hover:bg-[#36b300]"
              onClick={() => {
                const encodedId = encodeURIComponent(row.original.no_invoice);
                router.push(`/pencairan/invoice/${encodedId}`);
              }}
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
      ...(showExport
        ? []
        : [
            {
              accessorKey: "jenis",
              header: "Jenis",
              size: 125,
              cell: ({ row }: any) => {
                const jenis = row.original.jenis;
                let textColor = "text-[#1B1B1B]";
                if (jenis === "Pencairan Transporter") {
                  textColor = "text-[#3ECD00]";
                } else if (jenis === "Refund") {
                  textColor = "text-[#FFB020]";
                }
                return (
                  <span className={`font-semibold ${textColor}`}>{jenis}</span>
                );
              },
            },
          ]),
      {
        accessorKey: "status",
        header: "Status",
        size: 125,
        cell: ({ row }: any) => {
          const status = row.original.status;
          if (status === "Retransfer") {
            return (
              <span
                onClick={() => handleRetransferClick(row.original.id)}
                className="cursor-pointer font-semibold text-[#F22C25] underline"
              >
                {status}
              </span>
            );
          }
          return <span className="text-[#1B1B1B]">{status}</span>;
        },
      },
    ],
    [showExport, selectedIds, isAllSelected]
  );

  const historyColumns = useMemo(
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
        cell: ({ row }: any) => (
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

  const tableData = useMemo(() => data || [], [data]);

  const defaultPaginationData = useMemo(
    () => ({
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null,
    }),
    []
  );

  return (
    <>
      <DataTableBO.Root
        data={tableData}
        columns={columns}
        pagination={pagination}
        onPaginationChange={setPagination}
        paginationData={paginationData || defaultPaginationData}
        sorting={sorting}
        onSortingChange={setSorting}
      >
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
            <DataTableBO.Root data={historyData || []} columns={historyColumns}>
              <DataTableBO.Content />
            </DataTableBO.Root>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NotExportedTable;
