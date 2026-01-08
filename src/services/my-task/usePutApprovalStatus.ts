"use client";

import useSWRMutation from "swr/mutation";

import { fetcherBO } from "@/lib/axios";

const USE_MOCK = false;

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type ApprovalStatusAction = "APPROVED" | "ON_PROGRESS" | "REJECTED";

export type UpdateApprovalStatusBody = {
  status: ApprovalStatusAction;
  notes?: string;
};

export type UpdateApprovalStatusResponseData = {
  message: string;
  approvalId: string;
  approverId: string;
  approverType: "user" | "position";
  approverName: string;
  newStatus: ApprovalStatusAction;
};

// Arguments passed to the trigger function
export type UpdateApprovalStatusArgs = {
  approvalId: string;
} & UpdateApprovalStatusBody;

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const mockSuccessResponse = (
  args: UpdateApprovalStatusArgs
): UpdateApprovalStatusResponseData => ({
  message: `Approval ${args.status.toLowerCase().replace("_", " ")} successfully`,
  approvalId: args.approvalId,
  approverId: "approver-002", // derived from token in real app
  approverType: "user",
  approverName: "John Doe", // derived from token in real app
  newStatus: args.status,
});

// ----------------------------------------------------------------------
// Fetcher
// ----------------------------------------------------------------------

/**
 * Validates and updates the approval status.
 * Note: 'url' parameter is the key passed to useSWRMutation,
 * we use the 'arg' to construct the actual dynamic endpoint.
 */
export const updateApprovalStatus = async (
  url: string,
  { arg }: { arg: UpdateApprovalStatusArgs }
): Promise<UpdateApprovalStatusResponseData> => {
  const { approvalId, status, notes } = arg;

  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock Validation: Reject requires notes
    if (status === "REJECTED" && !notes) {
      throw new Error("Notes are required when rejecting");
    }

    // Mock Validation: ID check
    if (!approvalId) {
      throw new Error("Approval ID is required");
    }

    return mockSuccessResponse(arg);
  }

  // Construct dynamic URL
  const endpoint = `/v1/mytask/approval/${approvalId}/status`;

  const response = await fetcherBO.put(endpoint, {
    status,
    notes,
  });

  return response.data?.Data;
};

// ----------------------------------------------------------------------
// Hook
// ----------------------------------------------------------------------

export const usePutApprovalStatus = () => {
  // We use a static key for the mutation hook registration.
  // The actual specific ID is passed when calling trigger({ approvalId: ... })
  const key = "/v1/mytask/approval/status-mutation";

  const { trigger, data, error, isMutating, reset } = useSWRMutation(
    key,
    updateApprovalStatus
  );

  return {
    trigger,
    data,
    error,
    isMutating,
    reset,
  };
};
