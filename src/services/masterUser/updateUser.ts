import useSWRMutation from "swr/mutation";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  branchIds?: string[];
  departmentIds?: string[];
  divisionIds?: string[];
  positionIds?: string[];
  roleId?: string;
  password?: string;
  confirmPassword?: string;
  isActive?: boolean;
}

export interface UpdateUserResponse {
  message: string;
  userId: string;
}

export interface UpdateUserData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: UpdateUserResponse;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: UpdateUserData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    message: "User updated successfully",
    userId: "123e4567-e89b-12d3-a456-426614174000",
  },
  Type: "/v1/mytask/user/{userId}",
};

// Type for the processed data with DeepPartial for flexibility
export type UpdateUserResult = DeepPartial<UpdateUserResponse>;

/**
 * Service function to update a user
 * @param userId The ID of the user to update
 * @param userData The user data to update
 * @returns Promise containing the update result
 */
export async function updateUser(
  userId: string,
  userData: UpdateUserRequest
): Promise<UpdateUserResult> {
  if (USE_MOCK) {
    // Simulate API delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/user/${userId}`;
    const response = await fetcherBO.put(endpoint, userData);
    return response.data?.Data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * SWR mutation hook for updating a user
 * @returns SWR mutation response with data, error, isMutating state, and trigger function
 */
export const useUpdateUser = () => {
  const { trigger, error, isMutating, data } = useSWRMutation(
    "update-user",
    (_, { arg }: { arg: { userId: string; userData: UpdateUserRequest } }) =>
      updateUser(arg.userId, arg.userData)
  );

  return {
    updateUser: trigger,
    error,
    isLoading: isMutating,
    data,
  };
};
