import useSWRMutation from "swr/mutation";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface DeleteApprovalConfigResponse {
  message: string;
  configId: string;
}

export interface DeleteApprovalConfigData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: DeleteApprovalConfigResponse;
  Type: string;
}

// Mock API result for development
export const mockAPIResult = {
  Message: {
    Code: 200,
    Text: "Setting approval berhasil dihapus",
  },
  Data: {
    message: "Setting approval successfully deleted",
    configId: "1",
  },
  Type: "DELETE_APPROVAL_CONFIG",
};

// Type for the processed data with DeepPartial for flexibility
export type DeleteApprovalConfigResult =
  DeepPartial<DeleteApprovalConfigResponse>;

/**
 * Service function to delete an approval configuration
 * @param configId The ID of the approval configuration to delete
 * @returns Promise containing the deletion result
 */
export async function deleteApprovalConfig(
  configId: string
): Promise<DeleteApprovalConfigResult> {
  if (USE_MOCK) {
    // Simulate API delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/setting-approval/${configId}`;
    const response = await fetcherBO.delete(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error deleting approval config:", error);
    throw error;
  }
}

/**
 * SWR mutation hook for deleting an approval configuration
 * @returns SWR mutation response with data, error, isMutating state, and trigger function
 */
export const useDeleteApprovalConfig = () => {
  const { trigger, error, isMutating, data } = useSWRMutation(
    "delete-approval-config",
    (_, { arg }: { arg: { configId: string } }) =>
      deleteApprovalConfig(arg.configId)
  );

  return {
    deleteApprovalConfig: trigger,
    error,
    isLoading: isMutating,
    data,
  };
};
