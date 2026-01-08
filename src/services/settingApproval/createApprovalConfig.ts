import useSWRMutation from "swr/mutation";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface Approval {
  type: "user" | "position";
  userId?: string; // Required if type is "user"
  positionId?: string; // Required if type is "position"
  operator?: "AND" | "OR"; // Optional - determines if next approver is sequential or parallel
}

export interface CreateApprovalConfigRequest {
  moduleId: string; // Module ID
  menuId: string; // Menu ID (must belong to selected module)
  name: string; // Configuration name (1-255 chars)
  queryList: { query: string }; // SQL SELECT query for listing (must start with SELECT)
  queryDetails: { query: string }; // SQL SELECT query for detail (must start with SELECT)
  approvals: Approval[]; // Array of approver objects (min 1)
}

export interface CreateApprovalConfigResponse {
  message: string;
  configId: string;
}

export interface CreateApprovalConfigData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: CreateApprovalConfigResponse;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: CreateApprovalConfigData = {
  Message: {
    Code: 201,
    Text: "OK",
  },
  Data: {
    message: "Setting approval created successfully",
    configId: "123e4567-e89b-12d3-a456-426614174000",
  },
  Type: "/v1/mytask/setting-approval",
};

// Type for the processed data with DeepPartial for flexibility
export type CreateApprovalConfigResult =
  DeepPartial<CreateApprovalConfigResponse>;

/**
 * Service function to create an approval configuration
 * @param approvalConfig The approval configuration data to create
 * @returns Promise containing the creation result
 */
export async function createApprovalConfig(
  approvalConfig: CreateApprovalConfigRequest
): Promise<CreateApprovalConfigResult> {
  if (USE_MOCK) {
    // Simulate API delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/setting-approval`;
    const response = await fetcherBO.post(endpoint, approvalConfig);
    return response.data?.Data;
  } catch (error) {
    console.error("Error creating approval config:", error);
    throw error;
  }
}

/**
 * SWR mutation hook for creating an approval configuration
 * @returns SWR mutation response with data, error, isMutating state, and trigger function
 */
export const useCreateApprovalConfig = () => {
  const { trigger, error, isMutating, data } = useSWRMutation(
    "create-approval-config",
    (_, { arg }: { arg: CreateApprovalConfigRequest }) =>
      createApprovalConfig(arg)
  );

  return {
    createApprovalConfig: trigger,
    error,
    isLoading: isMutating,
    data,
  };
};
