import useSWRMutation from "swr/mutation";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface LogoutResponse {
  message: string;
  logoutInfo: {
    userId: string;
    email: string;
    logoutAt: string; // Format: "YYYY-MM-DD HH:mm:ss"
    ipAddress?: string;
    sessionDestroyed: boolean;
  };
}

export interface LogoutData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: LogoutResponse;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: LogoutData = {
  Message: {
    Code: 201,
    Text: "OK",
  },
  Data: {
    message: "Logout successful",
    logoutInfo: {
      userId: "550e8400-e29b-41d4-a716-446655440001",
      email: "admin@company.com",
      logoutAt: "2025-12-24 11:00:00",
      ipAddress: "192.168.1.100",
      sessionDestroyed: true,
    },
  },
  Type: "/v1/mytask/user/logout",
};

// Type for the processed data with DeepPartial for flexibility
export type LogoutResult = DeepPartial<LogoutResponse>;

/**
 * Service function to logout the current user
 * @returns Promise containing the logout result
 */
export async function logout(): Promise<LogoutResult> {
  if (USE_MOCK) {
    // Simulate API delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/user/logout`;
    const response = await fetcherBO.post(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}

/**
 * SWR mutation hook for user logout
 * @returns SWR mutation response with data, error, isMutating state, and trigger function
 */
export const useLogout = () => {
  const { trigger, error, isMutating, data } = useSWRMutation("logout", () =>
    logout()
  );

  return {
    logout: trigger,
    error,
    isLoading: isMutating,
    data,
  };
};
