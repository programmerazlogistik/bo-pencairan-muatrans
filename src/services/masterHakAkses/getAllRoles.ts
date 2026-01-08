import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface Role {
  id: string;
  role: string;
  description: string;
  isActive: boolean;
  accessSummary: string;
  accessList: string[];
  createdAt: string; // Format: "YYYY-MM-DD HH:mm:ss"
}

export interface Pagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetAllRolesResponse {
  roles: Role[];
  pagination: Pagination;
}

export interface GetAllRolesData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: GetAllRolesResponse;
  Type: string;
}

// Define query parameters type
export interface GetAllRolesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "newest" | "oldest" | "name_asc" | "name_desc";
}

// Mock data based on the API contract example
export const mockAPIResult: GetAllRolesData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    roles: [
      {
        id: "role-uuid-1",
        role: "Administrator",
        description: "Full system access with all permissions",
        isActive: true,
        accessSummary:
          "My Task : View, Update\nSetting Approval : View, Create, Update, Delete\nMaster User : View, Create, Update, Delete\nMaster Role : View, Create, Update, Delete",
        accessList: [
          "My Task : View, Update",
          "Setting Approval : View, Create, Update, Delete",
          "Master User : View, Create, Update, Delete",
          "Master Role : View, Create, Update, Delete",
        ],
        createdAt: "2025-12-15 09:00:00",
      },
    ],
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalItems: 5,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  Type: "/v1/mytask/role",
};

// Type for the processed data with DeepPartial for flexibility
export type GetAllRolesResult = DeepPartial<GetAllRolesResponse>;

/**
 * Service function to get all roles
 * @param params Query parameters for pagination, search, and sorting
 * @returns Promise containing roles data
 */
export async function getAllRoles(
  params?: GetAllRolesParams
): Promise<GetAllRolesResult> {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAPIResult.Data;
  }

  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);

    const queryString = queryParams.toString();
    const endpoint = `/v1/mytask/role${queryString ? `?${queryString}` : ""}`;

    const response = await fetcherBO.get(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
}

/**
 * SWR hook for fetching roles with caching and revalidation
 * @param params Query parameters for pagination, search, and sorting
 * @returns SWR response with data, error, loading state, and mutate function
 */
export const useGetAllRoles = (params?: GetAllRolesParams) => {
  // Create a stable key that includes the parameters to ensure proper SWR caching
  const paramsString = params ? JSON.stringify(params) : "";
  const { data, error, isLoading, mutate } = useSWR(
    `roles-${paramsString}`,
    () => getAllRoles(params)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
