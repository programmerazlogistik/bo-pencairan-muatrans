import useSWRMutation from "swr/mutation";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdatePasswordResponse {
  message: string;
}

export interface UpdatePasswordData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: UpdatePasswordResponse;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: UpdatePasswordData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    message: "Password updated successfully. Please login again.",
  },
  Type: "/v1/mytask/user/password",
};

// Type for the processed data with DeepPartial for flexibility
export type UpdatePasswordResult = DeepPartial<UpdatePasswordResponse>;

/**
 * Service function to update user's password
 * @param passwordData The password update data (old password, new password, and confirmation)
 * @returns Promise containing the password update result
 */
export async function updatePassword(
  passwordData: UpdatePasswordRequest
): Promise<UpdatePasswordResult> {
  if (USE_MOCK) {
    // Simulate API delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/user/password`;
    const response = await fetcherBO.patch(endpoint, passwordData);
    return response.data?.Data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}

/**
 * SWR mutation hook for updating user password
 * @returns SWR mutation response with data, error, isMutating state, and trigger function
 */
export const useUpdatePassword = () => {
  const { trigger, error, isMutating, data } = useSWRMutation(
    "update-password",
    (_, { arg }: { arg: UpdatePasswordRequest }) => updatePassword(arg)
  );

  return {
    updatePassword: trigger,
    error,
    isLoading: isMutating,
    data,
  };
};
