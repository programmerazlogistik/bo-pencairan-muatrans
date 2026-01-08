"use client";

import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";

const USE_MOCK = false;

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type ApprovalApprover = {
  id: string;
  order: number;
  status: string;
  type: string;
  userId: string | null;
  userName: string | null;
  positionId: string | null;
  positionName: string | null;
  divisionName: string | null;
  notes: string | null;
  approvedAt: string | null;
  onProgressAt: string | null;
  rejectedAt: string | null;
};

export type ApprovalField = {
  key: string;
  label: string;
  value: string | null;
  type?: string;
};

export type ApprovalSection = {
  title: string;
  fields: ApprovalField[];
};

export type ApprovalDetail = {
  id: string;
  taskId: string;
  name: string;
  moduleId: string;
  moduleName: string;
  menuId: string;
  menuName: string;
  status: string;
  approvers: ApprovalApprover[];
  sections: ApprovalSection[];
  createdAt: string;
  updatedAt: string;
};

export type GetApprovalDetailResponseData = ApprovalDetail;

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const mockData: ApprovalDetail = {
  id: "02be1ee0-2396-48ce-a835-a6a206762587",
  taskId: "c08ca492-65e9-4703-9c4a-a6ba18c1c621",
  name: "Master Kategori Test - CAT-1767679861532",
  moduleId: "2d1156a4-897a-4805-a56b-e0e4800d8798",
  moduleName: "Test Module",
  menuId: "67fa52ea-be55-452b-8092-a37b050060b6",
  menuName: "Master Kategori Test",
  status: "PENDING",
  approvers: [
    {
      id: "fa584602-a9d8-409f-8f8c-d0af67ef71ac",
      order: 1,
      status: "PENDING",
      type: "position",
      userId: null,
      userName: null,
      positionId: "f0000001-0000-0000-0000-000000000010",
      positionName: "Staff Business Analyst",
      divisionName: "Business Analyst",
      notes: null,
      approvedAt: null,
      onProgressAt: null,
      rejectedAt: null,
    },
    {
      id: "4c3d9bac-1e95-48a3-93db-38c3fb588e0e",
      order: 2,
      status: "PENDING",
      type: "position",
      userId: null,
      userName: null,
      positionId: "f0000001-0000-0000-0000-00000000000b",
      positionName: "Staff Analyst",
      divisionName: "Analyst",
      notes: null,
      approvedAt: null,
      onProgressAt: null,
      rejectedAt: null,
    },
    {
      id: "6c42c811-331b-4771-a37f-54ee47060706",
      order: 2,
      status: "PENDING",
      type: "user",
      userId: "6837961f-6f66-4791-944e-80ccd39ca1bd",
      userName: "Backend Approval 5 Edit",
      positionId: null,
      positionName: null,
      divisionName: null,
      notes: null,
      approvedAt: null,
      onProgressAt: null,
      rejectedAt: null,
    },
  ],
  sections: [
    {
      title: "Informasi Dasar",
      fields: [
        {
          key: "id",
          label: "ID",
          value: "c08ca492-65e9-4703-9c4a-a6ba18c1c621",
        },
        {
          key: "code",
          label: "Kode",
          value: "CAT-1767679861532",
        },
        {
          key: "name",
          label: "Nama",
          value: "Test Category 1767679861532",
        },
        {
          key: "description",
          label: "Deskripsi",
          value: "Auto-generated test category",
        },
      ],
    },
    {
      title: "Status Approval",
      fields: [
        {
          key: "approvalStatus",
          label: "Status Approval",
          value: "PENDING",
        },
        {
          key: "approvedAt",
          label: "Tanggal Disetujui",
          value: null,
        },
        {
          key: "rejectedAt",
          label: "Tanggal Ditolak",
          value: null,
        },
        {
          key: "rejectionReason",
          label: "Alasan Penolakan",
          value: null,
        },
      ],
    },
    {
      title: "Waktu",
      fields: [
        {
          key: "createdAt",
          label: "Tanggal Dibuat",
          value: "06/01/26 13.11 WIB",
        },
        {
          key: "updatedAt",
          label: "Terakhir Diupdate",
          value: "06/01/26 13.11 WIB",
        },
      ],
    },
  ],
  createdAt: "06/01/2026 13.11",
  updatedAt: "06/01/2026 13.11",
};

// ----------------------------------------------------------------------
// Fetcher
// ----------------------------------------------------------------------

export const getApprovalDetail = async (
  approvalId: string
): Promise<GetApprovalDetailResponseData> => {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!approvalId) throw new Error("ID required");

    return { ...mockData, id: approvalId };
  }

  const response = await fetcherBO.get(`/v1/mytask/approval/${approvalId}`);

  return response.data?.Data;
};

// ----------------------------------------------------------------------
// Hook
// ----------------------------------------------------------------------

export const useGetApprovalDetail = (approvalId?: string) => {
  const key = approvalId ? `approval-detail-${approvalId}` : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => getApprovalDetail(approvalId!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
