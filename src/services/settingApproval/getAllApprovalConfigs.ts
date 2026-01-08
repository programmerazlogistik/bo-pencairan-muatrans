import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface ApprovalConfig {
  id: string;
  moduleName: string;
  menuName: string;
  name: string;
  approvals: string[];
  isActive: boolean;
  createdAt: string; // Format: "DD/MM/YYYY"
}

export interface Pagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetAllApprovalConfigsResponse {
  items: ApprovalConfig[];
  pagination: Pagination;
}

export interface GetAllApprovalConfigsData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: GetAllApprovalConfigsResponse;
  Type: string;
}

// Define query parameters type
export interface GetAllApprovalConfigsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?:
    | "newest"
    | "oldest"
    | "menu_asc"
    | "menu_desc"
    | "module_asc"
    | "module_desc";
}

// Mock data based on the API contract example
export const mockAPIResult: GetAllApprovalConfigsData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    items: [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        moduleName: "Finance",
        menuName: "Pembayaran Vendor",
        name: "Approval Pembayaran Vendor",
        approvals: ["1. Jabatan - Manager Finance", "2. User - John Doe"],
        isActive: true,
        createdAt: "01/06/2025",
      },
    ],
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalItems: 1,
      totalPages: 2,
      hasNext: true,
      hasPrevious: false,
    },
  },
  Type: "/v1/mytask/setting-approval",
};

// Type for the processed data with DeepPartial for flexibility
export type GetAllApprovalConfigsResult =
  DeepPartial<GetAllApprovalConfigsResponse>;

/**
 * Service function to get all approval configurations
 * @param params Query parameters for pagination, search, and sorting
 * @returns Promise containing approval configurations data
 */
export async function getAllApprovalConfigs(
  params?: GetAllApprovalConfigsParams
): Promise<GetAllApprovalConfigsResult> {
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
    const endpoint = `/v1/mytask/setting-approval${queryString ? `?${queryString}` : ""}`;

    const response = await fetcherBO.get(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error fetching approval configs:", error);
    throw error;
  }
}

/**
 * SWR hook for fetching approval configurations with caching and revalidation
 * @param params Query parameters for pagination, search, and sorting
 * @returns SWR response with data, error, loading state, and mutate function
 */
export const useGetAllApprovalConfigs = (
  params?: GetAllApprovalConfigsParams
) => {
  // Create a stable key that includes the parameters to ensure proper SWR caching
  const paramsString = params ? JSON.stringify(params) : "";
  const { data, error, isLoading, mutate } = useSWR(
    `approval-configs-${paramsString}`,
    () => getAllApprovalConfigs(params)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
