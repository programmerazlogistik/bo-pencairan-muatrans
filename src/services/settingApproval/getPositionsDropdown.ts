import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface PositionOption {
  id: string;
  name: string;
  label: string;
}

export interface GetPositionsDropdownData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: PositionOption[];
  Type: string;
}

// Define query parameters type
export interface GetPositionsDropdownParams {
  search?: string;
}

// Mock data based on the API contract example
export const mockAPIResult: GetPositionsDropdownData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: [
    {
      id: "pos-001",
      name: "Manager Finance",
      label: "Jabatan - Manager Finance",
    },
    {
      id: "pos-002",
      name: "Director",
      label: "Jabatan - Director",
    },
  ],
  Type: "/v1/mytask/setting-approval/dropdown/position",
};

// Type for the processed data with DeepPartial for flexibility
export type GetPositionsDropdownResult = DeepPartial<PositionOption[]>;

/**
 * Service function to get positions dropdown options
 * @param params Query parameters for searching positions
 * @returns Promise containing positions dropdown data
 */
export async function getPositionsDropdown(
  params?: GetPositionsDropdownParams
): Promise<GetPositionsDropdownResult> {
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
    const endpoint = `/v1/mytask/setting-approval/dropdown/position${queryString ? `?${queryString}` : ""}`;

    const response = await fetcherBO.get(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error fetching positions dropdown:", error);
    throw error;
  }
}

/**
 * SWR hook for fetching positions dropdown with caching and revalidation
 * @param params Query parameters for searching positions
 * @returns SWR response with data, error, loading state, and mutate function
 */
export const useGetPositionsDropdown = (
  params?: GetPositionsDropdownParams
) => {
  // Create a stable key that includes the parameters to ensure proper SWR caching
  const paramsString = params ? JSON.stringify(params) : "";
  const { data, error, isLoading, mutate } = useSWR(
    `positions-dropdown-${paramsString}`,
    () => getPositionsDropdown(params)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
