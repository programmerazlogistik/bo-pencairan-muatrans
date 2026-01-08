import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface BranchOption {
  id: string;
  name: string;
  address: string;
}

export interface DepartmentOption {
  id: string;
  name: string;
}

export interface DivisionOption {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
}

export interface PositionOption {
  id: string;
  name: string;
  divisionId: string;
  divisionName: string;
}

export interface RoleOption {
  id: string;
  name: string;
  description: string;
}

export interface GetDropdownOptionsData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: (
    | BranchOption
    | DepartmentOption
    | DivisionOption
    | PositionOption
    | RoleOption
  )[];
  Type: string;
}

// Define query parameters type
export interface GetDropdownOptionsParams {
  type: "branch" | "department" | "division" | "position" | "role";
  search?: string;
  departmentIds?: string; // Required for 'division' and 'position' types
  divisionIds?: string; // Required for 'position' type
}

// Mock data based on the API contract example
export const mockAPIResult: GetDropdownOptionsData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: [
    {
      id: "uuid-1",
      name: "Head Office Jakarta",
      address: "Jl. Sudirman No. 1",
    },
    { id: "uuid-2", name: "Branch Surabaya", address: "Jl. Pemuda No. 10" },
  ],
  Type: "/v1/mytask/user/dropdown",
};

// Type for the processed data with DeepPartial for flexibility
export type GetDropdownOptionsResult = DeepPartial<
  (
    | BranchOption
    | DepartmentOption
    | DivisionOption
    | PositionOption
    | RoleOption
  )[]
>;

/**
 * Service function to get dropdown options for form fields
 * @param params Query parameters including type and optional search/conditionals
 * @returns Promise containing dropdown options data
 */
export async function getDropdownOptions(
  params: GetDropdownOptionsParams
): Promise<GetDropdownOptionsResult> {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return different mock data based on the type
    if (params.type === "branch") {
      return [
        {
          id: "uuid-1",
          name: "Head Office Jakarta",
          address: "Jl. Sudirman No. 1",
        },
        { id: "uuid-2", name: "Branch Surabaya", address: "Jl. Pemuda No. 10" },
      ];
    } else if (params.type === "department") {
      return [
        { id: "dept-1", name: "IT" },
        { id: "dept-2", name: "Finance" },
      ];
    } else if (params.type === "division") {
      return [
        {
          id: "uuid-1",
          name: "Software Development",
          departmentId: "dept-1",
          departmentName: "IT",
        },
        {
          id: "uuid-2",
          name: "Quality Assurance",
          departmentId: "dept-1",
          departmentName: "IT",
        },
      ];
    } else if (params.type === "position") {
      return [
        {
          id: "pos-1",
          name: "System Administrator",
          divisionId: "uuid-1",
          divisionName: "Software Development",
        },
        {
          id: "pos-2",
          name: "DevOps Engineer",
          divisionId: "uuid-1",
          divisionName: "Software Development",
        },
      ];
    } else if (params.type === "role") {
      return [
        {
          id: "uuid-1",
          name: "Administrator",
          description: "Full system access",
        },
        { id: "uuid-2", name: "Approver", description: "Can approve tasks" },
      ];
    }
    return mockAPIResult.Data;
  }

  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    queryParams.append("type", params.type);
    if (params.search) queryParams.append("search", params.search);
    if (params.departmentIds)
      queryParams.append("departmentIds", params.departmentIds);
    if (params.divisionIds)
      queryParams.append("divisionIds", params.divisionIds);

    const queryString = queryParams.toString();
    const endpoint = `/v1/mytask/user/dropdown?${queryString}`;

    const response = await fetcherBO.get(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
    throw error;
  }
}

/**
 * SWR hook for fetching dropdown options with caching and revalidation
 * @param params Query parameters including type and optional search/conditionals
 * @returns SWR response with data, error, loading state, and mutate function
 */
export const useGetDropdownOptions = (
  params: GetDropdownOptionsParams | null
) => {
  // Create a stable key that includes the parameters to ensure proper SWR caching
  const paramsString = params ? JSON.stringify(params) : "";
  const { data, error, isLoading, mutate } = useSWR(
    params ? `dropdown-options-${paramsString}` : null,
    () => getDropdownOptions(params!)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
