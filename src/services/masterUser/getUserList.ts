import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId: string;
  status: string;
  isActive: boolean;
  type: string;
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

export interface GetUserListResponse {
  users: User[];
  pagination: Pagination;
}

export interface GetUserListData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: GetUserListResponse;
  Type: string;
}

// Define query parameters type
export interface GetUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?:
    | "newest"
    | "oldest"
    | "name_asc"
    | "name_desc"
    | "email_asc"
    | "email_desc"
    | "role_asc"
    | "role_desc"
    | "status_asc"
    | "status_desc";
  status?: "active" | "inactive";
}

// Mock data based on the API contract example
export const mockAPIResult: GetUserListData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    users: [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "John Doe",
        email: "john.doe@company.com",
        role: "Administrator",
        roleId: "role-uuid-1",
        status: "Active",
        isActive: true,
        type: "USER",
        createdAt: "2025-12-20 09:00:00",
      },
    ],
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalItems: 25,
      totalPages: 3,
      hasNext: true,
      hasPrevious: false,
    },
  },
  Type: "/v1/mytask/user",
};

// Type for the processed data with DeepPartial for flexibility
export type GetUserListResult = DeepPartial<GetUserListResponse>;

/**
 * Service function to get user list with pagination, search, and sorting
 * @param params Query parameters for pagination, search, and sorting
 * @returns Promise containing user list data
 */
export async function getUserList(
  params?: GetUserListParams
): Promise<GetUserListResult> {
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
    if (params?.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    const endpoint = `/v1/mytask/user${queryString ? `?${queryString}` : ""}`;

    const response = await fetcherBO.get(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error fetching user list:", error);
    throw error;
  }
}

/**
 * SWR hook for fetching user list with caching and revalidation
 * @param params Query parameters for pagination, search, and sorting
 * @returns SWR response with data, error, loading state, and mutate function
 */
export const useGetUserList = (params?: GetUserListParams) => {
  // Create a stable key that includes the parameters to ensure proper SWR caching
  const paramsString = params ? JSON.stringify(params) : "";
  const { data, error, isLoading, mutate } = useSWR(
    `user-list-${paramsString}`,
    () => getUserList(params)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
