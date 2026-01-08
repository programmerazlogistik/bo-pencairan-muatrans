import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";
import type { DeepPartial } from "@/lib/typescript-utils";

const USE_MOCK = false;

// Define types based on the API contract
export interface QueryColumn {
  field: string;
  alias: string;
  label: string;
  format?: string;
}

export interface QueryListConfig {
  connection: string;
  table: string;
  referenceKey: string;
  columns: QueryColumn[];
}

export interface QueryDetailSection {
  title: string;
  columns: QueryColumn[];
}

export interface ApprovalAction {
  column: string;
  value: string;
  type: string;
}

export interface QueryDetailsConfig {
  connection: string;
  table: string;
  referenceKey: string;
  sections: QueryDetailSection[];
  onApprove: ApprovalAction[];
  onReject: ApprovalAction[];
  onProgress: ApprovalAction[];
}

export interface Approval {
  id: string;
  order: number;
  type: "position" | "user";
  userId: string | null;
  userName: string | null;
  positionId: string | null;
  positionName: string | null;
  operator: string | null;
}

export interface DetailApprovalConfig {
  id: string;
  moduleId: string;
  moduleName: string;
  menuId: string;
  menuName: string;
  name: string;
  queryList: QueryListConfig;
  queryDetails: QueryDetailsConfig;
  onApprove: ApprovalAction[];
  onReject: ApprovalAction[];
  onProgress: ApprovalAction[];
  approvals: Approval[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetDetailApprovalConfigData {
  Message: {
    Code: number;
    Text: string;
  };
  Data: DetailApprovalConfig;
  Type: string;
}

// Mock data based on the API contract example
export const mockAPIResult: GetDetailApprovalConfigData = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    id: "20504d6e-3c04-45fe-96d6-01e583278772",
    moduleId: "2d1156a4-897a-4805-a56b-e0e4800d8798",
    moduleName: "Test Module",
    menuId: "67fa52ea-be55-452b-8092-a37b050060b6",
    menuName: "Master Kategori Test",
    name: "Master Komisi - Updated",
    queryList: {
      connection: "mytask",
      table: "dbt_mytask_test_table_master_categories",
      referenceKey: "id",
      columns: [
        {
          field: "code",
          alias: "categoryCode",
          label: "Kode Kategori",
        },
        {
          field: "name",
          alias: "categoryName",
          label: "Nama Kategori",
        },
        {
          field: "approval_status",
          alias: "status",
          label: "Status",
        },
        {
          field: "updated_at",
          alias: "updatedAt",
          label: "Tanggal Update",
          format: "datetime",
        },
      ],
    },
    queryDetails: {
      connection: "mytask",
      table: "dbt_mytask_test_table_master_categories",
      referenceKey: "id",
      sections: [
        {
          title: "Detail Informasi",
          columns: [
            {
              field: "id",
              alias: "categoryId",
              label: "ID Kategori",
            },
            {
              field: "code",
              alias: "code",
              label: "Kode",
            },
            {
              field: "name",
              alias: "name",
              label: "Nama",
            },
            {
              field: "description",
              alias: "description",
              label: "Deskripsi",
            },
          ],
        },
        {
          title: "Status & Timeline",
          columns: [
            {
              field: "approval_status",
              alias: "approvalStatus",
              label: "Status Approval",
            },
            {
              field: "created_at",
              alias: "createdAt",
              label: "Tanggal Dibuat",
              format: "datetime",
            },
            {
              field: "updated_at",
              alias: "updatedAt",
              label: "Tanggal Update",
              format: "datetime",
            },
            {
              field: "approved_at",
              alias: "approvedAt",
              label: "Tanggal Approve",
              format: "datetime",
            },
            {
              field: "rejected_at",
              alias: "rejectedAt",
              label: "Tanggal Reject",
              format: "datetime",
            },
          ],
        },
      ],
      onApprove: [
        {
          column: "approval_status",
          value: "APPROVED",
          type: "string",
        },
        {
          column: "approved_at",
          value: "NOW()",
          type: "datetime",
        },
        {
          column: "approved_by",
          value: ":userId",
          type: "uuid",
        },
      ],
      onReject: [
        {
          column: "approval_status",
          value: "REJECTED",
          type: "string",
        },
        {
          column: "rejected_at",
          value: "NOW()",
          type: "datetime",
        },
        {
          column: "rejected_by",
          value: ":userId",
          type: "uuid",
        },
        {
          column: "rejection_reason",
          value: ":notes",
          type: "string",
        },
      ],
      onProgress: [],
    },
    onApprove: [
      {
        column: "approval_status",
        value: "APPROVED",
        type: "string",
      },
      {
        column: "approved_at",
        value: "NOW()",
        type: "datetime",
      },
      {
        column: "approved_by",
        value: ":userId",
        type: "uuid",
      },
    ],
    onReject: [
      {
        column: "approval_status",
        value: "REJECTED",
        type: "string",
      },
      {
        column: "rejected_at",
        value: "NOW()",
        type: "datetime",
      },
      {
        column: "rejected_by",
        value: ":userId",
        type: "uuid",
      },
      {
        column: "rejection_reason",
        value: ":notes",
        type: "string",
      },
    ],
    onProgress: [],
    approvals: [
      {
        id: "a9077381-f41f-44c9-891b-407fe882e0d8",
        order: 1,
        type: "position",
        userId: null,
        userName: null,
        positionId: "f0000001-0000-0000-0000-000000000010",
        positionName: "Staff Business Analyst",
        operator: "AND",
      },
      {
        id: "9e349a3a-fe26-4f7f-8269-5a26c64ce12f",
        order: 2,
        type: "position",
        userId: null,
        userName: null,
        positionId: "f0000001-0000-0000-0000-00000000000b",
        positionName: "Staff Analyst",
        operator: "OR",
      },
      {
        id: "fa6eacf9-a795-4110-b9a7-01aec1d43fab",
        order: 2,
        type: "user",
        userId: "6837961f-6f66-4791-944e-80ccd39ca1bd",
        userName: "Backend Approval 5 Edit",
        positionId: null,
        positionName: null,
        operator: null,
      },
    ],
    isActive: true,
    createdAt: "2025-12-25 22:58:28",
    updatedAt: "2026-01-06 21:06:10",
  },
  Type: "/v1/mytask/setting-approval/20504d6e-3c04-45fe-96d6-01e583278772",
};

// Type for the processed data with DeepPartial for flexibility
export type GetDetailApprovalConfigResult = DeepPartial<DetailApprovalConfig>;

/**
 * Service function to get detail of an approval configuration
 * @param configId The ID of the approval configuration to get details for
 * @returns Promise containing the approval configuration detail data
 */
export async function getDetailApprovalConfig(
  configId: string
): Promise<GetDetailApprovalConfigResult> {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAPIResult.Data;
  }

  try {
    const endpoint = `/v1/mytask/setting-approval/${configId}`;
    const response = await fetcherBO.get(endpoint);
    return response.data?.Data;
  } catch (error) {
    console.error("Error fetching approval config detail:", error);
    throw error;
  }
}

/**
 * SWR hook for fetching approval configuration detail with caching and revalidation
 * @param configId The ID of the approval configuration to get details for
 * @returns SWR response with data, error, loading state, and mutate function
 */
export const useGetDetailApprovalConfig = (configId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    configId ? `approval-config-detail-${configId}` : null,
    () => getDetailApprovalConfig(configId)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
