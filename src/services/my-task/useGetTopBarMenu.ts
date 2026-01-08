"use client";

import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";

const USE_MOCK = false;

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type TopBarMenu = {
  id: string;
  name: string;
  count: number;
};

export type GetTopBarMenuResponseData = {
  moduleId: string;
  menus: TopBarMenu[];
};

export type GetTopBarMenuParams = {
  moduleId: string;
  statusFilter?: "new" | "in_progress";
};

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const mockData: GetTopBarMenuResponseData = {
  moduleId: "mod-001",
  menus: [
    {
      id: "menu-001",
      name: "Pembayaran Vendor",
      count: 5,
    },
    {
      id: "menu-002",
      name: "Reimbursement",
      count: 3,
    },
    {
      id: "menu-003",
      name: "Petty Cash",
      count: 0,
    },
  ],
};

// ----------------------------------------------------------------------
// Fetcher
// ----------------------------------------------------------------------

export const getTopBarMenu = async (
  params: GetTopBarMenuParams
): Promise<GetTopBarMenuResponseData> => {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simple mock logic to reflect the requested moduleId
    return {
      ...mockData,
      moduleId: params.moduleId,
    };
  }

  const response = await fetcherBO.get("/v1/mytask/approval/topbar/menus", {
    params: {
      moduleId: params.moduleId,
      statusFilter: params.statusFilter || "new",
    },
  });

  return response.data?.Data;
};

// ----------------------------------------------------------------------
// Hook
// ----------------------------------------------------------------------

export const useGetTopBarMenu = (params: GetTopBarMenuParams) => {
  // Only fetch if moduleId is provided
  const key = params?.moduleId
    ? `topbar-menus-${JSON.stringify(params)}`
    : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => getTopBarMenu(params),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
