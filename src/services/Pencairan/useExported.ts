import useSWR from "swr";

import { fetcherMPPInter } from "@/lib/axios";

const USE_MOCK = true;

// --- Types ---

export interface ExportedListFilter {
  search?: string;
  idExport?: string;
  bankPenerima?: string[];
  bankPengirim?: string[];
  nominalMin?: number;
  nominalMax?: number;
  tanggalExportStart?: string;
  tanggalExportEnd?: string;
  namaUser?: string;
  statusSelesai?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface ExportedListItem {
  id: string;
  id_export: string;
  tanggal_export: string;
  status_selesai: "Selesai" | "Proses";
  nominal_pencairan: number;
  bank: string;
  jumlah_rekening: number;
  bank_pengirim: string;
  nama_user_export: string;
}

export interface ExportedListResponse {
  Data: ExportedListItem[];
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
}

// --- Mock Data ---

const MOCK_LIST_DATA: ExportedListItem[] = [
  {
    id: "1",
    id_export: "EXP/2026/001",
    tanggal_export: "10/01/2026 10.00",
    status_selesai: "Selesai",
    nominal_pencairan: 10000000,
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
    nominal_pencairan: 25500000,
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
    nominal_pencairan: 5000000,
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
    nominal_pencairan: 15750000,
    bank: "SMBC",
    jumlah_rekening: 12,
    bank_pengirim: "SMBC",
    nama_user_export: "Admin User",
  },
  {
    id: "5",
    id_export: "EXP/2026/005",
    tanggal_export: "06/01/2026 08.30",
    status_selesai: "Proses",
    nominal_pencairan: 8200000,
    bank: "BCA",
    jumlah_rekening: 18,
    bank_pengirim: "BCA",
    nama_user_export: "Charlie Brown",
  },
  {
    id: "6",
    id_export: "EXP/2026/006",
    tanggal_export: "05/01/2026 13.20",
    status_selesai: "Selesai",
    nominal_pencairan: 12500000,
    bank: "BNI",
    jumlah_rekening: 20,
    bank_pengirim: "BNI",
    nama_user_export: "David Miller",
  },
  {
    id: "7",
    id_export: "EXP/2026/007",
    tanggal_export: "04/01/2026 10.45",
    status_selesai: "Proses",
    nominal_pencairan: 6800000,
    bank: "Mandiri",
    jumlah_rekening: 14,
    bank_pengirim: "Mandiri",
    nama_user_export: "Eva Garcia",
  },
  {
    id: "8",
    id_export: "EXP/2026/008",
    tanggal_export: "03/01/2026 15.00",
    status_selesai: "Selesai",
    nominal_pencairan: 18900000,
    bank: "BRI",
    jumlah_rekening: 25,
    bank_pengirim: "BRI",
    nama_user_export: "Frank Martinez",
  },
  {
    id: "9",
    id_export: "EXP/2026/009",
    tanggal_export: "02/01/2026 09.35",
    status_selesai: "Proses",
    nominal_pencairan: 9500000,
    bank: "BCA",
    jumlah_rekening: 17,
    bank_pengirim: "BCA",
    nama_user_export: "Grace Lee",
  },
  {
    id: "10",
    id_export: "EXP/2026/010",
    tanggal_export: "01/01/2026 12.10",
    status_selesai: "Selesai",
    nominal_pencairan: 22000000,
    bank: "SMBC",
    jumlah_rekening: 30,
    bank_pengirim: "SMBC",
    nama_user_export: "Henry Wilson",
  },
  {
    id: "11",
    id_export: "EXP/2025/091",
    tanggal_export: "31/12/2025 14.25",
    status_selesai: "Selesai",
    nominal_pencairan: 7300000,
    bank: "BNI",
    jumlah_rekening: 11,
    bank_pengirim: "BNI",
    nama_user_export: "Ivy Anderson",
  },
  {
    id: "12",
    id_export: "EXP/2025/090",
    tanggal_export: "30/12/2025 11.50",
    status_selesai: "Proses",
    nominal_pencairan: 14700000,
    bank: "Mandiri",
    jumlah_rekening: 22,
    bank_pengirim: "Mandiri",
    nama_user_export: "Jack Taylor",
  },
  {
    id: "13",
    id_export: "EXP/2025/089",
    tanggal_export: "29/12/2025 08.15",
    status_selesai: "Selesai",
    nominal_pencairan: 11200000,
    bank: "BCA",
    jumlah_rekening: 19,
    bank_pengirim: "BCA",
    nama_user_export: "Kate Moore",
  },
  {
    id: "14",
    id_export: "EXP/2025/088",
    tanggal_export: "28/12/2025 10.40",
    status_selesai: "Selesai",
    nominal_pencairan: 16500000,
    bank: "BRI",
    jumlah_rekening: 24,
    bank_pengirim: "BRI",
    nama_user_export: "Leo Thomas",
  },
  {
    id: "15",
    id_export: "EXP/2025/087",
    tanggal_export: "27/12/2025 13.55",
    status_selesai: "Proses",
    nominal_pencairan: 13400000,
    bank: "SMBC",
    jumlah_rekening: 21,
    bank_pengirim: "SMBC",
    nama_user_export: "Mia Jackson",
  },
];

// --- Services ---

export const getExportedList = async (
  params?: ExportedListFilter
): Promise<ExportedListResponse> => {
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
        currentPage: page,
        totalPages: Math.ceil(MOCK_LIST_DATA.length / limit),
        totalItems: MOCK_LIST_DATA.length,
        itemsPerPage: limit,
        hasNextPage: endIndex < MOCK_LIST_DATA.length,
        hasPrevPage: page > 1,
        nextPage: endIndex < MOCK_LIST_DATA.length ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };
  }

  const response = await fetcherMPPInter.get("/v1/bo/pencairan/exported", {
    params,
  });
  return response.data;
};

// --- Hooks ---

export const useExportedList = (params?: ExportedListFilter) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["/v1/bo/pencairan/exported", params],
    () => getExportedList(params)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
