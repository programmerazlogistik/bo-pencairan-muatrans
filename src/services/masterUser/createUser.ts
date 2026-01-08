import useSWRMutation from "swr/mutation";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface CreateUserRequest {
  name: string;
  email: string;
  branchIds?: string[];
  departmentIds?: string[];
  divisionIds?: string[];
  positionIds?: string[];
  roleId: string;
  password: string;
  confirmPassword: string;
}

export interface CreateUserResponse {
  message: string;
  userId: string;
}

export interface CreateUserData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: CreateUserResponse;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: CreateUserData = {
  Message: {
    Code: 201,
    Text: "OK",
  },
  Data: {
    message: "User created successfully",
    userId: "123e4567-e89b-12d3-a456-426614174000",
  },
  Type: "/v1/mytask/user",
};

// Type for the processed data with DeepPartial for flexibility
export type CreateUserResult = DeepPartial<CreateUserResponse>;

/**
 * Service function to create a new user
 * @param userData The user data to create
 * @returns Promise containing the creation result
 */
export async function createUser(
  userData: CreateUserRequest
): Promise<CreateUserResult> {
  if (USE_MOCK) {
    // Simulate API delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/user`;
    const response = await fetcherBO.post(endpoint, userData);
    return response.data?.Data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

/**
 * SWR mutation hook for creating a new user
 * @returns SWR mutation response with data, error, isMutating state, and trigger function
 */
export const useCreateUser = () => {
  const { trigger, error, isMutating, data } = useSWRMutation(
    "create-user",
    (_, { arg }: { arg: CreateUserRequest }) => createUser(arg)
  );

  return {
    createUser: trigger,
    error,
    isLoading: isMutating,
    data,
  };
};
