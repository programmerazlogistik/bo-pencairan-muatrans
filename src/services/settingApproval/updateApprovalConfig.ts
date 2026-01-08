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

export interface UpdateApprovalConfigRequest {
  moduleId?: string; // Module ID (optional)
  menuId?: string; // Menu ID (optional)
  name?: string; // Configuration name (optional)
  queryList?: { query: string }; // SQL SELECT query for listing (optional)
  queryDetails?: { query: string }; // SQL SELECT query for detail (optional)
  approvals?: Approval[]; // Array of approver objects (optional, replaces existing)
}

export interface UpdateApprovalConfigResponse {
  message: string;
  configId: string;
}

export interface UpdateApprovalConfigData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: UpdateApprovalConfigResponse;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: UpdateApprovalConfigData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    message: "Setting approval updated successfully",
    configId: "123e4567-e89b-12d3-a456-426614174000",
  },
  Type: "/v1/mytask/setting-approval/{configId}",
};

// Type for the processed data with DeepPartial for flexibility
export type UpdateApprovalConfigResult =
  DeepPartial<UpdateApprovalConfigResponse>;

/**
 * Service function to update an approval configuration
 * @param configId The ID of the approval configuration to update
 * @param approvalConfig The approval configuration data to update
 * @returns Promise containing the update result
 */
export async function updateApprovalConfig(
  configId: string,
  approvalConfig: UpdateApprovalConfigRequest
): Promise<UpdateApprovalConfigResult> {
  if (USE_MOCK) {
    // Simulate API delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/setting-approval/${configId}`;
    const response = await fetcherBO.put(endpoint, approvalConfig);
    return response.data?.Data;
  } catch (error) {
    console.error("Error updating approval config:", error);
    throw error;
  }
}

/**
 * SWR mutation hook for updating an approval configuration
 * @returns SWR mutation response with data, error, isMutating state, and trigger function
 */
export const useUpdateApprovalConfig = () => {
  const { trigger, error, isMutating, data } = useSWRMutation(
    "update-approval-config",
    (
      _,
      {
        arg,
      }: {
        arg: { configId: string; approvalConfig: UpdateApprovalConfigRequest };
      }
    ) => updateApprovalConfig(arg.configId, arg.approvalConfig)
  );

  return {
    updateApprovalConfig: trigger,
    error,
    isLoading: isMutating,
    data,
  };
};
