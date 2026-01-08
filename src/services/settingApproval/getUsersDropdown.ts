import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface UserOption {
  id: string;
  name: string;
  label: string;
}

export interface GetUsersDropdownData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: UserOption[];
  Type: string;
}

// Define query parameters type
export interface GetUsersDropdownParams {
  search?: string;
}

// Mock data based on the API contract example
export const mockAPIResult: GetUsersDropdownData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: [
    {
      id: "user-001",
      name: "John Doe",
      label: "User - John Doe",
    },
    {
      id: "user-002",
      name: "Jane Smith",
      label: "User - Jane Smith",
    },
  ],
  Type: "/v1/mytask/setting-approval/dropdown/user",
};

// Type for the processed data with DeepPartial for flexibility
export type GetUsersDropdownResult = DeepPartial<UserOption[]>;

/**
 * Service function to get users dropdown options
 * @param params Query parameters for searching users
 * @returns Promise containing users dropdown data
 */
export async function getUsersDropdown(
  params?: GetUsersDropdownParams
): Promise<GetUsersDropdownResult> {
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
    const endpoint = `/v1/mytask/setting-approval/dropdown/user${queryString ? `?${queryString}` : ""}`;

    const response = await fetcherBO.get(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error fetching users dropdown:", error);
    throw error;
  }
}

/**
 * SWR hook for fetching users dropdown with caching and revalidation
 * @param params Query parameters for searching users
 * @returns SWR response with data, error, loading state, and mutate function
 */
export const useGetUsersDropdown = (params?: GetUsersDropdownParams) => {
  // Create a stable key that includes the parameters to ensure proper SWR caching
  const paramsString = params ? JSON.stringify(params) : "";
  const { data, error, isLoading, mutate } = useSWR(
    `users-dropdown-${paramsString}`,
    () => getUsersDropdown(params)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
