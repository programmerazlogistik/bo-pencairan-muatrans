import useSWRMutation from "swr/mutation";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface MenuAccess {
  menu: string; // Menu code: `MY_TASK`, `SETTING_APPROVAL`, `MASTER_USER`, `MASTER_ROLE`
  actions: string[]; // Actions: `VIEW`, `CREATE`, `UPDATE`, `DELETE`
}

export interface CreateRoleRequest {
  role: string; // Role name (2-255 characters)
  description?: string; // Role description (max 500 characters)
  menuAccess: MenuAccess[]; // Array of menu access objects
}

export interface CreateRoleResponse {
  message: string;
  role: {
    id: string;
    role: string;
    description: string;
    isActive: boolean;
    createdAt: string; // Format: "YYYY-MM-DD HH:mm:ss"
  };
}

export interface CreateRoleData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: CreateRoleResponse;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: CreateRoleData = {
  Message: {
    Code: 201,
    Text: "OK",
  },
  Data: {
    message: "Role created successfully",
    role: {
      id: "new-role-uuid",
      role: "Task Manager",
      description: "Can manage and approve tasks",
      isActive: true,
      createdAt: "2025-12-24 10:30:00",
    },
  },
  Type: "/v1/mytask/role",
};

// Type for the processed data with DeepPartial for flexibility
export type CreateRoleResult = DeepPartial<CreateRoleResponse>;

/**
 * Service function to create a role
 * @param roleData The role data to create
 * @returns Promise containing the creation result
 */
export async function createRole(
  roleData: CreateRoleRequest
): Promise<CreateRoleResult> {
  if (USE_MOCK) {
    // Simulate API delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/role`;
    const response = await fetcherBO.post(endpoint, roleData);
    return response.data?.Data;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
}

/**
 * SWR mutation hook for creating a role
 * @returns SWR mutation response with data, error, isMutating state, and trigger function
 */
export const useCreateRole = () => {
  const { trigger, error, isMutating, data } = useSWRMutation(
    "create-role",
    (_, { arg }: { arg: CreateRoleRequest }) => createRole(arg)
  );

  return {
    createRole: trigger,
    error,
    isLoading: isMutating,
    data,
  };
};
