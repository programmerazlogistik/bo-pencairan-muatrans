import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface ActionOption {
  value: string;
  label: string;
}

export interface GetActionsDropdownData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: {
    actions: ActionOption[];
  };
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: GetActionsDropdownData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    actions: [
      { value: "VIEW", label: "View" },
      { value: "CREATE", label: "Create" },
      { value: "UPDATE", label: "Update" },
      { value: "DELETE", label: "Delete" },
    ],
  },
  Type: "/v1/mytask/role/dropdown/action",
};

// Type for the processed data with DeepPartial for flexibility
export type GetActionsDropdownResult = DeepPartial<ActionOption[]>;

/**
 * Service function to get action dropdown options
 * @returns Promise containing action dropdown data
 */
export async function getActionsDropdown(): Promise<GetActionsDropdownResult> {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAPIResult.Data.actions;
  }

  try {
    const endpoint = `/v1/mytask/role/dropdown/action`;
    const response = await fetcherBO.get(endpoint);
    return response.data?.Data.actions;
  } catch (error) {
    console.error("Error fetching actions dropdown:", error);
    throw error;
  }
}

/**
 * SWR hook for fetching action dropdown with caching and revalidation
 * @returns SWR response with data, error, loading state, and mutate function
 */
export const useGetActionsDropdown = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "actions-dropdown",
    getActionsDropdown
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
