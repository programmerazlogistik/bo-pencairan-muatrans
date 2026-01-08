import useSWRMutation from "swr/mutation";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface MenuAccess {
  menu: string; // Menu code: `MY_TASK`, `SETTING_APPROVAL`, `MASTER_USER`, `MASTER_ROLE`
  actions: string[]; // Actions: `VIEW`, `CREATE`, `UPDATE`, `DELETE`
}

export interface UpdateRoleRequest {
  role?: string; // Role name (2-255 characters)
  description?: string; // Role description (max 500 characters)
  menuAccess?: MenuAccess[]; // If provided, replaces all existing menu access
}

export interface UpdateRoleResponse {
  message: string;
  roleId: string;
}

export interface UpdateRoleData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: UpdateRoleResponse;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: UpdateRoleData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    message: "Role updated successfully",
    roleId: "role-uuid",
  },
  Type: "/v1/mytask/role/{roleId}",
};

// Type for the processed data with DeepPartial for flexibility
export type UpdateRoleResult = DeepPartial<UpdateRoleResponse>;

/**
 * Service function to update a role
 * @param roleId The ID of the role to update
 * @param roleData The role data to update
 * @returns Promise containing the update result
 */
export async function updateRole(
  roleId: string,
  roleData: UpdateRoleRequest
): Promise<UpdateRoleResult> {
  if (USE_MOCK) {
    // Simulate API delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/role/${roleId}`;
    const response = await fetcherBO.put(endpoint, roleData);
    return response.data?.Data;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
}

/**
 * SWR mutation hook for updating a role
 * @returns SWR mutation response with data, error, isMutating state, and trigger function
 */
export const useUpdateRole = () => {
  const { trigger, error, isMutating, data } = useSWRMutation(
    "update-role",
    (
      _,
      {
        arg,
      }: {
        arg: { roleId: string; roleData: UpdateRoleRequest };
      }
    ) => updateRole(arg.roleId, arg.roleData)
  );

  return {
    updateRole: trigger,
    error,
    isLoading: isMutating,
    data,
  };
};
