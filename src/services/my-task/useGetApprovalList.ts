"use client";

import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";

const USE_MOCK = false;

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type ApprovalColumn = {
  label: string;
  accessorKey: string;
  sortable: boolean;
  format: string | null;
};

export type ApprovalItemData = {
  [key: string]: any; // Allow dynamic fields based on queryList config
};

export type ApprovalItem = {
  id: string;
  taskId: string;
  name: string;
  status: string;
  createdAt: string;
  moduleName: string;
  menuName: string;
  currentApprover: string;
  data: ApprovalItemData;
};

export type PaginationMeta = {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type GetApprovalListResponseData = {
  columns: ApprovalColumn[];
  items: ApprovalItem[];
  pagination: PaginationMeta;
};

export type GetApprovalListParams = {
  page?: number;
  limit?: number;
  moduleId?: string;
  menuId?: string;
  statusFilter?: "new" | "in_progress";
  sortBy?: "newest" | "oldest" | "name_asc" | "name_desc";
};

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const mockColumns: ApprovalColumn[] = [
  { accessorKey: "id", label: "ID", sortable: true, format: null },
  { accessorKey: "name", label: "Nama", sortable: true, format: null },
  { accessorKey: "amount", label: "Jumlah", sortable: true, format: null },
  {
    accessorKey: "created_at",
    label: "Tanggal",
    sortable: true,
    format: "datetime",
  },
];

const mockItems: ApprovalItem[] = [
  {
    id: "req-001",
    taskId: "payment-001",
    name: "Payment Request #001",
    status: "PENDING",
    createdAt: "24/12/25 10.30 WIB",
    moduleName: "Finance",
    menuName: "Pembayaran Vendor",
    currentApprover: "Manager Finance",
    data: {
      id: "payment-001",
      name: "Vendor ABC",
      amount: 15000000,
      created_at: "2025-12-20",
    },
  },
  {
    id: "req-002",
    taskId: "payment-002",
    name: "Payment Request #002",
    status: "PENDING",
    createdAt: "23/12/25 14.15 WIB",
    moduleName: "Finance",
    menuName: "Reimbursement",
    currentApprover: "Manager Finance",
    data: {
      id: "payment-002",
      name: "Perjalanan Dinas",
      amount: 750000,
      created_at: "2025-12-22",
    },
  },
  {
    id: "req-003",
    taskId: "hr-001",
    name: "Leave Request #99",
    status: "PENDING",
    createdAt: "22/12/25 09.00 WIB",
    moduleName: "Human Resources",
    menuName: "Cuti",
    currentApprover: "HR Manager",
    data: {
      id: "cuti-001",
      name: "Cuti Tahunan",
      created_at: "2025-12-21",
    },
  },
];

// ----------------------------------------------------------------------
// Client-side Mock Helpers
// ----------------------------------------------------------------------

const filterData = (
  items: ApprovalItem[],
  params: GetApprovalListParams
): ApprovalItem[] => {
  let filtered = [...items];

  if (params.moduleId) {
    // In a real app, items would likely have a moduleId field.
    // For mock purposes, we'll assume moduleName maps loosely or return all if not found.
    // This is just a simulation.
    filtered = filtered.filter((item) => item.moduleName.includes("Finance"));
  }

  if (params.menuId) {
    // similar logic for menuId
    filtered = filtered.filter((item) => item.menuName);
  }

  // Note: statusFilter logic would go here if the mock data had diverse statuses

  return filtered;
};

const sortData = (
  items: ApprovalItem[],
  sortBy: GetApprovalListParams["sortBy"]
): ApprovalItem[] => {
  if (!sortBy) return items;

  return [...items].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        // simple string compare for mock, real app would parse dates
        return b.createdAt.localeCompare(a.createdAt);
      case "oldest":
        return a.createdAt.localeCompare(b.createdAt);
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
};

// ----------------------------------------------------------------------
// Fetcher
// ----------------------------------------------------------------------

export const getApprovalList = async (
  params: GetApprovalListParams = {}
): Promise<GetApprovalListResponseData> => {
  const { page = 1, limit = 10, statusFilter = "new" } = params;

  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay

    let processedItems = filterData(mockItems, params);
    processedItems = sortData(processedItems, params.sortBy);

    const totalItems = processedItems.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = processedItems.slice(startIndex, endIndex);

    return {
      columns: mockColumns,
      items: paginatedItems,
      pagination: {
        currentPage: page,
        perPage: limit,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  const response = await fetcherBO.get("/v1/mytask/approval", {
    params: {
      page,
      limit,
      moduleId: params.moduleId,
      menuId: params.menuId,
      statusFilter,
      sortBy: params.sortBy || "newest",
    },
  });

  return response.data?.Data;
};

// ----------------------------------------------------------------------
// Hook
// ----------------------------------------------------------------------

export const useGetApprovalList = (params: GetApprovalListParams = {}) => {
  // Ensure default values are part of the key stability
  const safeParams: GetApprovalListParams = {
    page: 1,
    limit: 10,
    statusFilter: "new",
    sortBy: "newest",
    ...params,
  };

  const key = `approval-list-${JSON.stringify(safeParams)}`;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => getApprovalList(safeParams),
    {
      revalidateOnFocus: false,
      keepPreviousData: true, // UX: Keep old list visible while loading new page/sort
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
