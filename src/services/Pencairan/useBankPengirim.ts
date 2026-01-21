import useSWR from "swr";

import { fetcherMPPInter } from "@/lib/axios";

const USE_MOCK = true;

// --- Types ---

export interface BankPengirimItem {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
}

export interface BankPengirimResponse {
  Data: BankPengirimItem[];
  Message: { Code: number; Text: string };
}

// --- Mock Data ---

const MOCK_BANK_PENGIRIM: BankPengirimItem[] = [
  {
    id: "1",
    bank_name: "BCA",
    account_number: "1234567890",
    account_name: "PT Muat Muat",
  },
  {
    id: "2",
    bank_name: "Mandiri",
    account_number: "0987654321",
    account_name: "PT Muat Muat",
  },
  {
    id: "3",
    bank_name: "BRI",
    account_number: "1122334455",
    account_name: "PT Muat Muat",
  },
  {
    id: "4",
    bank_name: "BNI",
    account_number: "6677889900",
    account_name: "PT Muat Muat",
  },
];

// --- Services ---

export const getBankPengirimList = async (): Promise<BankPengirimResponse> => {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      Data: MOCK_BANK_PENGIRIM,
      Message: { Code: 200, Text: "Success" },
    };
  }

  const response = await fetcherMPPInter.get("/v1/bo/pencairan/bank-pengirim");
  return response.data;
};

// --- Hooks ---

export const useBankPengirimList = () => {
  const { data, error, isLoading } = useSWR(
    "/v1/bo/pencairan/bank-pengirim",
    getBankPengirimList
  );

  return {
    data: data?.Data,
    error,
    isLoading,
  };
};
