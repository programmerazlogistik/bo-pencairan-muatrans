import useSWRMutation from "swr/mutation";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface DeleteUserResponse {
  message: string;
  userId: string;
}

export interface DeleteUserData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: DeleteUserResponse;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult = {
  Message: {
    Code: 200,
    Text: "User successfully deleted",
  },
  Data: {
    message: "User successfully deleted",
    userId: "123e4567-e89b-12d3-a456-426614174000",
  },
  Type: "DELETE_USER",
};

// Type for the processed data with DeepPartial for flexibility
export type DeleteUserResult = DeepPartial<DeleteUserResponse>;

/**
 * Service function to delete a user
 * @param userId The ID of the user to delete
 * @returns Promise containing the deletion result
 */
export async function deleteUser(userId: string): Promise<DeleteUserResult> {
  if (USE_MOCK) {
    // Simulate API delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/user/${userId}`;
    const response = await fetcherBO.delete(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

/**
 * SWR mutation hook for deleting a user
 * @returns SWR mutation response with data, error, isMutating state, and trigger function
 */
export const useDeleteUser = () => {
  const { trigger, error, isMutating, data } = useSWRMutation(
    "delete-user",
    (_, { arg }: { arg: { userId: string } }) => deleteUser(arg.userId)
  );

  return {
    deleteUser: trigger,
    error,
    isLoading: isMutating,
    data,
  };
};
