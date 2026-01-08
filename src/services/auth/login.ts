import useSWRMutation from "swr/mutation";
import xior from 'xior';
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  type: string;
  isActive: boolean;
}

export interface LoginTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: string;
}

export interface LoginInfo {
  loginAt: string; // Format: "YYYY-MM-DD HH:mm:ss"
  ipAddress?: string;
  userAgent?: string;
}

export interface LoginResponse {
  message: string;
  user: LoginUser;
  tokens: LoginTokens;
  loginInfo: LoginInfo;
}

export interface LoginData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: LoginResponse;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: LoginData = {
  Message: {
    Code: 201,
    Text: "OK",
  },
  Data: {
    message: "Login successful",
    user: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "John Administrator",
      email: "admin@company.com",
      phoneNumber: "+62812345678",
      type: "SUPER_ADMIN",
      isActive: true,
    },
    tokens: {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      tokenType: "Bearer",
      expiresIn: "2025-12-25T10:30:00.000Z",
    },
    loginInfo: {
      loginAt: "2025-12-24 10:30:00",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
    },
  },
  Type: "/v1/mytask/user/login",
};

// Type for the processed data with DeepPartial for flexibility
export type LoginResult = DeepPartial<LoginResponse>;

/**
 * Service function to authenticate a user
 * @param loginData The login credentials (email and password)
 * @returns Promise containing the login result with user data and tokens
 */
export async function login(loginData: LoginRequest): Promise<LoginResult> {
  if (USE_MOCK) {
    // Simulate API delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `${process.env.NEXT_PUBLIC_MY_TASK_API}/v1/mytask/user/login`;
    // Use basic auth for login endpoint as specified in API contract
    const basicAuth = btoa("az_bo_mytask:Zci01Y4zh2IHCupULvXbTdD77");
    const response = await xior.post(endpoint, loginData, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
    });
    return response.data?.Data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

/**
 * SWR mutation hook for user login
 * @returns SWR mutation response with data, error, isMutating state, and trigger function
 */
export const useLogin = () => {
  const { trigger, error, isMutating, data } = useSWRMutation(
    "login",
    (_, { arg }: { arg: LoginRequest }) => login(arg)
  );

  return {
    login: trigger,
    error,
    isLoading: isMutating,
    data,
  };
};
