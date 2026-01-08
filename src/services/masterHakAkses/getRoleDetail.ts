import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface MenuAccessDetail {
  menu: string;
  menuLabel: string;
  availableActions: string[];
  selectedActions: string[];
}

export interface GetRoleDetailResponse {
  id: string;
  role: string;
  description: string;
  isActive: boolean;
  selectedMenus: string[];
  menuAccess: MenuAccessDetail[];
  createdAt: string; // Format: "YYYY-MM-DD HH:mm:ss"
  updatedAt: string; // Format: "YYYY-MM-DD HH:mm:ss"
}

export interface GetRoleDetailData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: GetRoleDetailResponse;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: GetRoleDetailData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    id: "role-uuid-1",
    role: "Administrator",
    description: "Full system access with all permissions",
    isActive: true,
    selectedMenus: [
      "MY_TASK",
      "SETTING_APPROVAL",
      "MASTER_USER",
      "MASTER_ROLE",
    ],
    menuAccess: [
      {
        menu: "MY_TASK",
        menuLabel: "My Task",
        availableActions: ["VIEW", "UPDATE"],
        selectedActions: ["VIEW", "UPDATE"],
      },
      {
        menu: "SETTING_APPROVAL",
        menuLabel: "Setting Approval",
        availableActions: ["VIEW", "CREATE", "UPDATE", "DELETE"],
        selectedActions: ["VIEW", "CREATE", "UPDATE", "DELETE"],
      },
      {
        menu: "MASTER_USER",
        menuLabel: "Master User",
        availableActions: ["VIEW", "CREATE", "UPDATE", "DELETE"],
        selectedActions: ["VIEW", "CREATE", "UPDATE", "DELETE"],
      },
      {
        menu: "MASTER_ROLE",
        menuLabel: "Master Role",
        availableActions: ["VIEW", "CREATE", "UPDATE", "DELETE"],
        selectedActions: ["VIEW", "CREATE", "UPDATE", "DELETE"],
      },
    ],
    createdAt: "2025-12-15 09:00:00",
    updatedAt: "2025-12-20 14:30:00",
  },
  Type: "/v1/mytask/role/{roleId}",
};

// Type for the processed data with DeepPartial for flexibility
export type GetRoleDetailResult = DeepPartial<GetRoleDetailResponse>;

/**
 * Service function to get detail of a role
 * @param roleId The ID of the role to get details for
 * @returns Promise containing the role detail data
 */
export async function getRoleDetail(
  roleId: string
): Promise<GetRoleDetailResult> {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/role/${roleId}`;
    const response = await fetcherBO.get(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error fetching role detail:", error);
    throw error;
  }
}

/**
 * SWR hook for fetching role detail with caching and revalidation
 * @param roleId The ID of the role to get details for
 * @returns SWR response with data, error, loading state, and mutate function
 */
export const useGetRoleDetail = (roleId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    roleId ? `role-detail-${roleId}` : null,
    () => getRoleDetail(roleId)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
