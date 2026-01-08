import { create } from "zustand";

interface BoMyTaskState {
  selectedModuleId: string;
  sortBy: string;
  statusFilter: "new" | "in_progress";
  setSelectedModuleId: (id: string) => void;
  setSortBy: (sortBy: string) => void;
  setStatusFilter: (status: "new" | "in_progress") => void;
}

export const useBoMyTaskStore = create<BoMyTaskState>((set) => ({
  selectedModuleId: "",
  sortBy: "id-newest",
  statusFilter: "new",
  setSelectedModuleId: (id: string) => set({ selectedModuleId: id }),
  setSortBy: (sortBy: string) => set({ sortBy }),
  setStatusFilter: (status: "new" | "in_progress") =>
    set({ statusFilter: status }),
}));
