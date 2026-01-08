import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface MenuOption {
  id: string;
  name: string;
}

export interface GetMenusDropdownData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: MenuOption[];
  Type: string;
}

// Define query parameters type
export interface GetMenusDropdownParams {
  moduleId?: string; // Optional parameter
  search?: string;
}

// Mock data based on the API contract example
export const mockAPIResult: GetMenusDropdownData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: [
    {
      id: "menu-001",
      name: "Pembayaran Vendor",
    },
    {
      id: "menu-002",
      name: "Reimbursement",
    },
  ],
  Type: "/v1/mytask/setting-approval/dropdown/menu",
};

// Type for the processed data with DeepPartial for flexibility
export type GetMenusDropdownResult = DeepPartial<MenuOption[]>;

/**
 * Service function to get menus dropdown options filtered by module
 * @param params Query parameters including moduleId and optional search
 * @returns Promise containing menus dropdown data
 */
export async function getMenusDropdown(
  params: GetMenusDropdownParams
): Promise<GetMenusDropdownResult> {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAPIResult.Data;
  }

  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    if (params.moduleId) queryParams.append("moduleId", params.moduleId);
    if (params.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const endpoint = `/v1/mytask/setting-approval/dropdown/menu?${queryString}`;

    const response = await fetcherBO.get(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error fetching menus dropdown:", error);
    throw error;
  }
}

/**
 * SWR hook for fetching menus dropdown with caching and revalidation
 * @param params Query parameters including moduleId and optional search
 * @returns SWR response with data, error, loading state, and mutate function
 */
export const useGetMenusDropdown = (params: GetMenusDropdownParams | null) => {
  // Create a stable key that includes the parameters to ensure proper SWR caching
  const paramsString = params ? JSON.stringify(params) : "";
  const { data, error, isLoading, mutate } = useSWR(
    params ? `menus-dropdown-${paramsString}` : null,
    () => getMenusDropdown(params!)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
