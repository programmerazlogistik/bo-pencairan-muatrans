import useSWRMutation from "swr/mutation";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface ToggleUserStatusResponse {
  message: string;
  userId: string;
  isActive: boolean;
  status: string;
}

export interface ToggleUserStatusData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: ToggleUserStatusResponse;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: ToggleUserStatusData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    message: "User activated successfully",
    userId: "user-uuid",
    isActive: true,
    status: "Active",
  },
  Type: "/v1/mytask/user/{userId}/status",
};

// Type for the processed data with DeepPartial for flexibility
export type ToggleUserStatusResult = DeepPartial<ToggleUserStatusResponse>;

/**
 * Service function to toggle user status (activate/deactivate)
 * @param userId The ID of the user to toggle status for
 * @returns Promise containing the toggle status result
 */
export async function toggleUserStatus(
  userId: string
): Promise<ToggleUserStatusResult> {
  if (USE_MOCK) {
    // Simulate API delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/user/${userId}/status`;
    const response = await fetcherBO.patch(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error toggling user status:", error);
    throw error;
  }
}

/**
 * SWR mutation hook for toggling user status
 * @returns SWR mutation response with data, error, isMutating state, and trigger function
 */
export const useToggleUserStatus = () => {
  const { trigger, error, isMutating, data } = useSWRMutation(
    "toggle-user-status",
    (_, { arg }: { arg: { userId: string } }) => toggleUserStatus(arg.userId)
  );

  return {
    toggleUserStatus: trigger,
    error,
    isLoading: isMutating,
    data,
  };
};
