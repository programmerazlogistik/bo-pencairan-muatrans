import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface Branch {
  id: string;
  name: string;
  address: string | null;
}

export interface Department {
  id: string;
  name: string;
}

export interface Division {
  id: string;
  name: string;
  departmentId: string;
}

export interface Position {
  id: string;
  name: string;
  divisionId: string;
  departmentId: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface UserDetail {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  isActive: boolean;
  status: string;
  type: string;
  branches: Branch[];
  departments: Department[];
  divisions: Division[];
  positions: Position[];
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserDetailData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: UserDetail;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: GetUserDetailData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    id: "6837961f-6f66-4791-944e-80ccd39ca1bd",
    name: "Backend Approval 5 Edit",
    email: "backend5@yopmail.com",
    phoneNumber: null,
    isActive: true,
    status: "Aktif",
    type: "USER",
    branches: [
      {
        id: "b0000001-0000-0000-0000-000000000001",
        name: "Surabaya",
        address: null,
      },
    ],
    departments: [
      {
        id: "d0000001-0000-0000-0000-000000000001",
        name: "Production",
      },
    ],
    divisions: [
      {
        id: "e0000001-0000-0000-0000-000000000005",
        name: "Business Analyst",
        departmentId: "d0000001-0000-0000-0000-000000000001",
      },
    ],
    positions: [
      {
        id: "f0000001-0000-0000-0000-000000000010",
        name: "Staff Business Analyst",
        divisionId: "e0000001-0000-0000-0000-000000000005",
        departmentId: "d0000001-0000-0000-0000-000000000001",
      },
    ],
    role: {
      id: "c49cf168-bcc0-4365-aa86-69e8eb26abff",
      name: "Super Approval",
      description: "Super Approval",
    },
    createdAt: "2025-12-08 10:54:01",
    updatedAt: "2025-12-08 11:39:06",
  },
  Type: "/v1/mytask/user/6837961f-6f66-4791-944e-80ccd39ca1bd",
};

// Type for the processed data with DeepPartial for flexibility
export type GetUserDetailResult = DeepPartial<UserDetail>;

/**
 * Service function to get user detail by ID
 * @param userId The ID of the user to get details for
 * @returns Promise containing user detail data
 */
export async function getUserDetail(
  userId: string
): Promise<GetUserDetailResult> {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/user/${userId}`;
    const response = await fetcherBO.get(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error fetching user detail:", error);
    throw error;
  }
}

/**
 * SWR hook for fetching user detail with caching and revalidation
 * @param userId The ID of the user to get details for
 * @returns SWR response with data, error, loading state, and mutate function
 */
export const useGetUserDetail = (userId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `user-detail-${userId}` : null,
    () => getUserDetail(userId)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
