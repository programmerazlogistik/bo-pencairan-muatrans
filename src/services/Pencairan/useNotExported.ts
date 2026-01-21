import useSWR from "swr";

import { fetcherMPPInter } from "@/lib/axios";

const USE_MOCK = true;

// --- Types ---

export interface NotExportedListFilter {
  search?: string;
  rekeningTujuan?: string;
  namaRekening?: string;
  nominalMin?: number;
  nominalMax?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  banks?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface NotExportedListItem {
  id: string;
  tanggal_settlement: string;
  no_invoice: string;
  nominal: string;
  rekening_tujuan: string;
  nama_rekening: string;
  jenis: "Pencairan Transporter" | "Refund";
  status: "Baru" | "Retransfer";
}

export interface NotExportedHistoryItem {
  tanggal: string;
  trxId: string;
  nominal: string;
  rekening: string;
  namaRekening: string;
  status: "Baru" | "Retransfer";
}

export interface NotExportedSummary {
  all: number;
  new: number;
  retransfer: number;
  banks: { label: string; count: number }[];
  totalValue: number;
}

export interface NotExportedListResponse {
  Data: NotExportedListItem[];
  Message: { Code: number; Text: string };
  Pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  Summary: NotExportedSummary;
}

export interface ExportDisbursementRequest {
  bank_pengirim_id: string;
  selected_ids: string[];
  admin_fees: {
    bank: string;
    fee: number;
  }[];
}

export interface ExportDisbursementResponse {
  Message: { Code: number; Text: string };
  Data: {
    export_id: string;
    total_items: number;
    total_nominal: number;
    created_at: string;
  };
}

// --- Mock Data ---

const MOCK_LIST_DATA: NotExportedListItem[] = [
  {
    id: "1",
    tanggal_settlement: "10/01/2026 10.00",
    no_invoice: "INV/2026/001",
    nominal: "Rp 1.000.000",
    rekening_tujuan: "BCA",
    nama_rekening: "John Doe",
    jenis: "Pencairan Transporter",
    status: "Baru",
  },
  {
    id: "2",
    tanggal_settlement: "11/01/2026 14.30",
    no_invoice: "INV/2026/002",
    nominal: "Rp 2.500.000",
    rekening_tujuan: "Mandiri",
    nama_rekening: "Jane Smith",
    jenis: "Refund",
    status: "Baru",
  },
  {
    id: "3",
    tanggal_settlement: "12/01/2026 09.15",
    no_invoice: "INV/2026/003",
    nominal: "Rp 500.000",
    rekening_tujuan: "BRI",
    nama_rekening: "Bob Johnson",
    jenis: "Pencairan Transporter",
    status: "Retransfer",
  },
];

const MOCK_HISTORY_DATA: NotExportedHistoryItem[] = [
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

// --- Services ---

export const getNotExportedList = async (
  params?: NotExportedListFilter
): Promise<NotExportedListResponse> => {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = MOCK_LIST_DATA.slice(startIndex, endIndex);

    return {
      Data: paginatedData,
      Message: { Code: 200, Text: "Success" },
      Pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 3,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: 2,
        prevPage: null,
      },

      Summary: {
        all: 1,
        new: 1,
        retransfer: 3,
        banks: [
          { label: "BCA", count: 3 },
          { label: "BRI", count: 2 },
        ],
        totalValue: 30000000,
      },
    };
  }

  const response = await fetcherMPPInter.get("/v1/bo/pencairan/not-exported", {
    params,
  });
  return response.data;
};

export const getNotExportedHistory = async (
  id: string
): Promise<{ Data: NotExportedHistoryItem[] }> => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      Data: MOCK_HISTORY_DATA,
    };
  }

  const response = await fetcherMPPInter.get(
    `/v1/bo/pencairan/not-exported/${id}/history`
  );
  return response.data;
};

export const exportDisbursement = async (
  request: ExportDisbursementRequest
): Promise<ExportDisbursementResponse> => {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful response
    return {
      Message: { Code: 200, Text: "Export berhasil" },
      Data: {
        export_id: `EXP/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
        total_items: request.selected_ids.length,
        total_nominal: request.selected_ids.length * 1000000, // Mock calculation
        created_at: new Date().toISOString(),
      },
    };
  }

  const response = await fetcherMPPInter.post(
    "/v1/bo/pencairan/export",
    request
  );
  return response.data;
};

// --- Hooks ---

export const useNotExportedList = (params?: NotExportedListFilter) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["/v1/bo/pencairan/not-exported", params],
    () => getNotExportedList(params)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export const useNotExportedHistory = (id: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? [`/v1/bo/pencairan/not-exported/${id}/history`, id] : null,
    () => (id ? getNotExportedHistory(id) : null)
  );

  return {
    data: data?.Data,
    error,
    isLoading,
    mutate,
  };
};
