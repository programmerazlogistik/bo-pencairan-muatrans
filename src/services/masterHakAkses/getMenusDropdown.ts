import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface MenuOption {
  value: string;
  label: string;
  availableActions: string[];
}

export interface GetMenusDropdownData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: {
    menus: MenuOption[];
  };
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: GetMenusDropdownData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    menus: [
      {
        value: "MY_TASK",
        label: "My Task",
        availableActions: ["VIEW", "UPDATE"],
      },
      {
        value: "SETTING_APPROVAL",
        label: "Setting Approval",
        availableActions: ["VIEW", "CREATE", "UPDATE", "DELETE"],
      },
      {
        value: "MASTER_USER",
        label: "Master User",
        availableActions: ["VIEW", "CREATE", "UPDATE", "DELETE"],
      },
      {
        value: "MASTER_ROLE",
        label: "Master Role",
        availableActions: ["VIEW", "CREATE", "UPDATE", "DELETE"],
      },
    ],
  },
  Type: "/v1/mytask/role/dropdown/menu",
};

// Type for the processed data with DeepPartial for flexibility
export type GetMenusDropdownResult = DeepPartial<MenuOption[]>;

/**
 * Service function to get menu dropdown options
 * @returns Promise containing menu dropdown data
 */
export async function getMenusDropdown(): Promise<GetMenusDropdownResult> {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAPIResult.Data.menus;
  }

  try {
    const endpoint = `/v1/mytask/role/dropdown/menu`;
    const response = await fetcherBO.get(endpoint);
    return response.data?.Data.menus;
  } catch (error) {
    console.error("Error fetching menus dropdown:", error);
    throw error;
  }
}

/**
 * SWR hook for fetching menu dropdown with caching and revalidation
 * @returns SWR response with data, error, loading state, and mutate function
 */
export const useGetMenusDropdown = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "menus-dropdown",
    getMenusDropdown
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
