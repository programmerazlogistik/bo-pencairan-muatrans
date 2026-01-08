"use client";

import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";

const USE_MOCK = false;

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type SidebarModule = {
  id: string;
  name: string;
  count: number;
};

export type SidebarTotal = {
  name: string;
  count: number;
};

export type GetSidebarModulesResponseData = {
  total: SidebarTotal;
  modules: SidebarModule[];
};

export type GetSidebarModulesParams = {
  statusFilter?: "new" | "in_progress";
};

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const mockData: GetSidebarModulesResponseData = {
  total: {
    name: "Semua Modul",
    count: 15,
  },
  modules: [
    {
      id: "mod-001",
      name: "Finance",
      count: 8,
    },
    {
      id: "mod-002",
      name: "Operations",
      count: 5,
    },
    {
      id: "mod-003",
      name: "Human Resources",
      count: 2,
    },
  ],
};

// ----------------------------------------------------------------------
// Fetcher
// ----------------------------------------------------------------------

export const getSidebarModules = async (
  params?: GetSidebarModulesParams
): Promise<GetSidebarModulesResponseData> => {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In a real mock scenario, we might filter based on params here,
    // but for this structure, we'll return the static mock data.
    return {
      total: { ...mockData.total },
      modules: [...mockData.modules],
    };
  }

  const response = await fetcherBO.get("/v1/mytask/approval/sidebar/modules", {
    params: {
      statusFilter: params?.statusFilter || "new",
    },
  });

  return response.data?.Data;
};

// ----------------------------------------------------------------------
// Hook
// ----------------------------------------------------------------------

export const useGetSidebarModules = (params?: GetSidebarModulesParams) => {
  // Key includes params to trigger re-fetch when filter changes
  const key = `sidebar-modules-${JSON.stringify(params || { statusFilter: "new" })}`;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => getSidebarModules(params),
    {
      revalidateOnFocus: false,
      keepPreviousData: true, // Keep showing previous data while fetching new filter
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
