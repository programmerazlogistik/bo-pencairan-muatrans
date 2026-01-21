import { create } from "zustand";

import { NotExportedListFilter } from "@/services/Pencairan/useNotExported";

interface NotExportedState {
  filters: NotExportedListFilter;
  pagination: { pageIndex: number; pageSize: number };
  sorting: any[];
  selectedIds: string[];
  adminFees: Record<string, number | null>;
  bankPengirim: string | null;
}

interface NotExportedActions {
  setFilters: (filters: NotExportedListFilter) => void;
  setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
  setSorting: (sorting: any[]) => void;
  setSelectedIds: (ids: string[]) => void;
  setAdminFee: (bank: string, value: number | null) => void;
  setBankPengirim: (bank: string | null) => void;
  reset: () => void;
}

const initialState: NotExportedState = {
  filters: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  sorting: [],
  selectedIds: [],
  adminFees: {},
  bankPengirim: null,
};

export const useNotExportedStore = create<
  NotExportedState & NotExportedActions
>((set) => ({
  ...initialState,
  setFilters: (filters) =>
    set({ filters, pagination: { ...initialState.pagination } }), // Reset page on filter change
  setPagination: (pagination) => set({ pagination }),
  setSorting: (sorting) => set({ sorting }),
  setSelectedIds: (selectedIds) => set({ selectedIds }),
  setAdminFee: (bank, value) =>
    set((state) => ({
      adminFees: { ...state.adminFees, [bank]: value },
    })),
  setBankPengirim: (bankPengirim) => set({ bankPengirim }),
  reset: () => set(initialState),
}));
