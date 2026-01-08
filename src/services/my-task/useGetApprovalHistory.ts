"use client";

import useSWR from "swr";

import { fetcherBO } from "@/lib/axios";

const USE_MOCK = false;

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type ApprovalHistoryStatus = "APPROVED" | "ON_PROGRESS" | "REJECTED";

export type ApprovalHistoryItem = {
  id: string;
  order: number;
  type: "user" | "position";
  actionDate: string;
  userName: string;
  division: string | null;
  position: string | null;
  status: ApprovalHistoryStatus;
  notes: string | null;
};

export type GetApprovalHistoryResponseData = {
  approvalId: string;
  history: ApprovalHistoryItem[];
};

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const mockData: GetApprovalHistoryResponseData = {
  approvalId: "req-001",
  history: [
    {
      id: "approver-002",
      order: 2,
      type: "user",
      actionDate: "24/12/2025 09.15 WIB",
      userName: "John Doe",
      division: "IT Development",
      position: "Senior Developer",
      status: "APPROVED",
      notes: "All verified",
    },
    {
      id: "approver-001",
      order: 1,
      type: "position",
      actionDate: "23/12/2025 14.30 WIB",
      userName: "Admin User",
      division: "Finance Division",
      position: "Manager Finance",
      status: "APPROVED",
      notes: "Document is complete",
    },
  ],
};

// ----------------------------------------------------------------------
// Fetcher
// ----------------------------------------------------------------------

export const getApprovalHistory = async (
  approvalId: string
): Promise<GetApprovalHistoryResponseData> => {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Basic mock validation
    if (!approvalId) throw new Error("Approval ID is required");

    return { ...mockData, approvalId };
  }

  const response = await fetcherBO.get(
    `/v1/mytask/approval/${approvalId}/history`
  );

  return response.data?.Data;
};

// ----------------------------------------------------------------------
// Hook
// ----------------------------------------------------------------------

export const useGetApprovalHistory = (approvalId?: string) => {
  const key = approvalId ? `approval-history-${approvalId}` : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => getApprovalHistory(approvalId!),
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
