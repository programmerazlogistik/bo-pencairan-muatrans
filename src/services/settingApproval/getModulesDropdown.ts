import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface ModuleOption {
  id: string;
  name: string;
}

export interface GetModulesDropdownData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: ModuleOption[];
  Type: string;
}

// Define query parameters type
export interface GetModulesDropdownParams {
  search?: string;
}

// Mock data based on the API contract example
export const mockAPIResult: GetModulesDropdownData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: [
    {
      id: "mod-001",
      name: "Finance",
    },
    {
      id: "mod-002",
      name: "Operations",
    },
  ],
  Type: "/v1/mytask/setting-approval/dropdown/module",
};

// Type for the processed data with DeepPartial for flexibility
export type GetModulesDropdownResult = DeepPartial<ModuleOption[]>;

/**
 * Service function to get modules dropdown options
 * @param params Query parameters for searching modules
 * @returns Promise containing modules dropdown data
 */
export async function getModulesDropdown(
  params?: GetModulesDropdownParams
): Promise<GetModulesDropdownResult> {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAPIResult.Data;
  }

  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const endpoint = `/v1/mytask/setting-approval/dropdown/module${queryString ? `?${queryString}` : ""}`;

    const response = await fetcherBO.get(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error fetching modules dropdown:", error);
    throw error;
  }
}

/**
 * SWR hook for fetching modules dropdown with caching and revalidation
 * @param params Query parameters for searching modules
 * @returns SWR response with data, error, loading state, and mutate function
 */
export const useGetModulesDropdown = (params?: GetModulesDropdownParams) => {
  // Create a stable key that includes the parameters to ensure proper SWR caching
  const paramsString = params ? JSON.stringify(params) : "";
  const { data, error, isLoading, mutate } = useSWR(
    `modules-dropdown-${paramsString}`,
    () => getModulesDropdown(params)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
