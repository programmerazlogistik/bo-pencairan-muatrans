import useSWRMutation from "swr/mutation";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface DeleteRoleResponse {
  message: string;
  roleId: string;
}

export interface DeleteRoleData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: DeleteRoleResponse;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: DeleteRoleData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    message: "Role deleted successfully",
    roleId: "role-uuid",
  },
  Type: "/v1/mytask/role/{roleId}",
};

// Type for the processed data with DeepPartial for flexibility
export type DeleteRoleResult = DeepPartial<DeleteRoleResponse>;

/**
 * Service function to delete a role
 * @param roleId The ID of the role to delete
 * @returns Promise containing the deletion result
 */
export async function deleteRole(roleId: string): Promise<DeleteRoleResult> {
  if (USE_MOCK) {
    // Simulate API delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/role/${roleId}`;
    const response = await fetcherBO.delete(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
}

/**
 * SWR mutation hook for deleting a role
 * @returns SWR mutation response with data, error, isMutating state, and trigger function
 */
export const useDeleteRole = () => {
  const { trigger, error, isMutating, data } = useSWRMutation(
    "delete-role",
    (_, { arg }: { arg: { roleId: string } }) => deleteRole(arg.roleId)
  );

  return {
    deleteRole: trigger,
    error,
    isLoading: isMutating,
    data,
  };
};
